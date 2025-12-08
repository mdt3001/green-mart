"use client";
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { removeCartItem, fetchCart } from "@/lib/redux/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@/components/Loading";

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "đ";

  const { items, loading, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleDeleteItemFromCart = (productId) => {
    dispatch(removeCartItem({ productId }));
  };

  const cartArray = items.map((item) => {
    const product = item.product || item;
    const quantity = item.quantity || item.qty || cartItems[product.id] || 0;
    return { ...product, quantity };
  });

  const totalPrice = cartArray.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );

  if (loading) {
    return <Loading />;
  }

  return cartArray.length > 0 ? (
    <div className="min-h-screen mx-6 text-slate-800">
      <div className="max-w-7xl mx-auto ">
        <PageTitle
          heading="Giỏ hàng"
          text="Sản phẩm trong giỏ hàng"
          linkText="Thêm sản phẩm"
        />

        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <table className="w-full max-w-4xl text-slate-600 table-auto">
            <thead>
              <tr className="max-sm:text-sm">
                <th className="text-left">Sản phẩm</th>
                <th>Số lượng</th>
                <th>Tổng giá</th>
                <th className="max-md:hidden">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartArray.map((item, index) => (
                <tr key={index} className="space-x-2">
                  <td className="flex gap-3 my-4">
                    <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md overflow-hidden">
                      <Image
                        src={item.images?.[0]}
                        className="object-cover w-full h-full"
                        alt=""
                        width={45}
                        height={45}
                      />
                    </div>
                    <div>
                      <p className="max-sm:text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.category?.name || ""}
                      </p>
                      <p>
                        {Number(item.price || 0).toLocaleString("vi-VN")}
                        {currency}
                      </p>
                    </div>
                  </td>
                  <td className="text-center">
                    <Counter productId={item.id} />
                  </td>
                  <td className="text-center">
                    {(Number(item.price || 0) * (item.quantity || 0)).toLocaleString(
                      "vi-VN"
                    )}
                    {currency}
                  </td>
                  <td className="text-center max-md:hidden">
                    <button
                      onClick={() => handleDeleteItemFromCart(item.id)}
                      className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all"
                    >
                      <Trash2Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <OrderSummary totalPrice={totalPrice} items={cartArray} />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[80vh] mx-6 flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Giỏ hàng trống
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-8">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
        </p>
        <Link
          href="/shop"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    </div>
  );
}
