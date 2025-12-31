import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export const fetchStoreCoupons = createAsyncThunk(
  "coupon/fetchStoreCoupons",
  async (storeId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.CUSTOMER.STORE_COUPONS(storeId)
      );
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải mã giảm giá");
    }
  }
);

export const validateCoupon = createAsyncThunk(
  "coupon/validateCoupon",
  async ({ code, store_id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.CUSTOMER.VALIDATE_COUPON, {
        code,
        store_id,
      });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Mã không hợp lệ");
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    list: [],
    current: null, // coupon đã validate
    loading: false,
    error: null,
  },
  reducers: {
    clearCoupon: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchStoreCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateCoupon.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;

