"use client";
import Loading from "@/components/Loading";
import OrdersAreaChart from "@/components/OrdersAreaChart";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StoreIcon,
  TagsIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "đ";

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    revenue: 0,
    orders: 0,
    stores: 0,
    allOrders: [],
  });

  // Format số tiền theo kiểu Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + currency;
  };

  // Format số lượng
  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const dashboardCardsData = [
    {
      title: "Tổng Sản Phẩm",
      value: formatNumber(dashboardData.products),
      icon: ShoppingBasketIcon,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-500",
    },
    {
      title: "Tổng Doanh Thu",
      value: formatCurrency(dashboardData.revenue),
      icon: CircleDollarSignIcon,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-500",
    },
    {
      title: "Tổng Đơn Hàng",
      value: formatNumber(dashboardData.orders),
      icon: TagsIcon,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-500",
    },
    {
      title: "Tổng Cửa Hàng",
      value: formatNumber(dashboardData.stores),
      icon: StoreIcon,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-500",
    },
  ];

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.ADMIN.DASHBOARD);
      const data = response.data.data;

      setDashboardData({
        products: data.totalProducts || 0,
        revenue: data.totalRevenue || 0,
        orders: data.totalOrders || 0,
        stores: data.totalStores || 0,
        allOrders: data.ordersPerDay || [],
      });
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu bảng điều khiển");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Lấy thời gian hiện tại để hiển thị lời chào
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  // Format ngày tháng hiện tại
  const getCurrentDate = () => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  };

  if (loading) return <Loading />;

  return (
    <div className="text-slate-600">
      {/* Header với lời chào */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {getGreeting()}, {user?.name || "Quản trị viên"}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              {getCurrentDate()} • Đây là tổng quan hệ thống của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-slate-800 mb-2">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-xl`}>
                <card.icon size={24} className={card.textColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Biểu đồ đơn hàng */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Biểu đồ đơn hàng
            </h2>
            <p className="text-sm text-slate-500">
              Thống kê số lượng đơn hàng theo ngày
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="90">90 ngày qua</option>
            </select>
          </div>
        </div>
        <OrdersAreaChart allOrders={dashboardData.allOrders} />
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center text-sm text-slate-400">
        <p>
          Dữ liệu được cập nhật lần cuối:{" "}
          {new Date().toLocaleTimeString("vi-VN")}
        </p>
      </div>
    </div>
  );
}
