import { Router } from 'express';
import {
  addLectureToCourseById,
  createCourse,
  deleteCourseById,
  generateCourseDescription,
  generateLectureDescription,
  getAllCourses,
  getLecturesByCourseId,
  getLecturesForSubscribedCourse, getSubscribedCourses, recommendCourse, // New route
  removeLectureFromCourse,
  updateCourseById,
} from '../controllers/course.controller.js';
import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn,
} from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

//route to get subscribed course
router
.route('/subscribed-courses')
.get(isLoggedIn, getSubscribedCourses); // New route for subscribed courses

// Route to get lectures for a specific course if the user is subscribed
router
  .route('/courses/:courseId/lectures')
  .get(isLoggedIn,authorizeSubscribers, getLecturesForSubscribedCourse); // New route for subscribed users
 
 
 


// Refactored code
router
  .route('/')
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
  )
  .delete(isLoggedIn, authorizeRoles('ADMIN'), removeLectureFromCourse);

  router.post('/generate-CourseDescription', isLoggedIn, authorizeRoles('ADMIN'), generateCourseDescription)
  router.post('/generate-LectureDescription', isLoggedIn, authorizeRoles('ADMIN'), generateLectureDescription)
  router.post('/recommend-courses', isLoggedIn,recommendCourse);


router
  .route('/:id')
  .get(isLoggedIn, authorizeSubscribers, getLecturesByCourseId) // Ensure user is authorized as subscriber
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById
  )
  .delete(isLoggedIn, authorizeRoles('ADMIN'), deleteCourseById)
  .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourseById);

export default router;