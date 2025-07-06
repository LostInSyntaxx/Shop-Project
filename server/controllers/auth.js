const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;


exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password || password.length < 6) {
      return res.status(400).json({
        message: "Please provide all required fields and password must be at least 6 characters"
      });
    }

    // Check for existing email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username is already in use" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: "user",
        enabled: true
      }
    });

    res.json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({
        message: "Please enter email/username and password"
      });
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ],
      }
    });

    if (!user || !user.enabled) {
      return res.status(400).json({
        message: "Account not found or has been disabled"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }


    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      discordId: updatedUser.discordId,
      googleId: updatedUser.googleId,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      lastLoginAt: updatedUser.lastLoginAt,
      address: updatedUser.address
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });

    res.json({
      message: "Login successful",
      payload,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error. Please try again.' });
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
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      }
    });

    res.json({ user });
  } catch (err) {
    console.error('Failed to get current user:', err);
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
          username: discordUser.username,
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          createdAt: new Date()
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


// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ตั้งค่า multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware สำหรับอัพโหลดไฟล์
exports.uploadProfilePicture = async (req, res) => {
  try {
    // ใช้ upload.single middleware
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || 'Error uploading file'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      try {
        // อัพโหลดไป Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              transformation: [
                { width: 400, height: 400, crop: 'fill' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          // ส่งไฟล์ไป Cloudinary
          uploadStream.end(req.file.buffer);
        });

        // อัพเดทข้อมูลใน Database
        const user = await prisma.user.update({
          where: { id: req.user.id },
          data: { avatar: result.secure_url },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true
          }
        });

        res.json({
          message: 'Profile picture uploaded successfully',
          user: user,
          avatarUrl: result.secure_url
        });

      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
          message: 'Failed to upload to Cloudinary'
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// อัพเดทรูปโปรไฟล์
exports.updateProfilePicture = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || 'Error uploading file'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded'
        });
      }

      try {
        // อัพโหลดไป Cloudinary
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'avatars',
              transformation: [
                { width: 400, height: 400, crop: 'fill' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(req.file.buffer);
        });

        // อัพเดท user ใน database
        const user = await prisma.user.update({
          where: { id: req.user.id },
          data: { avatar: result.secure_url },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true
          }
        });

        res.json({
          message: 'Profile picture updated successfully',
          user: user,
          avatarUrl: result.secure_url
        });

      } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
          message: 'Failed to update profile picture'
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: null },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true
      }
    });

    res.json({
      message: 'Profile picture deleted successfully',
      user: user
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      message: 'Failed to delete profile picture'
    });
  }
};


