import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {},
    resetEmailSent: false,
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("/user/register", data);
        toast.promise(res, {
            loading: "Wait! creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("/user/login", data);
        toast.promise(res, {
            loading: "Wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.post("user/logout");
        toast.promise(res, {
            loading: "Wait! logout in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log out"
        });
        localStorage.clear();
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Forgot Password Thunk
export const forgotPassword = createAsyncThunk("/auth/forgotPassword", async (email, thunkAPI) => {
    try {
        const res = axiosInstance.post("/user/reset", { email });
        toast.promise(res, {
            loading: "Sending reset email...",
            success: "Reset email sent successfully",
            error: "Failed to send reset email"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Reset Password Thunk
export const resetPassword = createAsyncThunk("/auth/resetPassword", async ({ resetToken, password }) => {
    try {
        const res = axiosInstance.post(`/user/reset/${resetToken}`, { password });
        toast.promise(res, {
            loading: "Resetting password...",
            success: "Password reset successfully",
            error: "Failed to reset password"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Change Password Thunk
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
      const res = axiosInstance.post("/user/change-password", {
        oldPassword,
        newPassword,
      });
      toast.promise(res, {
        loading: "Changing password...",
        success: "Password changed successfully",
        error: "Failed to change password"
      });
      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update/${data[0]}`, data[1]);
        toast.promise(res, {
            loading: "Wait! profile update in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to update profile"
        });
        return (await res).data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch(error) {
        toast.error(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.data = {};
                state.isLoggedIn = false;
                state.role = "";
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                if(!action?.payload?.user) return;
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.resetEmailSent = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.resetEmailSent = false;
            })
            .addCase(changePassword.fulfilled, (state) => {
                // Optionally handle any state changes after successful password change
                // For instance, you might want to clear certain state values or update user data
            });
    }
});

export default authSlice.reducer;