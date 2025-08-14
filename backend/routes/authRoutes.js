
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes (require admin role)
router.get('/users', protect, admin, getAllUsers);
router.post('/users', protect, admin, createUser);
router.get('/users/:userId', protect, admin, getUserById);
router.put('/users/:userId', protect, admin, updateUser);
router.delete('/users/:userId', protect, admin, deleteUser);
router.put('/users/:userId/role', protect, admin, updateUserRole);
router.put('/users/:userId/status', protect, admin, toggleUserStatus);

module.exports = router;
