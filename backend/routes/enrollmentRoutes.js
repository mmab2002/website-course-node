const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  enrollInCourse,
  getUserEnrollments,
  getEnrollmentDetails,
  completeModule,
  submitQuiz,
  dropCourse,
  getLearningAnalytics
} = require('../controllers/enrollmentController');

// All routes require authentication
router.use(protect);

// Course enrollment
router.post('/', enrollInCourse); // POST /api/enrollments with courseId in body
router.post('/courses/:courseId/enroll', enrollInCourse); // Alternative route

// Get user enrollments and progress
router.get('/my', getUserEnrollments);
router.get('/:enrollmentId', getEnrollmentDetails);

// Learning progress
router.put('/enrollments/:enrollmentId/modules/:moduleId/complete', completeModule);
router.post('/enrollments/:enrollmentId/quizzes/:quizId/submit', submitQuiz);

// Course management
router.put('/enrollments/:enrollmentId/drop', dropCourse);

// Analytics
router.get('/analytics', getLearningAnalytics);

module.exports = router;
