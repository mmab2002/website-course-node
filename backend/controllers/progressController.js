const Progress = require('../models/Progress');
const Course = require('../models/Course');
const User = require('../models/User');

// Get student progress overview
exports.getStudentProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all progress records for the user
    const progressRecords = await Progress.find({ user: userId })
      .populate('course', 'title description level duration')
      .populate('user', 'firstName lastName email');
    
    // Calculate overall statistics
    const totalCourses = progressRecords.length;
    const completedCourses = progressRecords.filter(p => p.learningAnalytics.completionRate === 100).length;
    const inProgressCourses = progressRecords.filter(p => p.learningAnalytics.completionRate > 0 && p.learningAnalytics.completionRate < 100).length;
    const totalTimeSpent = progressRecords.reduce((total, p) => total + p.learningAnalytics.totalTimeSpent, 0);
    const averageScore = progressRecords.reduce((sum, p) => sum + p.learningAnalytics.averageScore, 0) / (totalCourses || 1);

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          totalTimeSpent: Math.round(totalTimeSpent),
          averageScore: Math.round(averageScore * 10) / 10
        },
        progressRecords
      }
    });
  } catch (error) {
    console.error('Get student progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get progress for a specific course
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;
    
    let progress = await Progress.findOne({ user: userId, course: courseId })
      .populate('course', 'title description modules quizzes')
      .populate('user', 'firstName lastName');
    
    if (!progress) {
      // Create initial progress record if it doesn't exist
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
      
      progress = new Progress({
        user: userId,
        course: courseId,
        moduleProgress: course.modules.map((module, index) => ({
          moduleId: module._id,
          title: module.title,
          timeSpent: 0,
          completed: false,
          score: 0,
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
      progress = await Progress.findById(progress._id)
        .populate('course', 'title description modules quizzes')
        .populate('user', 'firstName lastName');
    }
    
    res.json({
      success: true,
      data: {
        progress
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update module progress
exports.updateModuleProgress = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const { timeSpent, completed, score } = req.body;
    const userId = req.user.userId;
    
    let progress = await Progress.findOne({ user: userId, course: courseId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    
    // Find and update the specific module progress
    const moduleProgressIndex = progress.moduleProgress.findIndex(
      module => module.moduleId.toString() === moduleId
    );
    
    if (moduleProgressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Module not found in progress'
      });
    }
    
    const moduleProgress = progress.moduleProgress[moduleProgressIndex];
    
    // Update module progress
    if (timeSpent !== undefined) {
      moduleProgress.timeSpent = (moduleProgress.timeSpent || 0) + timeSpent;
    }
    if (completed !== undefined) {
      moduleProgress.completed = completed;
      if (completed) {
        moduleProgress.completedAt = new Date();
      }
    }
    if (score !== undefined) {
      moduleProgress.score = score;
    }
    
    moduleProgress.attempts = (moduleProgress.attempts || 0) + 1;
    
    // Recalculate analytics
    progress.calculateAnalytics();
    progress.identifyGaps();
    progress.updatedAt = new Date();
    
    await progress.save();
    
    res.json({
      success: true,
      message: 'Module progress updated successfully',
      data: {
        moduleProgress
      }
    });
  } catch (error) {
    console.error('Update module progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.userId;
    
    let progress = await Progress.findOne({ user: userId, course: courseId })
      .populate('course');
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    
    // Find the quiz in the course
    const quiz = progress.course.quizzes.find(q => q._id.toString() === quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= (quiz.passingScore || 70);
    
    // Find and update quiz progress
    const quizProgressIndex = progress.quizProgress.findIndex(
      q => q.quizId.toString() === quizId
    );
    
    if (quizProgressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found in progress'
      });
    }
    
    const quizProgress = progress.quizProgress[quizProgressIndex];
    const attemptNumber = (quizProgress.totalAttempts || 0) + 1;
    
    // Add new attempt
    quizProgress.attempts.push({
      attemptNumber,
      score,
      correctAnswers,
      totalQuestions,
      timeTaken: timeTaken || 0,
      attemptedAt: new Date(),
      passed
    });
    
    quizProgress.totalAttempts = attemptNumber;
    quizProgress.bestScore = Math.max(quizProgress.bestScore || 0, score);
    
    // Update overall analytics
    progress.calculateAnalytics();
    progress.identifyGaps();
    progress.learningAnalytics.lastStudySession = new Date();
    
    await progress.save();
    
    res.json({
      success: true,
      message: 'Quiz attempt submitted successfully',
      data: {
        attempt: {
          score,
          correctAnswers,
          totalQuestions,
          passed,
          timeTaken,
          attemptNumber
        },
        quizProgress
      }
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get learning analytics
exports.getLearningAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const progressRecords = await Progress.find({ user: userId })
      .populate('course', 'title category level');
    
    // Calculate comprehensive analytics
    const analytics = {
      totalCourses: progressRecords.length,
      completedCourses: 0,
      inProgressCourses: 0,
      totalTimeSpent: 0,
      averageScore: 0,
      totalLearningGaps: 0,
      studyStreak: 0,
      categoryBreakdown: {},
      levelBreakdown: {},
      monthlyProgress: {},
      recentActivity: []
    };
    
    progressRecords.forEach(progress => {
      // Basic stats
      analytics.totalTimeSpent += progress.learningAnalytics.totalTimeSpent || 0;
      analytics.totalLearningGaps += progress.learningGaps.length;
      analytics.studyStreak = Math.max(analytics.studyStreak, progress.learningAnalytics.studyStreak || 0);
      
      if (progress.learningAnalytics.completionRate === 100) {
        analytics.completedCourses++;
      } else if (progress.learningAnalytics.completionRate > 0) {
        analytics.inProgressCourses++;
      }
      
      // Category breakdown
      const category = progress.course.category;
      if (!analytics.categoryBreakdown[category]) {
        analytics.categoryBreakdown[category] = { total: 0, completed: 0 };
      }
      analytics.categoryBreakdown[category].total++;
      if (progress.learningAnalytics.completionRate === 100) {
        analytics.categoryBreakdown[category].completed++;
      }
      
      // Level breakdown
      const level = progress.course.level;
      if (!analytics.levelBreakdown[level]) {
        analytics.levelBreakdown[level] = { total: 0, completed: 0 };
      }
      analytics.levelBreakdown[level].total++;
      if (progress.learningAnalytics.completionRate === 100) {
        analytics.levelBreakdown[level].completed++;
      }
      
      // Recent activity
      if (progress.learningAnalytics.lastStudySession) {
        analytics.recentActivity.push({
          courseTitle: progress.course.title,
          lastSession: progress.learningAnalytics.lastStudySession,
          completionRate: progress.learningAnalytics.completionRate
        });
      }
    });
    
    // Calculate average score
    const completedProgressRecords = progressRecords.filter(p => p.learningAnalytics.completionRate > 0);
    if (completedProgressRecords.length > 0) {
      analytics.averageScore = completedProgressRecords.reduce(
        (sum, p) => sum + (p.learningAnalytics.averageScore || 0), 
        0
      ) / completedProgressRecords.length;
    }
    
    // Sort recent activity
    analytics.recentActivity.sort((a, b) => new Date(b.lastSession) - new Date(a.lastSession));
    analytics.recentActivity = analytics.recentActivity.slice(0, 10);
    
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

// Get learning gaps and recommendations
exports.getLearningGaps = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const progressRecords = await Progress.find({ user: userId })
      .populate('course', 'title')
      .select('learningGaps recommendations course');
    
    const allGaps = [];
    const allRecommendations = [];
    
    progressRecords.forEach(progress => {
      progress.learningGaps.forEach(gap => {
        allGaps.push({
          ...gap.toObject(),
          courseTitle: progress.course.title,
          courseId: progress.course._id
        });
      });
      
      progress.recommendations.forEach(rec => {
        allRecommendations.push({
          ...rec.toObject(),
          courseTitle: progress.course.title,
          courseId: progress.course._id
        });
      });
    });
    
    // Sort by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    allGaps.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    allRecommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    res.json({
      success: true,
      data: {
        learningGaps: allGaps,
        recommendations: allRecommendations,
        summary: {
          totalGaps: allGaps.length,
          highPriorityGaps: allGaps.filter(g => g.priority === 'high').length,
          pendingRecommendations: allRecommendations.filter(r => !r.isCompleted).length
        }
      }
    });
  } catch (error) {
    console.error('Get learning gaps error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getStudentProgress: exports.getStudentProgress,
  getCourseProgress: exports.getCourseProgress,
  updateModuleProgress: exports.updateModuleProgress,
  submitQuizAttempt: exports.submitQuizAttempt,
  getLearningAnalytics: exports.getLearningAnalytics,
  getLearningGaps: exports.getLearningGaps
};
