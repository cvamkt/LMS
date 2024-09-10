import crypto from 'crypto';
import asyncHandler from '../middleware/asyncHandler.middleware.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { razorpay } from '../server.js';
import Payment from '../models/payment.model.js';

/**
 * @ACTIVATE_SUBSCRIPTION
 * @ROUTE @POST {{URL}}/api/v1/payments/subscribe
 * @ACCESS Private (Logged in user only)
 */
export const buySubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { course_id } = req.body; // added
  console.log("In the buy subscription page", course_id);

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('Unauthorized, please login', 401));
  }

  if (user.role === 'ADMIN') {
    return next(new AppError('Admin cannot purchase a subscription', 400));
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
    total_count: 12,
  });

  // Check if the subscription already exists for the given course
  const existingSubscription = user.subscriptions.find(sub => sub.course_id === course_id);
  console.log("existingSubscription.status", existingSubscription)


  if (existingSubscription && existingSubscription.status != "active") {
    // If the subscription already exists, update it
    existingSubscription.subscription_id = subscription.id;
    existingSubscription.status = subscription.status;
    console.log('Existing subscription updated with new subscription ID');
  } else {
    // If the subscription does not exist, add a new one
    user.subscriptions.push({
      subscription_id: subscription.id,
      status: subscription.status,
      course_id: course_id,
    });
    console.log('New subscription added');
  }

  await user.save();
  console.log('User subscriptions saved');

  res.status(200).json({
    success: true,
    message: 'Subscribed successfully',
    subscription_id: subscription.id,
  });
});

/**
 * @VERIFY_SUBSCRIPTION
 * @ROUTE @POST {{URL}}/api/v1/payments/verify
 * @ACCESS Private (Logged in user only)
 */
export const verifySubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { course_id, razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;
  console.log("in the verify subscription");
  console.log("razorpay_subscription_id:", razorpay_subscription_id);
  
  
  

  // Find the user by ID
  const user = await User.findById(id);
  console.log("courseId is", course_id);
  console.log("User ka subscriptions de laude :", user.subscriptions);
  

  // Find the subscription related to the specific course
  const subscription = user.subscriptions.find(
      sub => sub.subscription_id === razorpay_subscription_id
  );
  console.log("nicheaa lawre")
  console.log("PDHLO",subscription);
  


  if (!subscription) {
    return next(new AppError('Subscription for the specified course not found.', 404));
  }


  const subscriptionId = subscription.subscription_id;
  console.log("subscription id is", subscription.subscription_id);

  // Generate signature for verification
  const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest('hex');

  // Compare the generated signature with the one received from Razorpay
  if (generatedSignature !== razorpay_signature) {
    return next(new AppError('Payment not verified, please try again.', 400));
  }

  // Create a payment record
  await Payment.create({
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
    course_id,
  });

  // Update the subscription status for the specific course
  subscription.status = 'active';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
  });
});

/**
 * @CANCEL_SUBSCRIPTION
 * @ROUTE @POST {{URL}}/api/v1//payments/unsubscribe/:id
 * @ACCESS Private (Logged in user only)
 */
