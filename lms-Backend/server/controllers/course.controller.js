import fs from 'fs/promises';
import path from 'path';
import cloudinary from 'cloudinary';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import Course from '../models/course.model.js';
import AppError from '../utils/AppError.js';
import User from '../models/user.model.js';
// import mongoose, { model } from "mongoose";
import { GoogleGenerativeAI } from '@google/generative-ai'
import { error } from 'console';
//import Lecture from '../models/lecture.model.js'; // Ensure you have this import

// Get all courses without lectures
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select('-lectures');
    res.status(200).json({
      success: true,
      message: 'All courses',
      courses,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

//get subscribed course
export const getSubscribedCourses = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Assume req.user is set by authentication middleware

  // Fetch the user with subscriptions populated
  const user = await User.findById(userId).populate('subscriptions.course_id');
  console.log("USER", user);


  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Extract the course_ids from the user's subscriptions
  const subscribedCourseIds = user.subscriptions
    .filter(sub => sub.status === 'active')
    .map(sub => sub.course_id);

  // Fetch the subscribed courses using the course IDs
  const subscribedCourses = await Course.find({ _id: { $in: subscribedCourseIds } });
  console.log("KHARIDA HAI", subscribedCourses);


  res.status(200).json({
    success: true,
    subscribedCourses,
  });
});

// Create a new course
export const createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy) {
    return next(new AppError('All fields are required', 400));
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    thumbnail: {
      public_id: 'Dummy',
      secure_url: 'Dummy',
    },
  });

  if (!course) {
    return next(new AppError('Course could not be created, please try again', 400));
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      await fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      return next(new AppError(JSON.stringify(error) || 'File not uploaded, please try again', 400));
    }
  }

  await course.save();
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    course,
  });
});

// Get lectures by course ID
export const getLecturesByCourseId = asyncHandler(async (req, res, next) => {
  const { id: courseId } = req.params;
  const userId = req.user.id;

  // Retrieve the course by ID
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 404));
  }

  // Retrieve the user by ID
  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found.', 401));
  }

  // Check subscription for non-admin users
  if (user.role !== 'ADMIN') {
    const subscription = user.subscriptions.find(sub => sub.course_id === courseId);
    if (!subscription || subscription.status !== 'active') {
      return next(new AppError('You are not authorized to view these lectures.', 403));
    }
  }

  res.status(200).json({
    success: true,
    message: 'Course lectures fetched successfully',
    lectures: course.lectures,
  });
});



// Get lectures for subscribed course
export const getLecturesForSubscribedCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { courseId } = req.params;
  console.log("COURSEEEEE", courseId);


  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('Unauthorized, please login', 401));
    }

    if (user.subscription.course_id !== courseId) {
      return next(new AppError('You are not subscribed to this course', 403));
    }

    const courseLectures = await Lecture.find({ course: courseId });
    console.log(courseLectures);

    res.status(200).json({
      success: true,
      data: courseLectures,
    });
  } catch (error) {
    next(error);
  }
});

// Add a lecture to a course
export const addLectureToCourseById = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  if (!title || !description) {
    return next(new AppError('Title and Description are required', 400));
  }

  const course = await Course.findById(id);
  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 400));
  }

  let lectureData = {};

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        chunk_size: 50000000,
        resource_type: 'video',
      });

      if (result) {
        lectureData.public_id = result.public_id;
        lectureData.secure_url = result.secure_url;
      }

      await fs.rm(`uploads/${req.file.filename}`);
    } catch (error) {
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      return next(new AppError(JSON.stringify(error) || 'File not uploaded, please try again', 400));
    }
  }

  course.lectures.push({
    title,
    description,
    lecture: lectureData,
  });

  console.log(course.lectures.length)

  course.numberOfLectures = course.lectures.length;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    course,
  });
});

// Remove a lecture from a course
export const removeLectureFromCourse = asyncHandler(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400));
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  if (lectureIndex === -1) {
    return next(new AppError('Lecture does not exist.', 404));
  }

  await cloudinary.v2.uploader.destroy(
    course.lectures[lectureIndex].lecture.public_id,
    { resource_type: 'video' }
  );

  course.lectures.splice(lectureIndex, 1);
  course.numberOfLectures = course.lectures.length;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });
});

