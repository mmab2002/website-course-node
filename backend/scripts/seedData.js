const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');

const seedData = async () => {
  try {
    console.log('🌱 Starting to seed database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Progress.deleteMany({});

    // Create Admin User
    console.log('👑 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin created:', admin.email);

    // Create Sample Students
    console.log('👨‍🎓 Creating sample students...');
    const studentPassword = await bcrypt.hash('student123', 12);
    
    const students = [];
    const studentData = [
      { username: 'john_doe', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
      { username: 'jane_smith', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' },
      { username: 'bob_wilson', email: 'bob@example.com', firstName: 'Bob', lastName: 'Wilson' },
      { username: 'alice_brown', email: 'alice@example.com', firstName: 'Alice', lastName: 'Brown' }
    ];

    for (const studentInfo of studentData) {
      const student = await User.create({
        ...studentInfo,
        password: studentPassword,
        role: 'user',
        isActive: true
      });
      students.push(student);
      console.log('✅ Student created:', student.email);
    }

    // Create Sample Courses
    console.log('📚 Creating sample courses...');
    
    const courses = [];
    const courseData = [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming language including variables, functions, objects, and DOM manipulation.',
        category: 'Programming',
        level: 'beginner',
        duration: 40,
        modules: [
          {
            title: 'Variables and Data Types',
            description: 'Understanding variables, strings, numbers, and booleans in JavaScript',
            content: 'Learn about var, let, const and different data types...',
            videoUrl: 'https://example.com/js-variables',
            duration: 30,
            order: 1
          },
          {
            title: 'Functions and Scope',
            description: 'Understanding how to create and use functions in JavaScript',
            content: 'Learn about function declarations, expressions, and scope...',
            videoUrl: 'https://example.com/js-functions',
            duration: 45,
            order: 2
          },
          {
            title: 'DOM Manipulation',
            description: 'Learn how to interact with HTML elements using JavaScript',
            content: 'Learn about document.getElementById, addEventListener...',
            videoUrl: 'https://example.com/js-dom',
            duration: 60,
            order: 3
          }
        ],
        quizzes: [
          {
            title: 'JavaScript Basics Quiz',
            questions: [
              {
                question: 'Which keyword is used to declare a constant in JavaScript?',
                options: ['var', 'let', 'const', 'final'],
                correctAnswer: 2,
                explanation: 'const is used to declare constants in JavaScript'
              },
              {
                question: 'What is the result of typeof null in JavaScript?',
                options: ['null', 'undefined', 'object', 'boolean'],
                correctAnswer: 2,
                explanation: 'typeof null returns "object" due to a legacy bug in JavaScript'
              }
            ],
            passingScore: 70
          }
        ]
      },
      {
        title: 'Web Development with HTML & CSS',
        description: 'Master HTML structure and CSS styling to create beautiful and responsive websites.',
        category: 'Web Development',
        level: 'beginner',
        duration: 35,
        modules: [
          {
            title: 'HTML Fundamentals',
            description: 'Learn HTML tags, structure, and semantic elements',
            content: 'Understanding HTML document structure, tags, and attributes...',
            videoUrl: 'https://example.com/html-basics',
            duration: 40,
            order: 1
          },
          {
            title: 'CSS Styling',
            description: 'Learn CSS selectors, properties, and layout techniques',
            content: 'Understanding CSS syntax, selectors, and styling properties...',
            videoUrl: 'https://example.com/css-basics',
            duration: 50,
            order: 2
          },
          {
            title: 'Responsive Design',
            description: 'Create websites that work on all devices',
            content: 'Learn about media queries, flexbox, and grid layout...',
            videoUrl: 'https://example.com/responsive',
            duration: 45,
            order: 3
          }
        ],
        quizzes: [
          {
            title: 'HTML & CSS Quiz',
            questions: [
              {
                question: 'Which HTML tag is used for the largest heading?',
                options: ['<h1>', '<head>', '<header>', '<h6>'],
                correctAnswer: 0,
                explanation: '<h1> is the largest heading tag in HTML'
              },
              {
                question: 'Which CSS property is used to change the background color?',
                options: ['color', 'bgcolor', 'background-color', 'bg-color'],
                correctAnswer: 2,
                explanation: 'background-color is the CSS property for background color'
              }
            ],
            passingScore: 70
          }
        ]
      },
      {
        title: 'Python for Beginners',
        description: 'Start your programming journey with Python, one of the most popular and beginner-friendly programming languages.',
        category: 'Programming',
        level: 'beginner',
        duration: 45,
        modules: [
          {
            title: 'Python Basics',
            description: 'Variables, data types, and basic operations in Python',
            content: 'Learn about Python syntax, variables, and data types...',
            videoUrl: 'https://example.com/python-basics',
            duration: 40,
            order: 1
          },
          {
            title: 'Control Structures',
            description: 'If statements, loops, and control flow in Python',
            content: 'Understanding if/else statements, for loops, while loops...',
            videoUrl: 'https://example.com/python-control',
            duration: 50,
            order: 2
          }
        ],
        quizzes: [
          {
            title: 'Python Fundamentals Quiz',
            questions: [
              {
                question: 'Which symbol is used for comments in Python?',
                options: ['//', '/*', '#', '--'],
                correctAnswer: 2,
                explanation: '# is used for single-line comments in Python'
              }
            ],
            passingScore: 70
          }
        ]
      }
    ];

    for (const courseInfo of courseData) {
      const course = await Course.create({
        ...courseInfo,
        createdBy: admin._id,
        isPublished: true
      });
      courses.push(course);
      console.log('✅ Course created:', course.title);
    }

    // Create Sample Progress Records
    console.log('📊 Creating sample progress records...');
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      // Enroll student in first 2 courses
      for (let j = 0; j < Math.min(2, courses.length); j++) {
        const course = courses[j];
        
        const progress = new Progress({
          user: student._id,
          course: course._id,
          moduleProgress: course.modules.map((module, index) => ({
            moduleId: module._id,
            title: module.title,
            timeSpent: Math.floor(Math.random() * 60) + 10, // 10-70 minutes
            completed: index === 0 || Math.random() > 0.5, // First module always completed, others random
            score: Math.floor(Math.random() * 40) + 60, // 60-100 score
            attempts: Math.floor(Math.random() * 3) + 1,
            completedAt: index === 0 || Math.random() > 0.5 ? new Date() : null
          })),
          quizProgress: course.quizzes.map(quiz => ({
            quizId: quiz._id,
            title: quiz.title,
            attempts: [{
              attemptNumber: 1,
              score: Math.floor(Math.random() * 40) + 60,
              correctAnswers: Math.floor(Math.random() * quiz.questions.length),
              totalQuestions: quiz.questions.length,
              timeTaken: Math.floor(Math.random() * 20) + 5,
              attemptedAt: new Date(),
              passed: true
            }],
            bestScore: Math.floor(Math.random() * 40) + 60,
            totalAttempts: 1
          }))
        });
        
        // Calculate analytics
        progress.calculateAnalytics();
        progress.identifyGaps();
        progress.learningAnalytics.lastStudySession = new Date();
        
        await progress.save();
        console.log(`✅ Progress created for ${student.firstName} in ${course.title}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('==========================================');
    console.log('👑 ADMIN:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n👨‍🎓 STUDENTS:');
    console.log('   Email: john@example.com, jane@example.com, bob@example.com, alice@example.com');
    console.log('   Password: student123');
    console.log('\n📚 Sample Courses:', courses.length);
    console.log('👥 Sample Users:', students.length + 1);
    console.log('📊 Sample Progress Records Created');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
