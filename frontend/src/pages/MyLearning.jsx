import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyLearning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in-progress, completed

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('/api/enrollments/my');
      setEnrollments(response.data.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return enrollment.status === 'enrolled' && enrollment.progress < 100;
    if (filter === 'completed') return enrollment.status === 'completed' || enrollment.progress >= 100;
    return true;
  });

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusBadge = (enrollment) => {
    if (enrollment.status === 'completed' || enrollment.progress >= 100) {
      return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">✓ Completed</span>;
    }
    if (enrollment.progress > 0) {
      return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">In Progress</span>;
    }
    return <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Not Started</span>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <button
          onClick={() => navigate('/courses')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Browse Courses
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All ({enrollments.length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'in-progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              In Progress ({enrollments.filter(e => e.status === 'enrolled' && e.progress < 100).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed ({enrollments.filter(e => e.status === 'completed' || e.progress >= 100).length})
            </button>
          </nav>
        </div>
      </div>

      {/* Enrollments grid */}
      {filteredEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <div key={enrollment._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(enrollment)}
                  <span className="text-sm text-gray-500">
                    {enrollment.course?.duration || 0} hours
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {enrollment.course?.title || 'Course Title'}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {enrollment.course?.description || 'Course description'}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {enrollment.course?.category || 'Category'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    enrollment.course?.level === 'beginner' ? 'bg-green-100 text-green-800' :
                    enrollment.course?.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {enrollment.course?.level || 'beginner'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">{Math.round(enrollment.progress || 0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress || 0)}`}
                      style={{ width: `${Math.min(enrollment.progress || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/courses/${enrollment.course?._id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {enrollment.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </button>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/courses/${enrollment.course?._id}`)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8">
            {enrollments.length === 0 ? (
              <>
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled courses yet</h3>
                <p className="text-gray-500 mb-6">Start your learning journey by enrolling in a course</p>
                <button
                  onClick={() => navigate('/courses')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Browse Courses
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses match your filter</h3>
                <p className="text-gray-500">Try selecting a different filter to see your courses</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLearning;
