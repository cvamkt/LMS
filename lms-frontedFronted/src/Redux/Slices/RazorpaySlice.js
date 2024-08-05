import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayment: {},
    finalMonth: {},
    monthlySalesRecord: []
};

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/razorpay-key");
        console.log("getRazorPayID response:", response);
        return response.data;
    } catch (error) {
        toast.error("Failed to load data");
        console.error("getRazorPayID error:", error);
        throw error;
    }
});

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    try {
        console.log("Sending request to /payments/subscribe");
        const response = await axiosInstance.post("/payments/subscribe");
        console.log("purchaseCourseBundle response:", response);
        return response.data;
    } catch (error) {
        console.error("purchaseCourseBundle error:", error);
        toast.error(error?.response?.data?.message || "Failed to purchase course bundle");
        throw error;
    }
});

export const verifyUserPayment = createAsyncThunk("/payments/verify", async (data) => {
    try {
        const response = await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        console.log("verifyUserPayment response:", response);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Payment verification failed");
        console.error("verifyUserPayment error:", error);
        throw error;
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                console.log("getRazorPayId fulfilled:", action);
                state.key = action?.payload?.key || "";
                console.log("key updated", state.key);
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                console.log("purchaseCourseBundle fulfilled:", action.payload);
                state.subscription_id = action?.payload?.subscription_id || "";
            })
            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                console.log("verifyUserPayment fulfilled:", action);
                toast.success(action.payload?.message);
                state.isPaymentVerified = action.payload?.success || false;
            })
            .addCase(verifyUserPayment.rejected, (state, action) => {
                console.log("verifyUserPayment rejected:", action);
                toast.error(action.payload?.message);
                state.isPaymentVerified = false;
            });
    }
});

export default razorpaySlice.reducer;