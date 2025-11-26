"use client";
import Loading from "@/components/Loading";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  TagsIcon,
  PackageIcon,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { assets } from "@/assets/assets";

export default function Dashboard() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₫";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  const [dashboardData, setDashboardData] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    orders_by_status: [],
    top_products: [],
    revenue_by_day: [],
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const endpoint = API_PATHS.SELLER.ANALYTICS_OVERVIEW;
      const response = await axiosInstance.get(endpoint, {
        params: {
          period: period,
        },
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getProductImage = (imageString) => {
    try {
      const images = JSON.parse(imageString);
      return Array.isArray(images) && images.length > 0
        ? images[0]
        : assets.box_icon;
    } catch (e) {
      return assets.box_icon;
    }
  };

  // Helper 1: Màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper 2: Dịch trạng thái sang Tiếng Việt (MỚI THÊM)
  const getStatusLabel = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "Mới đặt hàng";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang vận chuyển";
      case "DELIVERED":
        return "Giao thành công";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status; // Fallback nếu có trạng thái lạ
    }
  };

  const dashboardCardsData = [
    {
      title: "Tổng sản phẩm",
      value: dashboardData.total_products,
      icon: ShoppingBasketIcon,
      color: "bg-blue-500",
    },
    {
      title: "Tổng doanh thu",
      value: formatPrice(dashboardData.total_revenue),
      icon: CircleDollarSignIcon,
      color: "bg-green-500",
    },
    {
      title: "Tổng đơn hàng",
      value: dashboardData.total_orders,
      icon: TagsIcon,
      color: "bg-orange-500",
    },
  ];

  if (loading && !dashboardData.total_products) return <Loading />;

  return (
    <div className="text-slate-500 mb-28 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl text-slate-800 font-medium">
          Bảng điều khiển cửa hàng
        </h1>

        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
        >
          <option value={7}>7 ngày qua</option>
          <option value={30}>30 ngày qua</option>
          <option value={90}>3 tháng qua</option>
          <option value={365}>Năm nay</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {card.title}
              </p>
              <b className="text-2xl font-bold text-slate-800">{card.value}</b>
            </div>
            <div
              className={`p-4 rounded-full text-white ${card.color} bg-opacity-90 shadow-lg shadow-blue-100`}
            >
              <card.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Order Status Section --- */}
        <div className="lg:col-span-1 border border-slate-200 rounded-xl p-6 bg-white shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PackageIcon size={20} /> Trạng thái đơn hàng
          </h2>
          {dashboardData.orders_by_status.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.orders_by_status.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {/* SỬ DỤNG HÀM DỊCH TIẾNG VIỆT TẠI ĐÂY */}
                    {getStatusLabel(item.status)}
                  </span>
                  <span className="font-bold text-slate-700">
                    {item.count} đơn
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">
              Chưa có dữ liệu đơn hàng trong {period} ngày qua.
            </p>
          )}
        </div>

        {/* --- Top Products Section --- */}
        <div className="lg:col-span-2 border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Sản phẩm bán chạy (Top 5)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3 text-center">Đã bán</th>
                  <th className="px-4 py-3 text-right">Doanh thu</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData.top_products.length > 0 ? (
                  dashboardData.top_products.map((product, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                            <Image
                              src={getProductImage(product.images)}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                              {product.name}
                            </p>
                            <span className="text-xs text-slate-500">
                              ID: {product.id.substring(0, 6)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-600">
                        {product.total_sold}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-green-600">
                        {formatPrice(product.revenue)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => router.push(`/product/${product.id}`)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded transition"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-slate-400 italic"
                    >
                      Chưa có sản phẩm bán chạy trong {period} ngày qua.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
