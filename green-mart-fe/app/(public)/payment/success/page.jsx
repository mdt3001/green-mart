"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [method, setMethod] = useState("");

  useEffect(() => {
    const id = searchParams.get("order_id");
    const paymentMethod = searchParams.get("method");
    setOrderId(id || "");
    setMethod(paymentMethod || "");
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Đơn hàng #{orderId} đã được thanh toán qua {method?.toUpperCase()}
        </p>
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Xem đơn hàng
          </Link>
          <Link
            href="/shop"
            className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}