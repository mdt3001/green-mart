"use client";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MailIcon, MapPinIcon } from "lucide-react";
import Loading from "@/components/Loading";
import Image from "next/image";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import CouponCard from "@/components/CouponCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreCoupons, fetchSavedCoupons } from "@/lib/redux/features/coupon/couponSlice";
import { useAuth } from "@/context/AuthContext";

export default function StoreShop() {
    // Param tên là username nhưng giá trị là storeId (vì folder route là [username])
    const { username: storeId } = useParams();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { list: storeCoupons } = useSelector((state) => state.coupon);

    const [products, setProducts] = useState([]);
    const [storeInfo, setStoreInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Lấy thông tin store theo ID
                const storeRes = await axiosInstance.get(
                    API_PATHS.PUBLIC.STORE_DETAIL(storeId)
                );
                setStoreInfo(storeRes.data?.data || null);

                // 2. Lấy sản phẩm của store
                const productsRes = await axiosInstance.get(
                    API_PATHS.PUBLIC.STORE_PRODUCTS(storeId),
                    { params: { per_page: 100 } }
                );
                // API trả về paginate => lấy mảng data.data
                setProducts(productsRes.data?.data?.data || []);
            } catch (err) {
                console.error("Error fetching store data:", err);
                setError("Không tìm thấy cửa hàng hoặc sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        if (storeId) {
            fetchStoreData();
            dispatch(fetchStoreCoupons(storeId));
            if (user) {
                dispatch(fetchSavedCoupons());
            }
        }
    }, [storeId, dispatch, user]);

    if (loading) {
        return <Loading />;
    }

    if (error || !storeInfo) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center text-gray-600">
                {error || "Không tìm thấy cửa hàng."}
            </div>
        );
    }

    return (
      <div className="min-h-[70vh] mx-6">
        {/* Store Info Banner */}
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
          <Image
            src={storeInfo.logo}
            alt={storeInfo.name}
            className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md"
            width={200}
            height={200}
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-semibold text-slate-800">
              {storeInfo.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-lg">
              {storeInfo.description}
            </p>
            <div className="space-y-2 text-sm text-slate-500 mt-4">
              <div className="flex items-center justify-center md:justify-start">
                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.address}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                <span>{storeInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Store Coupons */}
        {storeCoupons.length > 0 && (
          <div className="max-w-7xl mx-auto mt-8 mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Mã giảm giá của cửa hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeCoupons.map((coupon) => (
                <CouponCard key={coupon.code} coupon={coupon} />
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="max-w-7xl mx-auto mb-40">
          <h1 className="text-2xl mt-12">
            Sản phẩm của{" "}
            <span className="text-slate-800 font-medium">{storeInfo.name}</span>
          </h1>
          <div className="mt-8 grid grid-cols-2 sm:flex flex-wrap gap-2">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                Cửa hàng chưa có sản phẩm nào.
              </div>
            )}
          </div>
        </div>
      </div>
    );
}

