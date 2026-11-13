const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/Report');

// ── Helper: generate JWT ──────────────────────────────────────────────────────
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

// ── Helper: nodemailer transporter ───────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── Helper: build reset email HTML ───────────────────────────────────────────
const buildResetEmail = (fullName, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { margin:0; padding:0; background:#0d0618; font-family:'Segoe UI',sans-serif; }
    .wrap { max-width:580px; margin:40px auto; }
    .header { background:linear-gradient(135deg,#1a0533,#0d1b4b); padding:40px 32px; border-radius:16px 16px 0 0; text-align:center; }
    .header h1 { margin:0; font-size:28px; color:#f5c518; letter-spacing:2px; }
    .header p  { margin:8px 0 0; color:#ffffff80; font-size:13px; }
    .body { background:#160428; border:1px solid #f5c51820; border-top:none; padding:36px 32px; border-radius:0 0 16px 16px; }
    .greeting { color:#ffffffcc; font-size:16px; margin-bottom:16px; }
    .msg { color:#ffffff80; font-size:14px; line-height:1.7; margin-bottom:28px; }
    .btn { display:inline-block; background:linear-gradient(135deg,#f5c518,#d4a500);
           color:#0d0618; font-weight:700; font-size:15px; padding:14px 36px;
           border-radius:10px; text-decoration:none; }
    .expire { color:#ffffff40; font-size:12px; margin-top:24px; }
    .link-box { background:#ffffff08; border:1px solid #f5c51820; border-radius:8px;
                padding:12px 16px; margin-top:20px; word-break:break-all;
                color:#f5c51880; font-size:12px; }
    .footer { text-align:center; color:#ffffff20; font-size:11px; margin-top:28px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>🌟 AstroVision</h1>
      <p>Your Cosmic Blueprint Platform</p>
    </div>
    <div class="body">
      <p class="greeting">Hello, <strong style="color:#f5c518">${fullName}</strong> 👋</p>
      <p class="msg">
        We received a request to reset the password for your AstroVision account.<br/>
        Click the button below to set a new password. This link is valid for
        <strong style="color:#ffffffcc">1 hour</strong>.
      </p>
      <div style="text-align:center;">
        <a href="${resetUrl}" class="btn">🔑 Reset My Password</a>
      </div>
      <p class="expire">If the button doesn't work, copy and paste this link into your browser:</p>
      <div class="link-box">${resetUrl}</div>
      <p class="expire" style="margin-top:28px">
        If you did not request a password reset, you can safely ignore this email —
        your password will remain unchanged.
      </p>
    </div>
    <p class="footer">© 2024 AstroVision · Powered by FreeAstrologyAPI</p>
  </div>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (fullName.trim().length < 2)
      return res.status(400).json({ success: false, message: 'Full name must be at least 2 characters.' });

    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const user = await User.create({ fullName: fullName.trim(), email: email.toLowerCase(), password });
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { token, user: { id: user._id, fullName: user.fullName, email: user.email, createdAt: user.createdAt } },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user: { id: user._id, fullName: user.fullName, email: user.email, createdAt: user.createdAt } },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const reportCount = await Report.countDocuments({ userId: req.user.id });
    return res.status(200).json({
      success: true,
      data: { user: { id: user._id, fullName: user.fullName, email: user.email, createdAt: user.createdAt, reportCount } },
    });
  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error while fetching profile.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Forgot password — send reset link to email
// @route   POST /api/auth/forgot-password
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email is registered, a reset link has been sent.',
      });
    }

    // Generate a secure random token (plain — stored as hashed)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build reset URL pointing at the frontend
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

    // ── Dev mode: always log to console ──────────────────────────────────────
    console.log('\n🔑 Password Reset Link (dev):');
    console.log(resetUrl);
    console.log('(Expires in 1 hour)\n');

    // ── Try to send email ─────────────────────────────────────────────────────
    let emailSent = false;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"AstroVision 🌟" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: '🔑 Reset Your AstroVision Password',
          html: buildResetEmail(user.fullName, resetUrl),
        });
        emailSent = true;
        console.log(`✅ Reset email sent to ${user.email}`);
      } catch (mailErr) {
        console.error('Email send error:', mailErr.message);
        // Don't fail the request — dev link is still in console
      }
    } else {
      console.log('ℹ️  EMAIL_USER/EMAIL_PASS not set — email not sent. Use console link above.');
    }

    // In development, return the reset URL so it can be tested without email
    const responseData =
      process.env.NODE_ENV === 'development'
        ? { resetUrl } // Visible in dev for easy testing
        : {};

    return res.status(200).json({
      success: true,
      message: emailSent
        ? `A password reset link has been sent to ${user.email}.`
        : 'If that email is registered, a reset link has been sent.',
      data: responseData,
    });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate inputs
    if (!token)
      return res.status(400).json({ success: false, message: 'Reset token is missing.' });

    if (!password || !confirmPassword)
      return res.status(400).json({ success: false, message: 'Password and confirm password are required.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });

    // Hash the raw token from URL to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Update password and clear reset fields
    user.password = password; // pre-save hook will hash it
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Auto-login: return a fresh JWT
    const jwtToken = generateToken(user);

    console.log(`✅ Password reset successful for ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You are now logged in.',
      data: {
        token: jwtToken,
        user: { id: user._id, fullName: user.fullName, email: user.email, createdAt: user.createdAt },
      },
    });
  } catch (err) {
    console.error('Reset password error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify that a reset token is still valid (before showing reset form)
// @route   GET /api/auth/reset-password/:token/verify
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Token is valid.',
      data: { email: user.email },
    });
  } catch (err) {
    console.error('Verify token error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getProfile, forgotPassword, resetPassword, verifyResetToken };
