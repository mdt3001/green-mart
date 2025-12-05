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
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Mã không hợp lệ";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveCoupon = createAsyncThunk(
  "coupon/saveCoupon",
  async (code, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.CUSTOMER.SAVE_COUPON, {
        code,
      });
      return res.data?.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Không thể lưu mã giảm giá";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSavedCoupons = createAsyncThunk(
  "coupon/fetchSavedCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.SAVED_COUPONS);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải mã giảm giá đã lưu");
    }
  }
);

export const fetchAvailableCoupons = createAsyncThunk(
  "coupon/fetchAvailableCoupons",
  async (storeId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.AVAILABLE_COUPONS(storeId));
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải mã giảm giá");
    }
  }
);

export const removeSavedCoupon = createAsyncThunk(
  "coupon/removeSavedCoupon",
  async (code, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_PATHS.CUSTOMER.REMOVE_SAVED_COUPON(code));
      return code;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Không thể xóa mã giảm giá");
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    list: [],
    savedCoupons: [],
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
      })
      .addCase(saveCoupon.fulfilled, (state, action) => {
        // Thêm vào saved coupons nếu chưa có
        if (!state.savedCoupons.find(c => c.code === action.payload.code)) {
          state.savedCoupons.push(action.payload);
        }
      })
      .addCase(fetchSavedCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.savedCoupons = action.payload || [];
      })
      .addCase(fetchSavedCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAvailableCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAvailableCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Nếu fetch available coupons thất bại, fallback về saved coupons
        if (state.savedCoupons && state.savedCoupons.length > 0) {
          state.list = state.savedCoupons;
        }
      })
      .addCase(removeSavedCoupon.fulfilled, (state, action) => {
        state.savedCoupons = state.savedCoupons.filter(c => c.code !== action.payload);
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;

