import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${courseId}`);
      setCourse(response.data.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await axios.get('/api/enrollments/my');
      const enrollments = response.data.data.enrollments || [];
      const courseEnrollment = enrollments.find(
        e => (e.course._id || e.course) === courseId
      );
      setEnrollment(courseEnrollment);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await axios.post('/api/enrollments', { courseId });
      checkEnrollment(); // Refresh enrollment status
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Error enrolling in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
          <div className="bg-white rounded-lg shadow p-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">Course not found</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/courses')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
        >
          ← Back to Courses
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 text-lg mb-4">{course.description}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {course.level}
              </span>
              <span className="text-sm text-gray-500">{course.category}</span>
              <span className="text-sm text-gray-500">{course.duration} hours</span>
            </div>
            
            {course.createdBy && (
              <p className="text-sm text-gray-500">
                Created by: {course.createdBy.firstName} {course.createdBy.lastName}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Modules */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              <p className="text-sm text-gray-500 mt-1">
                {course.modules?.length || 0} modules
              </p>
            </div>
            
            <div className="p-6">
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-4">
                  {course.modules
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((module, index) => (
                    <div key={module._id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {index + 1}. {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                          )}
                          {module.duration && (
                            <span className="text-xs text-gray-500">{module.duration} minutes</span>
                          )}
                        </div>
                        {!enrollment && (
                          <div className="ml-4">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              🔒 Locked
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No modules available yet.
                </p>
              )}
            </div>
          </div>

          {/* Quizzes */}
          {course.quizzes && course.quizzes.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quizzes</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {course.quizzes.length} quiz{course.quizzes.length !== 1 ? 'es' : ''}
                </p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {course.quizzes.map((quiz, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                          <p className="text-sm text-gray-600">
                            {quiz.questions?.length || 0} questions • 
                            Passing score: {quiz.passingScore || 70}%
                          </p>
                        </div>
                        {!enrollment && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            🔒 Locked
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <div className="text-center mb-6">
              {enrollment ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ You're enrolled!</p>
                    <p className="text-green-600 text-sm mt-1">
                      Progress: {enrollment.progress || 0}%
                    </p>
                  </div>
                  
                  <button
                    onClick={() => navigate('/my-learning')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    Continue Learning
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">Free</div>
                  
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    Instant access • Lifetime access
                  </p>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">This course includes:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2">📚</span>
                  {course.modules?.length || 0} modules
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⏱️</span>
                  {course.duration} hours of content
                </li>
                {course.quizzes && course.quizzes.length > 0 && (
                  <li className="flex items-center">
                    <span className="mr-2">📝</span>
                    {course.quizzes.length} quiz{course.quizzes.length !== 1 ? 'es' : ''}
                  </li>
                )}
                <li className="flex items-center">
                  <span className="mr-2">📱</span>
                  Access on web
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🏆</span>
                  Certificate of completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
