import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/AuthSlice";
import courseSliceReducer from "./Slices/CourseSlice";
// import RazorpaySlice from "./Slices/RazorpaySlice";
import RazorPaySLiceReducer from "./Slices/RazorpaySlice";
import lectureSliceReducer from "./Slices/LectureSlice";
import statSliceReducer from "./Slices/StatSlice";




const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: courseSliceReducer,
        razorPay: RazorPaySLiceReducer,
        lecture: lectureSliceReducer,
        stat: statSliceReducer
    },
    devTools: true
    
});

export default store;