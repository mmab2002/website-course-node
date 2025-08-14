# Frontend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000` by default.

If you need to change the backend URL, update the axios configuration in `src/axiosConfig.jsx`.

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (not recommended)

## Features

- **User Authentication**: Login/Register with JWT
- **Role-based Access**: Admin and User roles
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Built with Tailwind CSS and React Icons

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context for state management
├── pages/         # Page components
├── App.js         # Main application component
└── index.js       # Application entry point
```

## Development

The application uses:
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Icons** for icons

## Testing

To test the application:

1. Start the backend server first
2. Start the frontend development server
3. Register a new account or login with existing credentials
4. Navigate through different sections based on your role

## Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.
