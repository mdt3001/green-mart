"use client";
import { useEffect, useState } from "react";
import CouponCard from "./CouponCard";
import Title from "./Title";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedCoupons } from "@/lib/redux/features/coupon/couponSlice";
import { useAuth } from "@/context/AuthContext";

const PublicCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const displayQuantity = 4;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.PUBLIC.COUPONS);
        setCoupons(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching public coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    // Delay fetch to avoid blocking initial render
    const timer = setTimeout(() => {
      fetchCoupons();
      if (user) {
        dispatch(fetchSavedCoupons());
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dispatch, user]);

  if (loading) {
    <div className="px-6 my-20 max-w-7xl mx-auto">
      <Title
        visibleButton={false}
        title="Mã giảm giá"
        description="Lưu ngay mã giảm giá để nhận ưu đãi"
      />
      <div className="mt-8 grid grid-cols-2 sm:flex flex-wrap gap-5">
        {[...Array(displayQuantity)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse rounded-lg w-60 h-68"
          ></div>
        ))}
      </div>
    </div>;
  }

  if (coupons.length === 0) {
    return null;
  }

  return (
    <div className="px-6 my-20 max-w-7xl mx-auto">
      <Title
        visibleButton={false}
        title="Mã giảm giá"
        description="Lưu ngay mã giảm giá để nhận ưu đãi"
      />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.code} coupon={coupon} />
        ))}
      </div>
    </div>
  );
};

export default PublicCoupons;
