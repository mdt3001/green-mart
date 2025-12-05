import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.ADDRESSES);
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải địa chỉ");
    }
  }
);

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post(API_PATHS.CUSTOMER.ADDRESSES, payload);
      dispatch(fetchAddresses());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tạo địa chỉ");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.put(API_PATHS.CUSTOMER.ADDRESS_DETAIL(id), data);
      dispatch(fetchAddresses());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi cập nhật địa chỉ");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_PATHS.CUSTOMER.ADDRESS_DETAIL(id));
      dispatch(fetchAddresses());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi xóa địa chỉ");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;