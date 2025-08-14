const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');

// Enroll in Course
exports.enrollInCourse = async (req, res) => {
  try {
    // Handle both URL param and body courseId
    const courseId = req.params.courseId || req.body.courseId;
    const userId = req.user._id;

    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Course is not published yet'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      status: 'enrolled'
    });

    await enrollment.save();

    // Initialize progress tracking
    const progress = new Progress({
      user: userId,
      course: courseId,
      moduleProgress: course.modules.map(module => ({
        moduleId: module._id,
        title: module.title,
        timeSpent: 0,
        completed: false,
        attempts: 0
      })),
      quizProgress: course.quizzes.map(quiz => ({
        quizId: quiz._id,
        title: quiz.title,
        attempts: [],
        bestScore: 0,
        totalAttempts: 0
      }))
    });

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        enrollment,
        progress
      }
    });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get User Enrollments
exports.getUserEnrollments = async (req, res) => {
  try {
    const userId = req.user._id;

    const enrollments = await Enrollment.find({ user: userId })
      .populate('course', 'title description category level duration modules')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      data: {
        enrollments
      }
    });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Enrollment Details
exports.getEnrollmentDetails = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    }).populate('course', 'title description category level duration modules quizzes');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Get progress data
    const progress = await Progress.findOne({
      user: userId,
      course: enrollment.course._id
    });

    res.json({
      success: true,
      data: {
        enrollment,
        progress
      }
    });
  } catch (error) {
    console.error('Get enrollment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Mark Module as Complete
exports.completeModule = async (req, res) => {
  try {
    const { enrollmentId, moduleId } = req.params;
    const { score, timeSpent } = req.body;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update progress
    const progress = await Progress.findOne({
      user: userId,
      course: enrollment.course
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    const moduleProgress = progress.moduleProgress.find(
      mp => mp.moduleId.toString() === moduleId
    );

    if (!moduleProgress) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Update module progress
    moduleProgress.completed = true;
    moduleProgress.completedAt = new Date();
    moduleProgress.score = score || 100;
    moduleProgress.timeSpent = timeSpent || 0;
    moduleProgress.attempts = (moduleProgress.attempts || 0) + 1;

    // Recalculate analytics
    progress.calculateAnalytics();
    progress.identifyGaps();

    await progress.save();

    // Update enrollment progress
    enrollment.progress = progress.learningAnalytics.completionRate;
    enrollment.lastAccessed = new Date();

    // Check if course is completed
    enrollment.checkCompletion();

    await enrollment.save();

    res.json({
      success: true,
      message: 'Module completed successfully',
      data: {
        moduleProgress,
        overallProgress: enrollment.progress,
        status: enrollment.status
      }
    });
  } catch (error) {
    console.error('Complete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Submit Quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { enrollmentId, quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Get course and quiz details
    const course = await Course.findById(enrollment.course);
    const quiz = course.quizzes.find(q => q._id.toString() === quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Update progress
    const progress = await Progress.findOne({
      user: userId,
      course: enrollment.course
    });

    const quizProgress = progress.quizProgress.find(
      qp => qp.quizId.toString() === quizId
    );

    if (quizProgress) {
      const attemptNumber = quizProgress.attempts.length + 1;
      
      quizProgress.attempts.push({
        attemptNumber,
        score,
        correctAnswers,
        totalQuestions,
        timeTaken,
        attemptedAt: new Date(),
        passed
      });

      quizProgress.totalAttempts = attemptNumber;
      quizProgress.bestScore = Math.max(quizProgress.bestScore, score);
    }

    await progress.save();

    // Update enrollment
    enrollment.lastAccessed = new Date();
    await enrollment.save();

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        correctAnswers,
        totalQuestions,
        passed,
        bestScore: quizProgress.bestScore
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Drop Course
exports.dropCourse = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      _id: enrollmentId,
      user: userId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    enrollment.status = 'dropped';
    await enrollment.save();

    res.json({
      success: true,
      message: 'Course dropped successfully'
    });
  } catch (error) {
    console.error('Drop course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Learning Analytics
exports.getLearningAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.find({ user: userId })
      .populate('course', 'title category level');

    const analytics = {
      totalCourses: progress.length,
      totalTimeSpent: 0,
      averageScore: 0,
      completionRate: 0,
      learningGaps: [],
      recommendations: []
    };

    if (progress.length > 0) {
      analytics.totalTimeSpent = progress.reduce((sum, p) => sum + p.learningAnalytics.totalTimeSpent, 0);
      analytics.averageScore = progress.reduce((sum, p) => sum + p.learningAnalytics.averageScore, 0) / progress.length;
      analytics.completionRate = progress.reduce((sum, p) => sum + p.learningAnalytics.completionRate, 0) / progress.length;

      // Collect learning gaps and recommendations
      progress.forEach(p => {
        analytics.learningGaps.push(...p.learningGaps);
        analytics.recommendations.push(...p.recommendations);
      });
    }

    res.json({
      success: true,
      data: {
        analytics
      }
    });
  } catch (error) {
    console.error('Get learning analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
