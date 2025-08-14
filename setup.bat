@echo off
echo 🚀 Setting up Online Learning Progress Tracker...
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Create .env file in backend
echo 📝 Creating .env file in backend directory...
cd backend

REM Create .env file
(
echo MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
echo JWT_SECRET=your-super-secret-jwt-key-here
echo PORT=5000
echo NODE_ENV=development
) > .env

echo ✅ .env file created

REM Install backend dependencies
echo 📦 Installing backend dependencies...
npm install

REM Create admin user
echo 👑 Creating admin user...
npm run create-admin

echo.
echo 🎉 Backend setup completed!
echo.
echo 📱 To start the application:
echo 1. Backend: npm run dev (in backend directory)
echo 2. Frontend: npm start (in frontend directory)
echo.
echo 🔐 Admin Login:
echo    Email: admin@gmail.com
echo    Password: admin123
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    Health Check: http://localhost:5000/health
echo.
echo Happy Learning! 🎓
pause
