# Backend Setup Guide

## Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/learning-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Database Setup

1. **Local MongoDB**: Install MongoDB locally or use Docker
2. **Cloud MongoDB**: Use MongoDB Atlas for cloud hosting

## Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the `.env` file with your configuration

3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Admin User

To create an admin user, you can either:

1. **Register normally and update the database**:
   ```javascript
   // In MongoDB shell or Compass
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Use the registration endpoint with admin role** (if you modify the controller to allow it)

## API Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## Health Check

Test the API health at: `GET /health`
