const express = require('express');
const router = express.Router();
const { protect, admin, optionalAuth } = require('../middleware/authMiddleware');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  toggleCoursePublish,
  addModule,
  updateModule,
  deleteModule,
  getCourseStats
} = require('../controllers/courseController');

// Public routes (with optional auth)
router.get('/', optionalAuth, getAllCourses);
router.get('/:courseId', optionalAuth, getCourseById);

// Admin routes (require admin role)
router.post('/', protect, admin, createCourse);
router.put('/:courseId', protect, admin, updateCourse);
router.delete('/:courseId', protect, admin, deleteCourse);
router.put('/:courseId/publish', protect, admin, toggleCoursePublish);
router.get('/:courseId/stats', protect, admin, getCourseStats);

// Module management (Admin only)
router.post('/:courseId/modules', protect, admin, addModule);
router.put('/:courseId/modules/:moduleId', protect, admin, updateModule);
router.delete('/:courseId/modules/:moduleId', protect, admin, deleteModule);

module.exports = router;