// Update a course by ID
export const updateCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findByIdAndUpdate(
    id,
    { $set: req.body },
    { runValidators: true }
  );

  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 400));
  }

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
  });
});

// Delete a course by ID
export const deleteCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    return next(new AppError('Course with given id does not exist.', 404));
  }

  // Delete the course thumbnail from Cloudinary
  if (course.thumbnail.public_id !== 'Dummy') {
    await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
  }

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const retryWithDelay = async (fn, retries = 3, delay = 2000) => {
  try {
    return await fn();
  } catch (error) {
    const isRateLimit = error.message?.includes("429") || error.status === 429;
    if (isRateLimit && retries > 0) {
      console.log(`Rate limited. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2); // Double the delay each time
    }
    throw error; // If not a 429 or no retries left, throw it
  }
};

export const generateCourseDescription = asyncHandler(async (req, res, next) => {

  const { title, category } = req.body;

  if (!title || !category) {
    return next(new AppError('title and category are required.', 400));

  }
  const prompt = `Generate a short and clear course description for "${title}" in the "${category}" category.
The description should:
- Explain what the course teaches and key skills learned.
- Be beginner-friendly and avoid heavy marketing.
- Keep it concise (4–5 sentences).
- Do not include stars, markdown formatting, or lists.`;

  try {
    const result = await retryWithDelay(() => model.generateContent(prompt));
    const response = await result.response;
    const description = response.text();
    if (description) {
      const descriptionArray = description.split('\n').map(line => line.trim()).filter(line => line !== '');
      console.log("description: ", descriptionArray);

      return res.status(200).json({
        success: true,
        description: descriptionArray
      });

    } else {
      res.status(500).json({
        error: 'Empty response from AI.'
      });
    }

  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      return next(new AppError(
        "The AI is a bit busy right now. Please wait a minute before generating another description.",
        429
      ));
    }
    return next(new AppError(
      error.message || "Failed to generate description",
      500
    ));
  }
})

export const generateLectureDescription = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next(new AppError('title is required.', 400))
  }
  const prompt = `Generate a clear and concise lecture description for the lecture titled "${title}". 
The description should:
- Explain what the lecture covers and key skills learned.
- Be beginner-friendly and easy to understand.
- Keep it short (2–4 sentences).
- Focus on practical understanding without using lists, stars, or markdown.
- Make it engaging and informative for students.`;

  try {
    const result = await retryWithDelay(() => model.generateContent(prompt));
    const response = await result.response;
    const description = response.text();

    if (description) {
      const descriptionArray = description.split('\n').map(line => line.trim()).filter(line => line !== '');
      console.log("description: ", descriptionArray);

      return res.status(200).json({
        success: true,
        description: descriptionArray
      });

    } else {
      res.status(500).json({
        error: 'Empty response from AI.'
      });
    }


  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      return next(new AppError(
        "The AI is a bit busy right now. Please wait a minute before generating another description.",
        429
      ));
    }
    return next(new AppError(
      error.message || "Failed to generate description",
      500
    ));
  }
})



export const recommendCourse = asyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.user.id);
  // if (!user) {
  //   return next(new AppError("User not found", 400));
  // }
  // const purchasedCourses = user.subscriptions.map(sub => sub.course_id);
  // if (!purchasedCourses || purchasedCourses.length === 0) {
  //   return next(new AppError("No purchased course provided", 400));
  // }
 
  const { category , courseId} = req.body;
  if (!category) {
    return next(new AppError("Category is required", 400));
  }

  const allCourses = await Course.find({}, "title category thumbnail createdBy lectures");
  const sameCategoryCourses = allCourses
    .filter(c => c.category === category && c._id.toString() !== courseId);

  const prompt = `
User is currently viewing a course in the category: ${category}.
From the following categories: ${JSON.stringify(allCourses.map(c => c.category))},
recommend 3 similar courses.
Return only course titles.`;

  try {
    const result = await retryWithDelay(() => model.generateContent(prompt));
    const response = await result.response;
    const recommendedTitle = response.text()
      .split("\n")
      .map(c => c.trim())
      .filter(c => c);

const recommendedCourses = sameCategoryCourses
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);    console.log("RECommneded", recommendedCourses);

    return res.status(200).json({
      success: true,
      recommendedCourses
    });
  } catch (error) {
    return next(new AppError(error.message || "failed to generate recommendations", 500));
  }
})
