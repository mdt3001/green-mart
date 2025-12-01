"use client";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { X, Image as ImageIcon, Eye } from "lucide-react";
import { Mailbox } from "lucide-react";
import Image from "next/image";

export default function AdminApprove() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'approve' or 'reject'
  const [selectedStore, setSelectedStore] = useState(null);
  const [reason, setReason] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStoreDetail, setSelectedStoreDetail] = useState(null);

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.ADMIN.PENDING_SELLERS + "?status=pending"
      );
      const data = response.data.data;
      // Chuẩn hóa dữ liệu
      const normalizedStores = (data.data || []).map((store) => ({
        ...store,
        logo: store.logo?.trim() || null,
        image: store.image?.trim() || null,
        BRCImages: store.BRCImages ? JSON.parse(store.BRCImages) : [],
      }));
      setStores(normalizedStores);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cửa hàng:", error);
      toast.error("Không thể tải danh sách cửa hàng đang chờ");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (store, type) => {
    setSelectedStore(store);
    setModalType(type);
    setReason("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStore(null);
    setReason("");
    setModalType("");
  };

  const handleSubmit = async () => {
    if (!selectedStore) return;

    try {
      if (modalType === "approve") {
        await axiosInstance.post(
          API_PATHS.ADMIN.APPROVE_SELLER(selectedStore.id),
          {
            note: reason || "Đã được phê duyệt bởi quản trị viên",
          }
        );
        toast.success("Cửa hàng đã được phê duyệt thành công");
      } else {
        if (!reason.trim()) {
          toast.error("Vui lòng nhập lý do từ chối");
          return;
        }
        await axiosInstance.post(
          API_PATHS.ADMIN.REJECT_SELLER(selectedStore.id),
          {
            reason: reason,
          }
        );
        toast.success("Cửa hàng đã bị từ chối");
      }
      closeModal();
      fetchStores();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái cửa hàng:", error);
      toast.error(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái cửa hàng"
      );
    }
  };

  const openDetailModal = (store) => {
    setSelectedStoreDetail(store);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedStoreDetail(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="text-slate-500 mb-28">
      <div className="mb-6">
        <h1 className="text-slate-800 font-medium text-2xl">
          Cửa hàng đang chờ phê duyệt
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Tổng số: {stores.length} đơn đăng ký
        </p>
      </div>

      {stores.length ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              <StoreInfo store={store} />

              <div className="flex gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => openDetailModal(store)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2 transition-colors"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => openModal(store, "approve")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2 transition-colors"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => openModal(store, "reject")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-2 transition-colors"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80 bg-white rounded-lg border border-slate-200">
          <div className="text-center">
            <Mailbox size={48} className="mx-auto text-green-600" />
            <h2 className="text-2xl text-slate-400 font-medium">
              Không có đơn đăng ký nào đang chờ
            </h2>
            <p className="text-slate-400 mt-2">
              Tất cả các đơn đăng ký đã được xử lý
            </p>
          </div>
        </div>
      )}

      {showModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                {modalType === "approve"
                  ? "Phê duyệt cửa hàng"
                  : "Từ chối cửa hàng"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Tên cửa hàng</p>
                <p className="text-lg font-medium text-slate-800">
                  {selectedStore.name}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {modalType === "approve"
                    ? "Ghi chú (không bắt buộc)"
                    : "Lý do từ chối *"}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px]"
                  placeholder={
                    modalType === "approve"
                      ? "Nhập ghi chú cho cửa hàng..."
                      : "Nhập lý do từ chối cửa hàng..."
                  }
                />
                {modalType === "reject" && (
                  <p className="text-xs text-slate-500 mt-2">
                    Lý do từ chối sẽ được gửi đến chủ cửa hàng qua email
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors ${
                    modalType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {modalType === "approve" ? "Chấp nhận" : "Từ chối"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedStoreDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-800">
                Thông tin chi tiết cửa hàng
              </h3>
              <button
                onClick={closeDetailModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Tên cửa hàng</p>
                  <p className="font-medium text-slate-800">
                    {selectedStoreDetail.name}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="font-medium text-slate-800">
                    {selectedStoreDetail.email || "Không có"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Số điện thoại</p>
                  <p className="font-medium text-slate-800">
                    {selectedStoreDetail.contact || "Không có"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Địa chỉ</p>
                  <p className="font-medium text-slate-800">
                    {selectedStoreDetail.address || "Không có"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  Thông tin Giấy chứng nhận đăng ký kinh doanh
                </h4>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-slate-600 font-medium">
                          Mã số thuế
                        </p>
                      </div>
                      <p className="font-semibold text-slate-800 text-lg">
                        {selectedStoreDetail.BRCTaxCode || "Không có"}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-slate-600 font-medium">
                          Số GCNĐKKD
                        </p>
                      </div>
                      <p className="font-semibold text-slate-800 text-lg">
                        {selectedStoreDetail.BRCNumber || "Không có"}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-slate-600 font-medium">
                          Ngày cấp
                        </p>
                      </div>
                      <p className="font-medium text-slate-800">
                        {formatDate(selectedStoreDetail.BRCDateOfissue)}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-slate-600 font-medium">
                          Nơi cấp
                        </p>
                      </div>
                      <p className="font-medium text-slate-800">
                        {selectedStoreDetail.BRCPlaceOfissue || "Không có"}
                      </p>
                    </div>
                  </div>

                  {selectedStoreDetail.BRCImages &&
                    selectedStoreDetail.BRCImages.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon size={18} className="text-slate-600" />
                          <h5 className="font-medium text-slate-800">
                            Hình ảnh GCNĐKKD
                          </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedStoreDetail.BRCImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-video rounded-lg overflow-hidden border-2 border-slate-200 group-hover:border-primary transition-colors">
                                <Image
                                  src={image}
                                  alt={`GCNĐKKD ${index + 1}`}
                                  width={400}
                                  height={300}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <a
                                href={image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg"
                              >
                                <Eye
                                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  size={24}
                                />
                              </a>
                              <p className="text-center text-sm text-slate-500 mt-2">
                                Ảnh {index + 1}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {selectedStoreDetail.description && (
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-3">
                    Mô tả cửa hàng
                  </h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                    {selectedStoreDetail.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
