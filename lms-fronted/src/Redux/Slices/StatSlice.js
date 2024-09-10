import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";
// import { data } from "autoprefixer";

const initialState = {
    allUsersCount: 0,
    subscriptionCount: 0,
    subscribedUsersCount: 0
};

export const getstatsData = createAsyncThunk("stats/get", async () => {
    try {
        const response = axiosInstance.get("/admin/stats/users");
        toast.promise(response, {
            loading: "Getting the stats...",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to load data stats"
        });

        return (await response).data;

    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

const statSLice = createSlice({
    name: "state",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getstatsData.fulfilled, (state, action) => {
            state.allUsersCount = action?.payload?.allUsersCount;
            state.subscriptionCount =  action?.payload?.subscriptionCount;
            state.subscribedUsersCount =  action?.payload?.subscribedUsersCount;
        });
    }
});

export default statSLice.reducer;