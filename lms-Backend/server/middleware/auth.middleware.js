import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Course from '../models/course.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from './asyncHandler.middleware.js';

// Middleware to check if user is logged in
export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError(' UNAUTHORIZE TOKEN Unauthorized, please login to continue', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("DECODED", decoded);
    next();
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return next(new AppError('Unauthorized, please login to continue', 401));
  }
});

// Middleware to check if user is admin or not
export const authorizeRoles = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to view this route', 403));
    }
    next();
  });

/// Middleware to authorize users with active subscriptions
export const authorizeSubscribers = asyncHandler(async (req, res, next) => {
  try {
    console.log("PARAMS",req.params);
    const { id } = req.params;
    const course_id = id;
    console.log("DE LAUDA ID",course_id);

    console.log(`Authorizing access to courseId: ${course_id}`);

    // Check if the user is authenticated
    if (!req.user) {
      return next(new AppError('Unauthorized, please login to continue', 401));
    }

    // Retrieve the course by ID
    const course = await Course.findById(course_id);
    if (!course) {
      console.log("LELLE COURSE",course);
      
      console.error(`Course not found with ID: ${course_id}`);
      return next(new AppError('Course not found', 404));
    }
    console.log(`Found course: ${course.title}`);

    // Retrieve the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error(`User not found with ID: ${req.user.id}`);
      return next(new AppError('User not found', 401));
    }
    console.log(`Found user: ${user.fullName}`);

    // Allow access if the user is an admin
    if (user.role === 'ADMIN') {
      console.log(`Admin access granted for user ${user.fullName} to course ${course.title}`);
      return next(); // Skip subscription check for admins
    }

    // Check user's subscriptions
    const subscription = user.subscriptions.find(sub => sub.course_id === course_id);
    if (!subscription || subscription.status !== 'active') {
      console.error(`User ${user.fullName} is not authorized to access course ${course.title}`);
      return next(new AppError('You are not authorized to access this course', 403));
    }

    console.log(`Authorization successful for user ${user.fullName} to access course ${course.title}`);
    next();
  } catch (error) {
    console.error(`Error during authorization: ${error.message}`);
    return next(new AppError(error.message, 500));
  }
});


