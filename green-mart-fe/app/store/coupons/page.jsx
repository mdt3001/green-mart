"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import Loading from "@/components/Loading";

export default function StoreCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.SELLER.COUPONS);
      setCoupons(response.data.data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Không thể tải danh sách mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const toggleCoupon = async (code, currentStatus) => {
    const newStatus = !currentStatus;

    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, is_enabled: newStatus } : c))
    );

    try {
      await axiosInstance.post(API_PATHS.SELLER.TOGGLE_COUPON(code));
      toast.success(
        newStatus
          ? "Mã giảm giá đã được kích hoạt"
          : "Mã giảm giá đã bị vô hiệu hóa"
      );
    } catch (error) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.code === code ? { ...c, is_enabled: currentStatus } : c
        )
      );

      console.error("Error toggling coupon:", error);
      toast.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl text-slate-800 font-medium pb-6">
        Quản Lý Mã Giảm Giá
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Mã giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Hết hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Loại
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-500"
                >
                  Chưa có mã giảm giá nào
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">
                      {coupon.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">
                      {coupon.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {coupon.discount}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700">
                      {coupon.expires_at
                        ? format(new Date(coupon.expires_at), "dd/MM/yyyy")
                        : "Vô thời hạn"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {coupon.is_public && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Công khai
                        </span>
                      )}
                      {coupon.for_new_user && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Mới
                        </span>
                      )}
                      {coupon.for_member && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={coupon.is_enabled}
                          onChange={() =>
                            toggleCoupon(coupon.code, coupon.is_enabled)
                          }
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
