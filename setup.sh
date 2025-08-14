#!/bin/bash

echo "🚀 Setting up Online Learning Progress Tracker..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Create .env file in backend
echo "📝 Creating .env file in backend directory..."
cd backend

# Create .env file
cat > .env << EOF
MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
EOF

echo "✅ .env file created"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create admin user
echo "👑 Creating admin user..."
npm run create-admin

echo ""
echo "🎉 Backend setup completed!"
echo ""
echo "📱 To start the application:"
echo "1. Backend: npm run dev (in backend directory)"
echo "2. Frontend: npm start (in frontend directory)"
echo ""
echo "🔐 Admin Login:"
echo "   Email: admin@gmail.com"
echo "   Password: admin123"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/health"
echo ""
echo "Happy Learning! 🎓"
