# MongoDB Setup Guide

## 🗄️ MongoDB Connection

Your MongoDB connection is already configured with:
```
MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
```

## 👑 Admin User Setup

### Admin Credentials
- **Email**: admin@gmail.com
- **Password**: admin123
- **Username**: admin
- **Role**: admin

### Create Admin User

1. **First, create the .env file** in the backend directory:
   ```bash
   cd backend
   
   # Create .env file with your MongoDB connection
   echo "MONGO_URI=mongodb+srv://admin:admin@cluster0.hpcmozm.mongodb.net/learning-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development" > .env
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Create the admin user**:
   ```bash
   npm run create-admin
   ```

   This will:
   - Connect to your MongoDB cluster
   - Create an admin user with the specified credentials
   - Set the user role to 'admin'

4. **Verify the setup**:
   - Start the backend server: `npm run dev`
   - Login at http://localhost:3000/login with:
     - Email: admin@gmail.com
     - Password: admin123

## 🔐 Alternative: Manual Admin Creation

If you prefer to create the admin user manually through the registration process:

1. **Register normally** at http://localhost:3000/register
2. **Update the user role** in MongoDB:
   ```javascript
   // In MongoDB shell or Compass
   use learning-tracker
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 🚀 Quick Start

1. **Backend**: `npm run dev`
2. **Frontend**: `npm start` (in another terminal)
3. **Login**: admin@gmail.com / admin123
4. **Access**: Admin dashboard at /admin

## 📊 Database Structure

The application will automatically create these collections:
- `users` - User accounts and profiles
- `courses` - Course content and modules
- `enrollments` - User course enrollments
- `progress` - Learning progress tracking
- `certificates` - Course completion certificates

## 🔧 Troubleshooting

### Connection Issues
- Verify your MongoDB cluster is running
- Check network access and IP whitelist
- Ensure the connection string is correct

### Admin Access Issues
- Verify the user role is set to 'admin'
- Check if the user is active (`isActive: true`)
- Clear browser cache and cookies

## 📱 Test the Application

1. **Login as Admin**: admin@gmail.com / admin123
2. **Access Admin Features**:
   - Dashboard: /admin
   - Manage Courses: /admin/courses
   - Manage Users: /admin/users
3. **Create Test Courses** and enroll users
4. **Monitor Progress** and analytics

---

**Your MongoDB cluster is ready! 🎉**
