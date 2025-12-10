"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thanh toán thất bại
        </h1>
        <p className="text-gray-600 mb-6">
          Thanh toán qua {method?.toUpperCase()} không thành công. Vui lòng thử lại.
        </p>
        <div className="space-y-3">
          <Link
            href="/cart"
            className="block w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
          >
            Quay lại giỏ hàng
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

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}