import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getIsDbConnected } from '../config/db.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_dev_key_services_directory_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المستخدم وكلمة المرور'
      });
    }

    if (!getIsDbConnected()) {
      // In-Memory Mode Auth
      if (username === 'admin' && password === 'admin123') {
        const token = generateToken('admin-local-id');
        return res.status(200).json({
          success: true,
          message: 'تم تسجيل الدخول بنجاح',
          token,
          user: {
            id: 'admin-local-id',
            username: 'admin',
            role: 'admin'
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
        });
      }
    }

    // Database Mode Auth
    const user = await User.findOne({ username }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم وكلمة المرور'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user || { id: 'admin-local-id', username: 'admin', role: 'admin' }
  });
};
