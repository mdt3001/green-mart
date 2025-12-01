"use client";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import SellerNavbar from "./StoreNavbar";
import SellerSidebar from "./StoreSidebar";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";

const StoreLayout = ({ children }) => {
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);

  const fetchIsSeller = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SELLER.STORE);
      
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        setIsSeller(true);
        setStoreInfo(responseData.data); 
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchIsSeller();
  }, []);

  return loading ? (
    <Loading />
  ) : isSeller ? (
    <div className="flex flex-col h-screen">
      <SellerNavbar storeInfo={storeInfo} />
      <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
        <SellerSidebar storeInfo={storeInfo} />
        <div className="flex-1 h-full p-5 lg:pl-12 lg:pt-12 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
        Bạn không có quyền truy cập vào trang này.
      </h1>
      <Link
        href="/"
        className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full"
      >
        Về trang chủ <ArrowRightIcon size={18} />
      </Link>
    </div>
  );
};

export default StoreLayout;