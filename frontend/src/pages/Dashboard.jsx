import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaGraduationCap,
  FaBookOpen,
  FaChartLine,
  FaTrophy,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBrain,
  FaCertificate,
  FaFire
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [learningGaps, setLearningGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const [progressRes, analyticsRes, gapsRes] = await Promise.all([
        axios.get('/api/progress'),
        axios.get('/api/progress/analytics'),
        axios.get('/api/progress/gaps')
      ]);

      setProgressData(progressRes.data.data.progressRecords || []);
      setAnalytics(analyticsRes.data.data.analytics || {});
      setLearningGaps(gapsRes.data.data.learningGaps?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
      // Set fallback data
      setProgressData([]);
      setAnalytics({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        studyStreak: 0
      });
      setLearningGaps([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaBookOpen className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaTrophy className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.completedCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Studied</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round((analytics.totalTimeSpent || 0) / 60)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaChartLine className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(analytics.averageScore || 0)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Courses Progress */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Learning Progress</h2>
          </div>
          <div className="p-6">
            {progressData.length > 0 ? (
              <div className="space-y-4">
                {progressData.slice(0, 3).map((progress) => (
                  <div key={progress._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{progress.course.title}</h3>
                      <span className="text-sm font-medium text-gray-600">
                        {Math.round(progress.learningAnalytics.completionRate || 0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.round(progress.learningAnalytics.completionRate || 0)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                      <span>Level: {progress.course.level}</span>
                      <span>{Math.round((progress.learningAnalytics.totalTimeSpent || 0) / 60)} hrs studied</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No courses yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by enrolling in your first course!
                </p>
                <div className="mt-6">
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Learning Gaps & Recommendations */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Areas for Improvement</h2>
          </div>
          <div className="p-6">
            {learningGaps.length > 0 ? (
              <div className="space-y-4">
                {learningGaps.map((gap, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      gap.priority === 'high' ? 'bg-red-100 text-red-600' :
                      gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <FaExclamationTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{gap.moduleTitle}</h4>
                      <p className="text-xs text-gray-600 mt-1">{gap.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {gap.suggestedActions?.slice(0, 2).map((action, actionIndex) => (
                          <span key={actionIndex} className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Great job!</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No learning gaps identified. Keep up the excellent work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/courses"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FaBookOpen className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-gray-700">Browse Available Courses</span>
            </a>
            <a
              href="/my-learning"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FaGraduationCap className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-gray-700">Continue Learning</span>
            </a>
            <a
              href="/profile"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FaChartLine className="h-5 w-5 text-purple-600 mr-3" />
              <span className="text-gray-700">View Detailed Progress</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Tips</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Set aside dedicated time each day for learning</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Take notes and review previous modules regularly</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Practice with quizzes to reinforce your knowledge</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Track your progress to stay motivated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
