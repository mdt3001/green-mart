"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

export default function StoreOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.SELLER.ORDERS}?page=${page}&per_page=15`
      );
      const responseData = response.data.data;

      setOrders(responseData.data);
      setPagination({
        currentPage: responseData.current_page,
        lastPage: responseData.last_page,
        total: responseData.total,
        from: responseData.from,
        to: responseData.to,
      });
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await axiosInstance.patch(
        `${API_PATHS.SELLER.UPDATE_ORDER_STATUS(orderId)}`,
        {
          status: newStatus,
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Cập nhật thành công!", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại", {
        id: toastId,
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchOrders(newPage);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl text-slate-800 font-medium">
          Quản lý đơn hàng
        </h1>
        <span className="text-sm text-slate-500">
          Tổng: {pagination.total} đơn
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded text-slate-500">
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Khách hàng</th>
                  <th className="px-6 py-3">Tổng tiền</th>
                  <th className="px-6 py-3">Thanh toán</th>
                  <th className="px-6 py-3">Coupon</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {(pagination.currentPage - 1) * 15 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {order.user?.name || "Khách vãng lai"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {order.user?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs border border-slate-200 bg-slate-50 font-medium">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.is_coupon_used && order.coupon ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          {order.coupon.code}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className={`border-0 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-200 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="ORDER_PLACED">Mới đặt</option>
                        <option value="PROCESSING">Đang xử lý</option>
                        <option value="SHIPPED">Đang giao</option>
                        <option value="DELIVERED">Đã giao</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openModal(order)}
                        className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-slate-500 hidden sm:block">
            Hiển thị {pagination.from} - {pagination.to} trên {pagination.total}{" "}
            đơn hàng
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-2">
              Trang {pagination.currentPage} / {pagination.lastPage}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <div
          onClick={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">
                Chi tiết đơn hàng #{selectedOrder.id.slice(0, 8)}...
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-700">Tên:</span>{" "}
                      {selectedOrder.user?.name}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">Email:</span>{" "}
                      {selectedOrder.user?.email}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">SĐT:</span>{" "}
                      {selectedOrder.address?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="font-semibold text-slate-800 mb-3">
                    Địa chỉ giao hàng
                  </h3>
                  <div className="text-sm text-slate-600">
                    <p className="font-medium text-slate-900">
                      {selectedOrder.address?.name}
                    </p>
                    <p>{selectedOrder.address?.street}</p>
                    <p>
                      {selectedOrder.address?.state},{" "}
                      {selectedOrder.address?.city}
                    </p>
                    <p>{selectedOrder.address?.country}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-3">
                  Sản phẩm đã đặt
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                      <tr>
                        <th className="px-4 py-3">Sản phẩm</th>
                        <th className="px-4 py-3 text-center">SL</th>
                        <th className="px-4 py-3 text-right">Đơn giá</th>
                        <th className="px-4 py-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.order_items?.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  (Array.isArray(item.product?.images) &&
                                    item.product?.images[0]) ||
                                  "https://placehold.co/50"
                                }
                                alt={item.product?.name}
                                className="w-12 h-12 object-cover rounded border border-gray-200"
                              />
                              <span
                                className="font-medium text-slate-800 line-clamp-1 max-w-[200px]"
                                title={item.product?.name}
                              >
                                {item.product?.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-500">
                            {formatPrice(item.price)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-full md:w-1/2 space-y-2 bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Phương thức thanh toán:
                    </span>
                    <span className="font-medium">
                      {selectedOrder.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Trạng thái thanh toán:
                    </span>
                    <span
                      className={
                        selectedOrder.is_paid
                          ? "text-green-600 font-medium"
                          : "text-amber-600 font-medium"
                      }
                    >
                      {selectedOrder.is_paid
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </span>
                  </div>
                  {selectedOrder.is_coupon_used && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon ({selectedOrder.coupon?.code}):</span>
                      <span>Đã áp dụng</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 my-2 pt-2 flex justify-between text-lg font-bold text-slate-900">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-xl">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
