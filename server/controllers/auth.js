const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { debug, success, error } = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || password.length < 1) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    res.send('Register Successfully');
  } catch (err) {
    error('Register failed', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !user.enabled) return res.status(400).json({ message: "User not found or not enabled" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    res.json({ payload, token });
  } catch (err) {
    error('Login failed', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        discordId: true,
        avatar: true,
        googleId: true,
      }
    });

    res.json({ user });
  } catch (err) {
    error('Failed to get current user', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.discordAuth = (req, res) => {
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email`;
  res.redirect(authUrl);
};

exports.discordCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: 'Missing code' });

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: 'identify email',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const discordUser = userResponse.data;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { discordId: discordUser.id },
          { email: discordUser.email }
        ]
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: discordUser.email,
          name: discordUser.username,
          discordId: discordUser.id,
          avatar: discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          verified: true,
        }
      });
    } else if (!user.discordId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          discordId: discordUser.id,
          avatar: discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null
        }
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    // ✅ Redirect ไป frontend พร้อม token
    res.redirect(`${process.env.CLIENT_URL}/discord/callback?token=${token}`);
  } catch (err) {
    console.error("Discord auth failed", err);
    res.status(500).json({ message: 'Discord login failed' });
  }
};


exports.googleAuth = (req, res) => {
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}&response_type=code&scope=openid%20email%20profile`;
  res.redirect(redirectUrl);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Missing code" });

    // แลก code เป็น token
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // ดึงข้อมูลผู้ใช้จาก Google
    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const googleUser = userResponse.data;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.id },
          { email: googleUser.email }
        ]
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.id,
          avatar: googleUser.picture,
          verified: true,
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.id,
          avatar: googleUser.picture
        }
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });

    // ✅ Redirect กลับไปยัง frontend
    res.redirect(`${process.env.CLIENT_URL}/google/callback?token=${token}`);
  } catch (err) {
    console.error("Google login failed", err);
    res.status(500).json({ message: "Google login failed" });
  }
};