export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user; // Get the user ID from the request
  const course_id  = req.params.id; // The course ID for which the subscription is being canceled
  console.log("Course ID:", course_id);

  const user = await User.findById(id); // Fetch the user from the database

  if (!user) {
    return next(new AppError('User not found', 404)); // Check if user exists
  }

  if (user.role === 'ADMIN') {
    return next(new AppError('Admin does not need to cancel subscription', 400)); // Admin check
  }

  // Find the active subscription for the specified course_id
  const activeSubscription = user.subscriptions.find(sub => sub.status === 'active' && sub.course_id === course_id);

  if (!activeSubscription) {
    return next(new AppError('No active subscription found for this course', 400)); // Check if there's an active subscription
  }

  const subscriptionId = activeSubscription.subscription_id; // Use the subscription ID from the active subscription object
  console.log("Active Subscription ID:", subscriptionId);

  // Fetch subscription details before canceling
  const subscriptionDetails = await razorpay.subscriptions.fetch(subscriptionId);
  console.log("subscriptionDetails", subscriptionDetails);

  // Check if the subscription is already cancelled
  if (subscriptionDetails.status === 'cancelled') {
      return next(new AppError('Subscription is already cancelled', 400));
  }

  try {
    console.log("Active Subscription idddddddd:", subscriptionId);
    const canceledSubscription = await razorpay.subscriptions.cancel(subscriptionId);
    console.log("canceledSubscription",canceledSubscription);
    // Cancel the subscription with Razorpay
    

    // Find the payment record related to this subscription
    const payment = await Payment.findOne({
      razorpay_subscription_id: subscriptionId,
    });

    if (!payment) {
      return next(new AppError('Payment record not found for this subscription', 404)); // Check if payment record exists
    }

    const timeSinceSubscribed = Date.now() - payment.createdAt; // Calculate time since the subscription started
    const refundPeriod = 14 * 24 * 60 * 60 * 1000; // Define the refund period (14 days)

    if (timeSinceSubscribed > refundPeriod) {
      return next(new AppError('Refund period is over, so no refund will be provided.', 400)); // Check refund eligibility
    }

    // Refund the payment via Razorpay
    await razorpay.payments.refund(payment.razorpay_payment_id, { speed: 'optimum' });

    // Delete the payment record after refunding
    await payment.deleteOne();

    // Use MongoDB's $pull operator to remove the entire subscription object from the subscriptions array
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { subscriptions: { subscription_id: subscriptionId } } }, // Pull based on subscription_id
      { new: true } // Return the updated user document
    );

    if (!updatedUser.subscriptions.some(sub => sub.subscription_id === subscriptionId)) {
      console.log('Subscription successfully removed from user subscriptions array.');
    } else {
      console.log('Failed to remove the subscription.');
    }

    res.status(200).json({
      success: true,
      message: 'Subscription canceled, removed from user, and refund processed successfully',
      updatedSubscriptions: updatedUser.subscriptions, // Send updated subscriptions array in the response
    });
  } catch (error) {
    return next(new AppError(error.error.description, error.statusCode)); // Handle errors from Razorpay
  }
});



/**
 * @GET_RAZORPAY_ID
 * @ROUTE @POST {{URL}}/api/v1/payments/razorpay-key
 * @ACCESS Public
 */
export const getRazorpayApiKey = asyncHandler(async (_req, res, _next) => {
  res.status(200).json({
    success: true,
    message: 'Razorpay API key',
    key: process.env.RAZORPAY_KEY_ID,
  });
});

/**
 * @GET_RAZORPAY_ID
 * @ROUTE @GET {{URL}}/api/v1/payments
 * @ACCESS Private (ADMIN only)
 */

export const allPayments = asyncHandler(async (req, res, _next) => {
  const { count, skip } = req.query;

  // Retrieve all subscriptions from Razorpay
  const allPayments = await razorpay.subscriptions.all({
    count: count ? count : 10, // If count is provided, use it; otherwise, default to 10
    skip: skip ? skip : 0, // If skip is provided, use it; otherwise, default to 0
  });

  // Retrieve payments from MongoDB using the Payment model, sorted by creation date
  const payments = await Payment.find().sort({ createdAt: 1 });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Initialize months with zero payments
  const finalMonths = monthNames.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Process each payment and increment the corresponding month's count
  payments.forEach((payment) => {
    const paymentMonth = new Date(payment.createdAt).getMonth();
    const monthName = monthNames[paymentMonth];
    finalMonths[monthName] += 1;
  });

  // Map finalMonths to an array for monthlySalesRecord
  const monthlySalesRecord = monthNames.map((month) => finalMonths[month]);

  res.status(200).json({
    success: true,
    message: 'All payments',
    allPayments,
    finalMonths,
    monthlySalesRecord,
  });
});
