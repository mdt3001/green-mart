"use client";
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { removeCartItem, fetchCart } from "@/lib/redux/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
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
    <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
      <h1 className="text-2xl sm:text-4xl font-semibold">
        Giỏ hàng của bạn chưa có sản phẩm nào
      </h1>
    </div>
  );
}
