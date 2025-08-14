const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getStudentProgress,
  getCourseProgress,
  updateModuleProgress,
  submitQuizAttempt,
  getLearningAnalytics,
  getLearningGaps
} = require('../controllers/progressController');

// All routes require authentication
router.use(protect);

// Student progress overview
router.get('/', getStudentProgress);

// Course-specific progress
router.get('/course/:courseId', getCourseProgress);

// Update module progress
router.put('/course/:courseId/module/:moduleId', updateModuleProgress);

// Submit quiz attempt
router.post('/course/:courseId/quiz/:quizId/attempt', submitQuizAttempt);

// Learning analytics
router.get('/analytics', getLearningAnalytics);

// Learning gaps and recommendations
router.get('/gaps', getLearningGaps);

module.exports = router;
