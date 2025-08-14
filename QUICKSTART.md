# Online Learning Progress Tracker - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd sdlapps-main

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Backend

```bash
cd backend

# Create .env file
echo "MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development" > .env
```

### 3. Create Admin User

Your MongoDB Atlas cluster is already configured. Now create the admin user:

```bash
cd backend
npm run create-admin
```

This will create an admin user with:
- **Email**: admin@gmail.com
- **Password**: admin123

### 4. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🎯 First Steps

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Explore the dashboard** and available features

## 👑 Admin User Created

Your admin user has been created with:
- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: Administrator

**No additional setup required!** You can login directly with these credentials.

## 📱 Features Overview

### For Users
- ✅ User registration and authentication
- ✅ Course browsing and enrollment
- ✅ Progress tracking and analytics
- ✅ Learning gap identification
- ✅ Personalized recommendations

### For Admins
- ✅ User management
- ✅ Course creation and management
- ✅ Content publishing control
- ✅ Platform analytics dashboard

## 🛠️ Development

### Backend API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (admin)
- `GET /api/enrollments` - User enrollments

### Frontend Routes
- `/dashboard` - User dashboard
- `/courses` - Browse courses
- `/my-learning` - Learning progress
- `/admin` - Admin dashboard
- `/profile` - User profile

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on the port

3. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 5000
   - Check CORS configuration

### Logs

- **Backend**: Check terminal output
- **Frontend**: Check browser console
- **Database**: Check MongoDB logs

## 📚 Next Steps

1. **Explore the codebase** - Understand the structure
2. **Add new features** - Extend functionality
3. **Customize styling** - Modify Tailwind classes
4. **Add tests** - Implement unit and integration tests
5. **Deploy** - Set up production environment

## 🆘 Need Help?

- Check the detailed setup guides in `backend/setup.md` and `frontend/setup.md`
- Review the main `README.md` for comprehensive documentation
- Open an issue in the repository for bugs or questions

---

**Happy Learning! 🎓**
