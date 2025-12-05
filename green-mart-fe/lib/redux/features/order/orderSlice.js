import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.ORDERS, {
        params,
      });
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải đơn hàng");
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  "order/fetchOrderDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.ORDER_DETAIL(id));
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải chi tiết đơn");
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.CUSTOMER.ORDERS, payload);
      return res.data?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tạo đơn hàng");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_PATHS.CUSTOMER.CANCEL_ORDER(id));
      dispatch(fetchOrders());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi hủy đơn");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    list: [],
    pagination: {},
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload || {};
        state.list = action.payload?.data || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;

