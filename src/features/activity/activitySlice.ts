import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchUserActivity = createAsyncThunk(
  "activity/fetch",
  async ({ token }: { token: string | any }, { rejectWithValue }) => {
    if (!token) {
      return rejectWithValue("Token is expired. Login again");
    }
    try {
      const res = await api.getUserActivity(token);
      return res.activities;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

type ActivityState = {
  list: any[];
  loading: boolean;
};

const initialState: ActivityState = {
  list: [],
  loading: false,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserActivity.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default activitySlice.reducer;
