const express = require('express');
const router = express.Router();
const {
  register,
  login,
  currentUser,
  discordAuth,
  discordCallback,
  googleAuth,
  googleCallback
} = require('../controllers/auth');
const { authCheck, adminCheck } = require('../middlewares/authCheck');

router.post('/register', register);
router.post('/login', login);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);

// Discord OAuth
router.get('/discord', discordAuth);
router.get('/discord/callback', discordCallback);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);


module.exports = router;
