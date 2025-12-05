import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import productReducer from "./features/product/productSlice";
import addressReducer from "./features/address/addressSlice";
import ratingReducer from "./features/rating/ratingSlice";
import orderReducer from "./features/order/orderSlice";
import couponReducer from "./features/coupon/couponSlice";
import categoryReducer from "./features/category/categorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      product: productReducer,
      address: addressReducer,
      rating: ratingReducer,
      order: orderReducer,
      coupon: couponReducer,
      category: categoryReducer,
    },
  });
};
