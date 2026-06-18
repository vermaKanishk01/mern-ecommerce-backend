const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const validator = require("validator");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};


const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required", });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address", });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters", });
    }

    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered",});
    }

    let avatar = {
      public_id: null,
      url: null,
    };

    if (req.file) {

      try {
        const uploadedAvatar =
          await cloudinary.uploader.upload(req.file.path, {
            folder: "myapp/users",
            width: 250,
            height: 250,
            crop: "fill",
            gravity: "face",
          });

        avatar = {
          public_id: uploadedAvatar.public_id,
          url: uploadedAvatar.secure_url,
        };
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ success: false, message: "Failed to upload avatar", error: uploadError.message, });
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }

    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      avatar,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required", });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials", });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials", });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password before sending response
    user.password = undefined;

    res.status(200).json({ success: true, message: "Login successful", token, data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message, });
  }
};


const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Set new password
    user.password = newPassword;

    // Important: invalidate old tokens
    user.passwordChangedAt = Date.now();

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: true, message: "If this email exists, a reset link has been sent" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // store hashed token in the database
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Frontend URL (NOT backend API)
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const html = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset.</p>
      <p>Click below to reset your password:</p>
      <a href="${resetURL}" target="_blank">${resetURL}</a>
      <p>This link expires in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      html,
    });

    res.json({ success: true, message: "Password reset email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email could not be sent" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Token is invalid or expired" });
    }

    user.password = password;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    user.passwordChangedAt = Date.now();

    await user.save();

    res.json({ success: true, message: "Password reset successful", });

  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong", });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
}