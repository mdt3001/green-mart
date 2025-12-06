"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { assets } from "@/assets/assets";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";

export default function StoreManageProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.SELLER.PRODUCTS}?page=${page}&per_page=10`
      );

      const responseData = response.data.data;

      setProducts(responseData.data);

      setPagination({
        currentPage: responseData.current_page,
        lastPage: responseData.last_page,
        total: responseData.total,
        from: responseData.from,
        to: responseData.to,
      });
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, in_stock: newStatus } : p
        )
      );

      await axiosInstance.put(
        `${API_PATHS.SELLER.TOGGLE_PRODUCT_STOCK(productId)}`
      );

      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, in_stock: currentStatus } : p
        )
      );
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await axiosInstance.delete(API_PATHS.SELLER.DELETE_PRODUCT(productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      toast.success("Đã xóa sản phẩm");
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa thất bại");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      fetchProducts(newPage);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl text-slate-800 font-medium">
          Quản lý sản phẩm
        </h1>
        <div className="text-sm text-slate-500">
          Tổng số:{" "}
          <span className="font-bold text-slate-800">{pagination.total}</span>{" "}
          sản phẩm
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg ring-1 ring-slate-200 shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Tên sản phẩm</th>
              <th className="px-4 py-3 hidden md:table-cell">Danh mục</th>
              <th className="px-4 py-3 text-right">Giá gốc</th>
              <th className="px-4 py-3 text-right">Giá bán</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 divide-y divide-slate-100 bg-white">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          fill
                          className="object-cover rounded border border-slate-200"
                          src={
                            Array.isArray(product.images) && product.images.length > 0
                              ? product.images[0]
                              : assets.upload_area
                          }
                          alt={product.name}
                          sizes="48px"
                        />
                      </div>
                      <div className="flex flex-col max-w-[200px] lg:max-w-xs">
                        <span
                          className="font-medium text-slate-900 truncate"
                          title={product.name}
                        >
                          {product.name}
                        </span>
                        <span
                          className="text-xs text-slate-500 truncate"
                          title={product.description}
                        >
                          {product.description}
                        </span>
                        {/* Rating */}
                        {product.ratings_count > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {Array(5)
                              .fill("")
                              .map((_, index) => (
                                <svg
                                  key={index}
                                  width="12"
                                  height="12"
                                  className="text-transparent"
                                  fill={product.ratings_avg_rating >= index + 1 ? "#00C950" : "#D1D5DB"}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            <span className="text-xs text-slate-500">
                              ({product.ratings_count})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category?.name || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500 line-through">
                    {formatPrice(product.mrp)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          onChange={() =>
                            toggleStock(product.id, product.in_stock)
                          }
                          checked={product.in_stock === 1}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Chưa có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-slate-500 hidden sm:block">
            Hiển thị {pagination.from} đến {pagination.to} trong tổng số{" "}
            {pagination.total} kết quả
          </div>
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm font-medium px-2">
              Trang {pagination.currentPage} / {pagination.lastPage}
            </span>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}