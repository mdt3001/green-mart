"use client";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.PENDING_SELLERS);
      const data = response.data.data;
      // Chuẩn hóa dữ liệu
      const normalizedStores = (data.data || []).map((store) => ({
        ...store,
        logo: store.logo?.trim() || null,
        image: store.image?.trim() || null,
        isActive: store.is_active ?? true,
      }));
      setStores(normalizedStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Không thể tải danh sách cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const toggleIsActive = async (storeId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.ADMIN.TOGGLE_SELLER_ACTIVE(storeId)
      );

      if (response.data.success) {
        // Cập nhật state local
        setStores((prevStores) =>
          prevStores.map((store) =>
            store.id === storeId
              ? { ...store, isActive: response.data.data.is_active }
              : store
          )
        );
        return Promise.resolve(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling store status:", error);
      throw new Error(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái cửa hàng"
      );
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return !loading ? (
    <div className="text-slate-800 font-medium mb-28">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Tổng số cửa hàng: {stores.length}</h1>
      </div>

      {stores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl transition-opacity ${
                !store.isActive
                  ? "opacity-60 border-slate-300"
                  : "border-slate-200"
              }`}
            >
              {/* Store Info */}
              <StoreInfo store={store} />

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <p
                  className={
                    store.isActive ? "text-green-600" : "text-slate-400"
                  }
                >
                  {store.isActive ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                </p>
                <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(toggleIsActive(store.id), {
                        loading: "Đang cập nhật dữ liệu...",
                        success: (msg) => msg || "Cập nhật thành công",
                        error: (err) => err.message || "Cập nhật thất bại",
                      })
                    }
                    checked={store.isActive}
                  />
                  <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            Chưa có cửa hàng nào được phê duyệt
          </h1>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
}
