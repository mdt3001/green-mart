"use client";
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import Loading from "@/components/Loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { House } from "lucide-react";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export default function Product() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get(
          API_PATHS.PUBLIC.PRODUCT_DETAIL(productId)
        );
        const data = res.data?.data;

        // Chuẩn hóa dữ liệu cho ProductDetails (dùng field rating như cũ)
        const normalized = {
          ...data,
          rating: data.ratings || [], // BE trả ratings[]
        };

        setProduct(normalized);
      } catch (err) {
        setError("Không tìm thấy sản phẩm.");
      } finally {
        setLoading(false);
        scrollTo(0, 0);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="mx-6 max-w-7xl mx-auto py-10">
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-6 max-w-7xl mx-auto py-10 text-center text-gray-600">
        <p>{error || "Không tìm thấy sản phẩm."}</p>
        <button
          onClick={() => router.push("/shop")}
          className="mt-4 px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-800"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-8 mb-5">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 hover:text-black"
          >
            <House size={16} />
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/shop")}
            className="hover:text-black"
          >
            Cửa hàng
          </button>
          <span>/</span>
          <span className="font-semibold text-black">{product.name}</span>
        </div>

        {/* Product Details */}
        <ProductDetails product={product} />

        {/* Description & Reviews */}
        <ProductDescription product={product} />
      </div>
    </div>
  );
}