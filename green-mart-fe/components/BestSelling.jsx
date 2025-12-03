"use client";
import React, { useEffect, useState } from "react";
import Title from "./Title";
import ProductCard from "./ProductCard";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const BestSelling = () => {
  const displayQuantity = 10;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          API_PATHS.PUBLIC.BEST_SELLING_PRODUCTS,
          {
            params: { limit: displayQuantity },
          }
        );

        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching best selling products:", err);
        setError("Không thể tải sản phẩm bán chạy nhất");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, []);

  if (loading) {
    return (
      <div className="mx-6 my-10 max-w-7xl sm:mx-auto">
        <Title
          title="Sản phẩm đang bán chạy"
          description="Đang tải..."
          href="/shop"
        />
        <div className="mt-8 grid grid-cols-2 sm:flex flex-wrap gap-2 justify-between">
          {[...Array(displayQuantity)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg w-60 h-68"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-6 my-10 max-w-7xl sm:mx-auto">
        <Title title="Sản phẩm đang bán chạy" description={error} href="/shop" />
      </div>
    );
  }

  return (
    <div className="mx-6 my-10 max-w-7xl sm:mx-auto">
      <Title
        title="Sản phẩm đang bán chạy"
        description={`Hiển thị ${products.length} sản phẩm đang bán chạy`}
        href="/shop"
      />
      <div className="mt-8 grid grid-cols-2 sm:flex flex-wrap gap-2 justify-between">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
