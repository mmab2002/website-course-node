const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

// Create Course (Admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, duration, modules, quizzes } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level,
      duration,
      modules: modules || [],
      quizzes: quizzes || [],
      createdBy: req.user._id
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get All Courses (with optional filtering)
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, isPublished, search } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('createdBy', 'firstName lastName username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        courses
      }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('createdBy', 'firstName lastName username');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Course (Admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Course (Admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Also delete related enrollments and progress
    await Enrollment.deleteMany({ course: courseId });
    await Progress.deleteMany({ course: courseId });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Publish/Unpublish Course (Admin only)
exports.toggleCoursePublish = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        course
      }
    });
  } catch (error) {
    console.error('Toggle course publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Add Module to Course (Admin only)
exports.addModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, content, videoUrl, duration } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const newModule = {
      title,
      description,
      content,
      videoUrl,
      duration,
      order: course.modules.length + 1
    };

    course.modules.push(newModule);
    await course.save();

    res.json({
      success: true,
      message: 'Module added successfully',
      data: {
        module: newModule
      }
    });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Module (Admin only)
exports.updateModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const updateData = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const moduleIndex = course.modules.findIndex(
      module => module._id.toString() === moduleId
    );

    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    course.modules[moduleIndex] = { ...course.modules[moduleIndex], ...updateData };
    await course.save();

    res.json({
      success: true,
      message: 'Module updated successfully',
      data: {
        module: course.modules[moduleIndex]
      }
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete Module (Admin only)
exports.deleteModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.modules = course.modules.filter(
      module => module._id.toString() !== moduleId
    );

    // Reorder remaining modules
    course.modules.forEach((module, index) => {
      module.order = index + 1;
    });

    await course.save();

    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Course Statistics (Admin only)
exports.getCourseStats = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.find({ course: courseId });
    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter(e => e.status === 'in-progress').length;
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;

    const averageProgress = enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length 
      : 0;

    res.json({
      success: true,
      data: {
        stats: {
          totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          averageProgress: Math.round(averageProgress),
          totalModules: course.modules.length,
          totalQuizzes: course.quizzes.length
        }
      }
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
