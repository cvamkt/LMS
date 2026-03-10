import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    courseData: [],
    subscribedCourses: [],
    recommendedCourses: []
}

export const getAllCourses = createAsyncThunk("/course/get", async () => {
    try {
        const response = axiosInstance.get("/courses");
        toast.promise(response, {
            loading: "loading course data...",
            success: "Courses loaded successfully",
            error: "Failed to get the courses",
        });

        return (await response).data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getSubscribedCourses = createAsyncThunk("user/getSubscribedCourses", async () => {
    try {
        const promise = axiosInstance.get("/courses/subscribed-courses");

        // Toast notifications for loading, success, and error states
        toast.promise(promise, {
            loading: "Loading your courses...",
            success: "Courses loaded successfully",
            error: "Failed to get the courses",
        });

        const response = await promise; // Await the promise here
        console.log("COURSES....", response.data.subscribedCourses);
        // console.log("API Subscribed Courses Data:", response.data.subscribedCourses);

        // Assuming the structure is: { success: true, subscribedCourses: [...] }
        return response.data.subscribedCourses;  // Ensure this matches the API response structure

    } catch (error) {
        console.log("Error occurred:", error);
        toast.error(error?.response?.data?.message || "An error occurred");
        return [];  // Return an empty array on error
    }
});


export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
    try {
        const response = axiosInstance.delete(`/courses/${id}`);
        toast.promise(response, {
            loading: "deleting course ...",
            success: "Courses deleted successfully",
            error: "Failed to delete the courses",
        });

        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const createNewCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        let formData = new FormData();
        formData.append("title", data?.title);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("createdBy", data?.createdBy);
        formData.append("thumbnail", data?.thumbnail);

        const response = axiosInstance.post("/courses", formData);
        toast.promise(response, {
            loading: "Creating new course",
            success: "Course created successfully",
            error: "Failed to create course"
        });
        console.log("RESPONSE", response);


        return (await response).data

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const generateCourseDescription = createAsyncThunk("course/generateCourseDescription", async ({ title, category }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/courses/generate-CourseDescription", { title, category });
        return response.data.description;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to generate description");
    }
}
);
export const getRecommendedCourses = createAsyncThunk("course/recommend", async (category, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/courses/recommend-courses", { category });
        return response.data.recommendedCourses;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to recommend the courses");
    }
})

const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            if (action.payload) {
                state.courseData = [...action.payload];
            }
        });
        builder.addCase(getSubscribedCourses.fulfilled, (state, action) => {
            if (Array.isArray(action.payload)) {
                state.subscribedCourses = action.payload;
            } else {
                console.error("Payload is not an array:", action.payload);
                state.subscribedCourses = [];  // Ensure an empty array on unexpected payload
            }
        });
        builder.addCase(generateCourseDescription.fulfilled, (state, action) => {
            state.generateCourseDescription = action.payload;
        });
        builder.addCase(generateCourseDescription.rejected, (state, action) => {
            toast.error(action.payload || "Failed to generate description");
        });
        builder.addCase(getRecommendedCourses.fulfilled, (state, action) => {
            state.recommendedCourses = action.payload;
        });
        builder.addCase(getRecommendedCourses.rejected, (state, action) => {
            state.error = action.payload;
            toast.error(action.payload || "Failed to recommend courses");
        });


    }
});

export default courseSlice.reducer;