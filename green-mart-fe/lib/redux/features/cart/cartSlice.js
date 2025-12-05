import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const normalizeItems = (items) => {
  const cartItems = {};
  let total = 0;
  (items || []).forEach((item) => {
    const productId = item.product_id || item.product?.id || item.id;
    const quantity = item.quantity || item.qty || 1;
    if (productId) {
      cartItems[productId] = quantity;
      total += quantity;
    }
  });
  return { cartItems, total };
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API_PATHS.CUSTOMER.CART);
      const data = res.data?.data;
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      return items;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi tải giỏ hàng");
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post(API_PATHS.CUSTOMER.ADD_TO_CART, {
        product_id: productId,
        quantity,
      });
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi thêm giỏ hàng");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.put(API_PATHS.CUSTOMER.UPDATE_CART, {
        product_id: productId,
        quantity,
      });
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi cập nhật giỏ hàng");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId }, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_PATHS.CUSTOMER.REMOVE_FROM_CART(productId));
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi xóa sản phẩm");
    }
  }
);

export const clearCartApi = createAsyncThunk(
  "cart/clearCartApi",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(API_PATHS.CUSTOMER.CLEAR_CART);
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Lỗi làm trống giỏ hàng");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cartItems: {},
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        const { cartItems, total } = normalizeItems(state.items);
        state.cartItems = cartItems;
        state.total = total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCartApi.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
