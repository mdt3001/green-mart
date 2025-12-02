"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Trash2, Store as StoreIcon } from "lucide-react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import Loading from "@/components/Loading";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedStoreIds, setSelectedStoreIds] = useState([]);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    for_new_user: false,
    for_member: false,
    is_public: true,
    expires_at: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    store_ids: [],
  });

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.COUPONS);
      setCoupons(response.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách mã giảm giá");
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.PENDING_SELLERS);
      setStores(response.data.data?.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const couponData = {
        code: newCoupon.code.toUpperCase(),
        description: newCoupon.description,
        discount: parseFloat(newCoupon.discount),
        for_new_user: newCoupon.for_new_user,
        for_member: newCoupon.for_member,
        is_public: newCoupon.is_public,
        expires_at: newCoupon.expires_at,
        store_ids: newCoupon.store_ids,
      };

      await axiosInstance.post(API_PATHS.ADMIN.COUPONS, couponData);
      toast.success("Thêm mã giảm giá thành công");
      fetchCoupons();

      // Reset form
      setNewCoupon({
        code: "",
        description: "",
        discount: "",
        for_new_user: false,
        for_member: false,
        is_public: true,
        expires_at: format(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd"
        ),
        store_ids: [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thêm mã giảm giá"
      );
    }
  };

  const deleteCoupon = async (code) => {
    if (!confirm("Bạn có chắc muốn xóa mã này?")) return;

    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_COUPON(code));
      toast.success("Xóa mã giảm giá thành công");
      fetchCoupons();
    } catch (error) {
      toast.error("Không thể xóa mã giảm giá");
    }
  };

  const openAssignModal = (coupon) => {
    setSelectedCoupon(coupon);
    setSelectedStoreIds(coupon.stores?.map((s) => s.id) || []);
    setShowAssignModal(true);
  };

  const handleAssignStores = async () => {
    try {
      await axiosInstance.post(
        API_PATHS.ADMIN.ASSIGN_COUPON_TO_STORES(selectedCoupon.code),
        { store_ids: selectedStoreIds }
      );
      toast.success("Gán cửa hàng thành công");
      setShowAssignModal(false);
      fetchCoupons();
    } catch (error) {
      console.error("Error assigning stores:", error);
      toast.error("Không thể gán cửa hàng");
    }
  };

  const toggleStoreSelection = (storeId) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  useEffect(() => {
    fetchCoupons();
    fetchStores();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="text-slate-500 mb-40">
      {/* Add Coupon Form */}
      <form onSubmit={handleAddCoupon} className="max-w-2xl text-sm">
        <h2 className="text-2xl mb-4 text-slate-800 font-medium">
          Thêm mã giảm giá
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Mã giảm giá (VD: SUMMER2024)"
            className="p-2 border border-slate-200 outline-slate-400 rounded-md"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, code: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Giảm giá (%)"
            min={1}
            max={100}
            className="p-2 border border-slate-200 outline-slate-400 rounded-md"
            value={newCoupon.discount}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discount: e.target.value })
            }
            required
          />
        </div>

        <input
          type="text"
          placeholder="Mô tả"
          className="w-full mt-3 p-2 border border-slate-200 outline-slate-400 rounded-md"
          value={newCoupon.description}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, description: e.target.value })
          }
          required
        />

        <div className="mt-3">
          <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
          <input
            type="date"
            className="w-full p-2 border border-slate-200 outline-slate-400 rounded-md"
            value={newCoupon.expires_at}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, expires_at: e.target.value })
            }
          />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={newCoupon.for_new_user}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, for_new_user: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
            </label>
            <span>Chỉ dành cho người dùng mới</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={newCoupon.for_member}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, for_member: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
            </label>
            <span>Chỉ dành cho thành viên</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={newCoupon.is_public}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, is_public: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
            </label>
            <span>Công khai (Tất cả cửa hàng)</span>
          </div>
        </div>

        {!newCoupon.is_public && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Chọn cửa hàng
            </label>
            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md p-2">
              {stores.map((store) => (
                <label
                  key={store.id}
                  className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={newCoupon.store_ids.includes(store.id)}
                    onChange={() => {
                      setNewCoupon((prev) => ({
                        ...prev,
                        store_ids: prev.store_ids.includes(store.id)
                          ? prev.store_ids.filter((id) => id !== store.id)
                          : [...prev.store_ids, store.id],
                      }));
                    }}
                  />
                  <span className="text-sm">{store.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="mt-5 px-8 py-3 rounded bg-green-600 text-white hover:bg-green-700 active:scale-95 transition"
        >
          Thêm Mã Giảm Giá
        </button>
      </form>

      {/* Coupons List */}
      <div className="mt-14">
        <h2 className="text-2xl mb-4">
          Danh Sách{" "}
          <span className="text-slate-800 font-medium">Mã Giảm Giá</span>
        </h2>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Mã
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Mô tả
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Giảm giá
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Hết hạn
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Loại
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Cửa hàng
                </th>
                <th className="py-3 px-4 text-left font-semibold text-slate-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {coupon.code}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {coupon.description}
                  </td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    {coupon.discount}%
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {coupon.expires_at
                      ? format(new Date(coupon.expires_at), "dd/MM/yyyy")
                      : "Vô thời hạn"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {coupon.for_new_user && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Mới
                        </span>
                      )}
                      {coupon.for_member && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          VIP
                        </span>
                      )}
                      {coupon.is_public && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Công khai
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openAssignModal(coupon)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <StoreIcon size={16} />
                      <span className="text-xs">
                        ({coupon.stores?.length || 0})
                      </span>
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-red-500 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Stores Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Gán Cửa Hàng - {selectedCoupon?.code}
            </h3>

            <div className="max-h-64 overflow-y-auto mb-4">
              {stores.map((store) => (
                <label
                  key={store.id}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStoreIds.includes(store.id)}
                    onChange={() => toggleStoreSelection(store.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{store.name}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAssignStores}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 bg-slate-300 text-slate-700 py-2 rounded hover:bg-slate-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
