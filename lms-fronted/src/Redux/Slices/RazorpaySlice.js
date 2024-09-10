import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";
import { useParams } from "react-router-dom";

const initialState = {
    key: null,
    subscription_id: null,
    isPaymentVerified: false,
    loading: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
};
// const { course_id } = useParams();
// console.log("LAUDE K ID",course_id);


// Fetch Razorpay key
export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/razorpay-key");
        return response.data;
    } catch (error) {
        toast.error("Failed to load data");
        throw error;
    }
});

// Purchase course bundle
export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async (course_id) => {
    try {
        const response = await axiosInstance.post("/payments/subscribe", {
            course_id
        });
        console.log("BADA LAUDA", response.data);
        return {
            subscription_id: response.data.subscription_id,
            success: response.data.success
        };
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to purchase course bundle");
        throw error;
    }
});

// Verify user payment
export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
    console.log("SUBSCRIPTION_ID", data.subscription_id);

    try {
        const response = await axiosInstance.post("/payments/verify", {
            course_id: data.courseId,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        console.log("verifyResponse", response);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Payment verification failed");
        throw error;
    }
});

// Get payment record
export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = await axiosInstance.get("/payments?count=100");
        console.log("getPaymentRecord Response:", response);
        return response.data;
    } catch (error) {
        toast.error("Operation failed");
        throw error;
    }
});

// Cancel course bundle
export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(`/payments/unsubscribe/${id}`);
        console.log("RESPONSE", response);
        // toast.promise(response, {
        //     loading: "Unsubscribing the bundle",
        //     success: "Successfully unsubscribed",
        //     error: "Failed to unsubscribe"
        // });
        return response.data;
    } catch (error) {
        // toast.error(error?.response?.data?.message || "Failed to unsubscribe");
        // throw error;
        return rejectWithValue(error?.response?.data)
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                state.key = action?.payload?.key;
            })

            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                state.loading = false;
                state.subscription_id = action?.payload?.subscription_id;
                state.success = action.payload.success;
            })
            .addCase(purchaseCourseBundle.rejected, (state) => {
                state.error = "Failed to purchase course bundle";
            })

            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                console.log(action);
                toast.success(action?.payload?.message);
                state.isPaymentVerified = action?.payload?.success;
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                toast.error(action?.error?.message || "Payment verification failed");
                state.isPaymentVerified = false;
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                console.log("getPaymentRecord Fulfilled Action:", action);
                state.allPayments = action?.payload?.allPayments || {}; // Ensure safe access
                state.finalMonths = action?.payload?.finalMonths || {};
                state.monthlySalesRecord = action?.payload?.monthlySalesRecord || [];
            })
            .addCase(getPaymentRecord.rejected, (state, action) => {
                toast.error("Failed to retrieve payment records");
                console.error("Failed to retrieve payment records:", action.error);
            });
    }
});

export default razorpaySlice.reducer;
