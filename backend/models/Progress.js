const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  moduleProgress: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    title: String,
    timeSpent: Number, // in minutes
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    score: Number,
    attempts: Number
  }],
  quizProgress: [{
    quizId: mongoose.Schema.Types.ObjectId,
    title: String,
    attempts: [{
      attemptNumber: Number,
      score: Number,
      correctAnswers: Number,
      totalQuestions: Number,
      timeTaken: Number, // in minutes
      attemptedAt: Date,
      passed: Boolean
    }],
    bestScore: Number,
    totalAttempts: Number
  }],
  learningAnalytics: {
    totalTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    lastStudySession: Date,
    studyStreak: {
      type: Number,
      default: 0
    }
  },
  learningGaps: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    moduleTitle: String,
    gapType: {
      type: String,
      enum: ['low_score', 'multiple_attempts', 'time_spent', 'incomplete']
    },
    description: String,
    suggestedActions: [String],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  recommendations: [{
    type: {
      type: String,
      enum: ['review_module', 'practice_quiz', 'additional_resources', 'peer_help']
    },
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate learning analytics
progressSchema.methods.calculateAnalytics = function() {
  // Calculate total time spent
  this.learningAnalytics.totalTimeSpent = this.moduleProgress.reduce((total, module) => {
    return total + (module.timeSpent || 0);
  }, 0);

  // Calculate average score
  const completedModules = this.moduleProgress.filter(module => module.completed);
  if (completedModules.length > 0) {
    this.learningAnalytics.averageScore = completedModules.reduce((sum, module) => {
      return sum + (module.score || 0);
    }, 0) / completedModules.length;
  }

  // Calculate completion rate
  if (this.moduleProgress.length > 0) {
    this.learningAnalytics.completionRate = (completedModules.length / this.moduleProgress.length) * 100;
  }
};

// Identify learning gaps
progressSchema.methods.identifyGaps = function() {
  this.learningGaps = [];
  
  this.moduleProgress.forEach(module => {
    if (module.completed) {
      // Check for low scores
      if (module.score < 70) {
        this.learningGaps.push({
          moduleId: module.moduleId,
          moduleTitle: module.title,
          gapType: 'low_score',
          description: `Low score (${module.score}%) in ${module.title}`,
          suggestedActions: ['Review module content', 'Take practice quiz', 'Seek help from instructor'],
          priority: 'high'
        });
      }
      
      // Check for multiple attempts
      if (module.attempts > 2) {
        this.learningGaps.push({
          moduleId: module.moduleId,
          moduleTitle: module.title,
          gapType: 'multiple_attempts',
          description: `Multiple attempts (${module.attempts}) needed for ${module.title}`,
          suggestedActions: ['Review fundamental concepts', 'Practice with similar problems'],
          priority: 'medium'
        });
      }
    } else {
      // Incomplete modules
      this.learningGaps.push({
        moduleId: module.moduleId,
        moduleTitle: module.title,
        gapType: 'incomplete',
        description: `Module ${module.title} not completed`,
        suggestedActions: ['Complete module content', 'Set study schedule'],
        priority: 'medium'
      });
    }
  });
};

progressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);
