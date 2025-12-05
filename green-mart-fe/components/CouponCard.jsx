"use client";
import { TagIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { useDispatch, useSelector } from "react-redux";
import { saveCoupon } from "@/lib/redux/features/coupon/couponSlice";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const CouponCard = ({ coupon, showSaveButton = true }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { savedCoupons } = useSelector((state) => state.coupon);

  const isSaved = savedCoupons.some((c) => c.code === coupon.code);

  const formatDate = (dateString) => {
    if (!dateString) return "Không giới hạn";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const handleSaveCoupon = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Bạn cần đăng nhập để lưu mã giảm giá");
      return;
    }

    if (isSaved) return;

    try {
      await dispatch(saveCoupon(coupon.code)).unwrap();
      toast.success("Đã lưu mã giảm giá");
    } catch (err) {
      toast.error(err || "Không thể lưu mã giảm giá");
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon size={20} />
            <span className="font-bold text-lg">{coupon.code}</span>
          </div>
          <p className="text-sm opacity-90 mb-2">
            {coupon.description || "Mã giảm giá"}
          </p>
          <div className="flex items-center gap-4 text-xs opacity-80">
            {coupon.for_new_user && (
              <span className="bg-white/20 px-2 py-1 rounded">Người mới</span>
            )}
            {coupon.for_member && (
              <span className="bg-white/20 px-2 py-1 rounded">Thành viên</span>
            )}
          </div>
          <p className="text-xs mt-2 opacity-75">
            HSD: {formatDate(coupon.expires_at)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{coupon.discount}%</div>
          <div className="text-xs opacity-90">Giảm giá</div>
        </div>
      </div>
      {showSaveButton && (
        <button
          onClick={handleSaveCoupon}
          disabled={isSaved}
          className={`absolute bottom-4 right-4 px-5 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all ${
            isSaved
              ? "bg-white/40 text-white cursor-not-allowed border border-white/20"
              : "bg-white text-emerald-600 hover:bg-gray-100 shadow-md"
          }`}
        >
          {isSaved ? "Đã lưu" : "Lưu"}
        </button>
      )}
    </div>
  );
};

export default CouponCard;
