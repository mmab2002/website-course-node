# Online Learning Progress Tracker

An academic tool that visualizes learners' progression through online courses by logging module completions, quiz results, learning gaps, and generating progress reports and certificates. Encourages self-paced and performance-driven learning.

## Features

### For Learners (Users)
- **Course Enrollment**: Browse and enroll in available courses
- **Progress Tracking**: Monitor completion of modules and quizzes
- **Learning Analytics**: View detailed progress reports and statistics
- **Learning Gaps**: Identify areas that need improvement
- **Recommendations**: Get personalized learning suggestions
- **Certificates**: Earn certificates upon course completion

### For Administrators
- **Course Management**: Create, edit, and manage courses
- **Module Management**: Add, update, and organize course modules
- **User Management**: Manage user accounts and roles
- **Analytics Dashboard**: View overall platform statistics
- **Content Publishing**: Control course availability

### Admin Access
**Default Admin Credentials:**
- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: Administrator with full access to all features

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Chart.js** for data visualization

## Project Structure

```
sdlapps-main/
├── backend/                 # Backend API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main application component
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas cluster (already configured)
- npm or yarn package manager

### MongoDB Configuration
Your MongoDB connection is already configured with:
```
MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```bash
   MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. Create the admin user:
   ```bash
   npm run create-admin
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

# 🎯 Setup Summary - Online Learning Progress Tracker

## 🚀 Quick Setup Commands

### 1. One-Click Setup (Recommended)
```bash
# On Linux/Mac:
chmod +x setup.sh && ./setup.sh

# On Windows:
setup.bat
```

### 2. Manual Setup
```bash
# Backend
cd backend
npm install
echo "MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development" > .env
npm run create-admin
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm start
```

## 🔐 Admin Login Credentials

**Email**: admin@gmail.com  
**Password**: admin123  
**Role**: Administrator

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📱 Features Available

### For Admin Users
- ✅ User management dashboard
- ✅ Course creation and management
- ✅ Content publishing control
- ✅ Platform analytics
- ✅ Module and quiz management

### For Regular Users
- ✅ Course browsing and enrollment
- ✅ Progress tracking
- ✅ Learning analytics
- ✅ Certificate generation

## 🗄️ Database Configuration

**MongoDB Atlas Cluster**: Already configured  
**Connection String**: mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker  
**Database**: learning-tracker (auto-created)

## 🔧 Troubleshooting

### Common Issues
1. **Port 5000 in use**: Change PORT in .env file
2. **MongoDB connection error**: Verify cluster is running
3. **Admin access denied**: Run `npm run create-admin` again

### Logs
- **Backend**: Check terminal output
- **Frontend**: Check browser console
- **Database**: MongoDB Atlas dashboard

## 📚 Next Steps

1. **Login as admin** with admin@gmail.com / admin123
2. **Create your first course** in the admin dashboard
3. **Enroll test users** to test the learning flow
4. **Customize the platform** to match your needs

## 🆘 Need Help?

- Check `backend/MONGODB_SETUP.md` for detailed MongoDB setup
- Review `README.md` for comprehensive documentation
- Check `QUICKSTART.md` for quick reference

---

**🎉 Your Online Learning Platform is Ready! 🎓**


## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Admin Routes
- `GET /api/auth/users` - Get all users
- `PUT /api/auth/users/:userId/role` - Update user role
- `PUT /api/auth/users/:userId/status` - Toggle user status

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:courseId` - Get course details
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:courseId` - Update course (admin only)
- `DELETE /api/courses/:courseId` - Delete course (admin only)

### Enrollments
- `POST /api/enrollments/courses/:courseId/enroll` - Enroll in course
- `GET /api/enrollments` - Get user enrollments
- `GET /api/enrollments/:enrollmentId` - Get enrollment details
- `PUT /api/enrollments/:enrollmentId/modules/:moduleId/complete` - Complete module
- `POST /api/enrollments/:enrollmentId/quizzes/:quizId/submit` - Submit quiz

## Database Models

### User
- Basic user information (name, email, password)
- Role-based access control (admin/user)
- Account status and timestamps

### Course
- Course details (title, description, category, level)
- Modules with content and video URLs
- Quizzes with questions and answers
- Publishing status

### Enrollment
- User-course relationship
- Progress tracking
- Completion status
- Certificate information

### Progress
- Detailed learning analytics
- Module and quiz progress
- Learning gaps identification
- Personalized recommendations

### Certificate
- Course completion certificates
- Verification codes
- Expiration dates
- Grade calculations

## Features in Detail

### Learning Progress Tracking
- **Module Completion**: Track which modules users have completed
- **Quiz Performance**: Monitor quiz scores and attempts
- **Time Tracking**: Record time spent on learning activities
- **Progress Visualization**: Show completion percentages and charts

### Learning Analytics
- **Performance Metrics**: Average scores, completion rates
- **Learning Patterns**: Study time analysis and trends
- **Gap Identification**: Automatically identify learning weaknesses
- **Recommendations**: Suggest improvement strategies

### Admin Dashboard
- **Course Overview**: Total courses, enrollments, and completions
- **User Management**: View and manage user accounts
- **Content Management**: Create and organize course materials
- **Analytics**: Platform-wide statistics and insights

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **Role-Based Access**: Admin and user role separation
- **Input Validation**: Server-side data validation
- **CORS Protection**: Controlled cross-origin access

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
