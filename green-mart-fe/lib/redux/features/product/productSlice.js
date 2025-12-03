import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_PATHS } from "@/utils/apiPaths";

export const fetchProductsByCategory = createAsyncThunk(
  "product/fetchProductsByCategory",
  async ({ categoryId, page = 1 }, { rejectWithValue }) => {
    try {
      const url = `${API_PATHS.PUBLIC.CATEGORY_PRODUCTS(categoryId)}?page=${page}`;
      const response = await axios.get(url);


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
    products: [],
    pagination: {},
    currentCategory: null,
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
