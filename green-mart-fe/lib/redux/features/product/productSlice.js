import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_PATHS.PUBLIC.PRODUCTS, {
        params,
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi tải sản phẩm");
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "product/fetchProductsByCategory",
  async ({ categoryId, page = 1 }, { rejectWithValue }) => {
    try {
      const url = `${API_PATHS.PUBLIC.CATEGORY_PRODUCTS(categoryId)}?page=${page}`;
      const response = await axiosInstance.get(url);


      return {
        products: response.data.data.data, 
        pagination: response.data.data, 
        categoryInfo: response.data.category, 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi khi tải sản phẩm");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],          // danh sách sản phẩm hiện tại
    pagination: {},        // object phân trang từ backend
    currentCategory: null, // giữ nguyên cho các màn khác nếu dùng
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dùng cho trang shop - gọi /api/public/products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.pagination = action.payload || {};
        state.products = action.payload?.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.currentCategory = action.payload.categoryInfo;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
