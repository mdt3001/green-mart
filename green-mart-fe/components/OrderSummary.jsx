import { PlusIcon, SquarePenIcon, XIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchAddresses } from "@/lib/redux/features/address/addressSlice";
import {
  validateCoupon,
  clearCoupon,
  fetchAvailableCoupons,
  fetchSavedCoupons,
} from "@/lib/redux/features/coupon/couponSlice";
import { createOrder } from "@/lib/redux/features/order/orderSlice";
import { clearCartApi } from "@/lib/redux/features/cart/cartSlice";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const OrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "đ";

  const router = useRouter();
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.address.list);
  const couponState = useSelector((state) => state.coupon);
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [onlinePaymentGateway, setOnlinePaymentGateway] = useState("MOMO");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
    if (user) {
      dispatch(fetchSavedCoupons()).then((result) => {
        if (result.type === "coupon/fetchSavedCoupons/fulfilled") {
          console.log("Saved coupons loaded:", result.payload);
        }
      });
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      if (items.length > 0) {
        const storeId = items?.[0]?.store_id || items?.[0]?.store?.id;
        if (storeId) {
          dispatch(fetchAvailableCoupons(storeId));
        } else {
          dispatch(fetchSavedCoupons());
        }
      } else {
        dispatch(fetchSavedCoupons());
      }
    }
  }, [items, dispatch, user]);

  const handleCouponSelect = async (couponCode) => {
    if (!couponCode || items.length === 0) {
      dispatch(clearCoupon());
      setSelectedCouponCode("");
      return;
    }
    try {
      const storeId = items?.[0]?.store_id || items?.[0]?.store?.id;
      if (!storeId) throw new Error("Không xác định được cửa hàng của đơn.");
      await dispatch(
        validateCoupon({ code: couponCode, store_id: storeId })
      ).unwrap();
      setSelectedCouponCode(couponCode);
      toast.success("Áp dụng mã thành công");
    } catch (err) {
      toast.error(err?.message || "Mã không hợp lệ");
      setSelectedCouponCode("");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    console.log("Payment Method State:", paymentMethod);
    console.log("Gateway:", onlinePaymentGateway);

    if (!user) {
      toast.error("Bạn cần đăng nhập trước khi đặt hàng");
      setTimeout(() => router.push("/login/customer"), 1200);
      return;
    }

    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    if (!items.length) {
      toast.error("Giỏ hàng trống");
      return;
    }

    setIsProcessing(true);

    try {
      const storeId = items?.[0]?.store_id || items?.[0]?.store?.id;
      const payload = {
        store_id: storeId,
        address_id: selectedAddress?.id,
        payment_method: paymentMethod === "COD" ? "COD" : onlinePaymentGateway,
        items: items.map((it) => ({
          product_id: it.id,
          quantity: it.quantity || 1,
        })),
      };

      if (couponState.current?.code) {
        payload.coupon_code = couponState.current.code;
      }

      console.log("Order Payload:", payload);

      const orderResult = await dispatch(createOrder(payload)).unwrap();
      console.log("Order Result:", orderResult);

      const orderId = orderResult.id || orderResult.data?.id;
      console.log("Order ID:", orderId);

      // Handle online payment
      if (paymentMethod === "ONLINE" && orderId) {
        console.log("Payment with gateway:", onlinePaymentGateway);

        const finalAmount = couponState.current
          ? totalPrice - (couponState.current.discount / 100) * totalPrice
          : totalPrice;

        const endpoint =
          onlinePaymentGateway === "MOMO"
            ? API_PATHS.CUSTOMER.MOMO_PAYMENT
            : API_PATHS.CUSTOMER.VNPAY_PAYMENT;

        console.log("Payment Endpoint:", endpoint);
        console.log("Payment Amount:", finalAmount);

        const response = await axiosInstance.post(endpoint, {
          order_id: orderId,
          amount: Math.round(finalAmount),
        });

        console.log("Payment Response:", response.data);

        if (response.data.success && response.data.payUrl) {
          console.log("Redirecting to:", response.data.payUrl);

          // Clear cart and redirect to payment gateway
          try {
            await dispatch(clearCartApi());
            await dispatch(clearCoupon());
          } catch (err) {
            console.warn("Cart clear failed, continuing:", err);
          }

          // Force redirect
          window.location.href = response.data.payUrl;
          // Don't set isProcessing to false - keep loading state during redirect
          return;
        } else {
          throw new Error("Không thể tạo thanh toán");
        }
      } else {
        // COD order
        console.log("Processing COD payment");
        dispatch(clearCartApi());
        dispatch(clearCoupon());
        toast.success("Đặt hàng thành công");
        router.push("/orders");
      }
    } catch (err) {
      console.error("Order Error:", err);
      console.error("Error Response:", err.response?.data);
      toast.error(
        err?.message || err.response?.data?.message || "Không thể đặt hàng"
      );
      setIsProcessing(false);
    }
  };

  const finalTotal = couponState.current
    ? totalPrice - (couponState.current.discount / 100) * totalPrice
    : totalPrice;

  return (
    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
      <h2 className="text-xl font-medium text-slate-600">Thông tin đơn hàng</h2>

      <p className="text-slate-400 text-xs my-4">Phương thức thanh toán</p>
      <div className="flex gap-2 items-center">
        <input
          type="radio"
          id="COD"
          name="payment"
          onChange={() => setPaymentMethod("COD")}
          checked={paymentMethod === "COD"}
          className="accent-gray-500"
        />
        <label htmlFor="COD" className="cursor-pointer">
          Thanh toán khi nhận hàng
        </label>
      </div>
      <div className="flex gap-2 items-center mt-1">
        <input
          type="radio"
          id="ONLINE"
          name="payment"
          onChange={() => setPaymentMethod("ONLINE")}
          checked={paymentMethod === "ONLINE"}
          className="accent-gray-500"
        />
        <label htmlFor="ONLINE" className="cursor-pointer">
          Thanh toán online
        </label>
      </div>

      {/* Payment gateway selection for online payment */}
      {paymentMethod === "ONLINE" && (
        <div className="ml-6 mt-2 mb-4 space-y-1">
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              id="MOMO"
              name="gateway"
              onChange={() => setOnlinePaymentGateway("MOMO")}
              checked={onlinePaymentGateway === "MOMO"}
            />
            <label htmlFor="MOMO" className="cursor-pointer">
              MoMo
            </label>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="radio"
              id="VNPAY"
              name="gateway"
              onChange={() => setOnlinePaymentGateway("VNPAY")}
              checked={onlinePaymentGateway === "VNPAY"}
            />
            <label htmlFor="VNPAY" className="cursor-pointer">
              VNPay
            </label>
          </div>
        </div>
      )}

      {/* Address selection */}
      <div className="my-4 py-4 border-y border-slate-200 text-slate-400">
        <p>Địa chỉ giao hàng</p>
        {selectedAddress ? (
          <div className="flex gap-2 items-center mt-2">
            <p className="flex-1">
              {selectedAddress.name}, {selectedAddress.city},{" "}
              {selectedAddress.state}, {selectedAddress.zip}
            </p>
            <SquarePenIcon
              onClick={() => setSelectedAddress(null)}
              className="cursor-pointer"
              size={18}
            />
          </div>
        ) : (
          <div>
            {addressList.length > 0 && (
              <select
                className="border border-slate-400 p-2 w-full my-3 outline-none rounded"
                onChange={(e) => {
                  const index = parseInt(e.target.value);
                  if (!isNaN(index) && index >= 0) {
                    setSelectedAddress(addressList[index]);
                  }
                }}
                defaultValue=""
              >
                <option value="">Chọn địa chỉ</option>
                {addressList.map((address, index) => (
                  <option key={address.id} value={index}>
                    {address.name}, {address.city}, {address.state},{" "}
                    {address.zip}
                  </option>
                ))}
              </select>
            )}
            <button
              className="flex items-center gap-1 text-slate-600 mt-1"
              onClick={() => setShowAddressModal(true)}
            >
              Thêm địa chỉ <PlusIcon size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="pb-4 border-b border-slate-200">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-slate-400">
            <p>Tổng tiền sản phẩm:</p>
            <p>Phí vận chuyển:</p>
            {couponState.current && <p>Mã giảm giá:</p>}
          </div>
          <div className="flex flex-col gap-1 font-medium text-right">
            <p>
              {totalPrice.toLocaleString("vi-VN")}
              {currency}
            </p>
            <p>Miễn phí</p>
            {couponState.current && (
              <p>{`-${(
                (couponState.current.discount / 100) *
                totalPrice
              ).toLocaleString("vi-VN")}${currency}`}</p>
            )}
          </div>
        </div>

        {!couponState.current ? (
          <div className="mt-3">
            {(() => {
              const couponsToShow =
                couponState.list && couponState.list.length > 0
                  ? couponState.list
                  : couponState.savedCoupons &&
                    couponState.savedCoupons.length > 0
                  ? couponState.savedCoupons
                  : [];

              return couponsToShow.length > 0 ? (
                <select
                  className="border border-slate-400 p-2 w-full outline-none rounded"
                  value={selectedCouponCode}
                  onChange={(e) => handleCouponSelect(e.target.value)}
                >
                  <option value="">Chọn mã giảm giá</option>
                  {couponsToShow.map((coupon) => (
                    <option key={coupon.code} value={coupon.code}>
                      {coupon.code} - Giảm {coupon.discount}%{" "}
                      {coupon.description ? `(${coupon.description})` : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-slate-400 text-center">
                  Không có mã giảm giá khả dụng
                </p>
              );
            })()}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 text-xs mt-2">
            <p>
              Mã:{" "}
              <span className="font-semibold ml-1">
                {couponState.current.code.toUpperCase()}
              </span>
            </p>
            <p>{couponState.current.description}</p>
            <XIcon
              size={18}
              onClick={() => {
                dispatch(clearCoupon());
                setSelectedCouponCode("");
              }}
              className="hover:text-red-700 transition cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between py-4">
        <p>Tổng tiền thanh toán:</p>
        <p className="font-medium text-right">
          {finalTotal.toLocaleString("vi-VN")}
          {currency}
        </p>
      </div>

      <button
        onClick={(e) =>
          toast.promise(handlePlaceOrder(e), { loading: "Đang xử lý..." })
        }
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {paymentMethod === "ONLINE" ? "Tiến hành thanh toán" : "Đặt hàng"}
      </button>

      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  );
};

export default OrderSummary;
