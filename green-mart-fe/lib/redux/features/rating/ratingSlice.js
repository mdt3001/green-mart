import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export const fetchMyRatings = createAsyncThunk(
  "rating/fetchMyRatings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.REVIEWS, {
        params,
      });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải đánh giá");
    }
  }
);

export const createRating = createAsyncThunk(
  "rating/createRating",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post(API_PATHS.CUSTOMER.ADD_REVIEW, payload);
      dispatch(fetchMyRatings());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi gửi đánh giá");
    }
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    list: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload || {};
        state.list = action.payload?.data || [];
      })
      .addCase(fetchMyRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRating.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ratingSlice.reducer;