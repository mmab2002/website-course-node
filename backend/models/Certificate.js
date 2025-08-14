const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
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
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  finalScore: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    required: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  totalModules: {
    type: Number,
    required: true
  },
  completedModules: {
    type: Number,
    required: true
  },
  totalTimeSpent: {
    type: Number, // in hours
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    unique: true
  },
  metadata: {
    courseCategory: String,
    courseLevel: String,
    instructor: String,
    institution: String
  }
});

// Generate verification code
certificateSchema.methods.generateVerificationCode = function() {
  this.verificationCode = `VERIFY-${this.certificateId}-${Date.now()}`;
};

// Calculate grade based on final score
certificateSchema.methods.calculateGrade = function() {
  if (this.finalScore >= 97) this.grade = 'A+';
  else if (this.finalScore >= 93) this.grade = 'A';
  else if (this.finalScore >= 90) this.grade = 'A-';
  else if (this.finalScore >= 87) this.grade = 'B+';
  else if (this.finalScore >= 83) this.grade = 'B';
  else if (this.finalScore >= 80) this.grade = 'B-';
  else if (this.finalScore >= 77) this.grade = 'C+';
  else if (this.finalScore >= 73) this.grade = 'C';
  else if (this.finalScore >= 70) this.grade = 'C-';
  else if (this.finalScore >= 67) this.grade = 'D';
  else this.grade = 'F';
};

// Set expiration date (5 years from issue)
certificateSchema.methods.setExpiration = function() {
  const expirationDate = new Date(this.issuedAt);
  expirationDate.setFullYear(expirationDate.getFullYear() + 5);
  this.expiresAt = expirationDate;
};

// Check if certificate is expired
certificateSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Check if certificate is valid
certificateSchema.methods.isValid = function() {
  return this.isVerified && !this.isExpired();
};

certificateSchema.pre('save', function(next) {
  if (this.isNew) {
    this.generateVerificationCode();
    this.setExpiration();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
