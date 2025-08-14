const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedModules: [{
    moduleId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    score: Number
  }],
  quizResults: [{
    quizId: mongoose.Schema.Types.ObjectId,
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    attemptedAt: Date,
    passed: Boolean
  }],
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateId: String
  },
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
    default: 'enrolled'
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Update progress based on completed modules
enrollmentSchema.methods.updateProgress = function() {
  if (this.course && this.course.modules) {
    const totalModules = this.course.modules.length;
    const completedCount = this.completedModules.length;
    this.progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;
  }
};

// Check if course is completed
enrollmentSchema.methods.checkCompletion = function() {
  if (this.progress === 100) {
    this.status = 'completed';
    this.completedAt = new Date();
  }
};

// Generate certificate ID
enrollmentSchema.methods.generateCertificateId = function() {
  return `CERT-${this.user}-${this.course}-${Date.now()}`;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
