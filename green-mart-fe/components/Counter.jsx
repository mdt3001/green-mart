"use client";
import {
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "@/lib/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Counter = ({ productId }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const qty = cartItems?.[productId] || 0;
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const ensureAuth = () => {
    if (!user) {
      router.push("/login/customer");
      return false;
    }
    return true;
  };

  const inc = () => {
    if (!ensureAuth()) return;
    const next = qty + 1;
    if (qty > 0) {
      dispatch(updateCartItem({ productId, quantity: next }));
    } else {
      dispatch(addCartItem({ productId, quantity: 1 }));
    }
  };

  const dec = () => {
    if (!ensureAuth()) return;
    if (qty <= 1) {
      dispatch(removeCartItem({ productId }));
    } else {
      dispatch(updateCartItem({ productId, quantity: qty - 1 }));
    }
  };

  return (
    <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
      <button onClick={dec} className="p-1 select-none">
        -
      </button>
      <p className="p-1">{qty}</p>
      <button onClick={inc} className="p-1 select-none">
        +
      </button>
    </div>
  );
};

export default Counter;
