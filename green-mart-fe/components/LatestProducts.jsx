"use client";
import React, { useEffect, useState } from "react";
import Title from "./Title";
import ProductCard from "./ProductCard";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const LatestProducts = () => {
  const displayQuantity = 5;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.PUBLIC.LATEST_PRODUCTS, {
          params: { limit: displayQuantity },
        });

        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching latest products:", err);
        setError("Không thể tải sản phẩm mới nhất");
      } finally {
        setLoading(false);
      }
    };

    // Delay fetch to avoid blocking initial render
    const timer = setTimeout(fetchLatestProducts, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="mx-6 my-10 max-w-7xl sm:mx-auto">
        <Title
          title="Sản phẩm mới nhất"
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
        <Title title="Sản phẩm mới nhất" description={error} href="/shop" />
      </div>
    );
  }

  return (
    <div className="mx-6 my-10 max-w-7xl sm:mx-auto">
      <Title
        title="Sản phẩm mới nhất"
        description={`Hiển thị ${products.length} sản phẩm mới nhất`}
        href="/shop"
      />
      <div className="mt-8 grid grid-cols-2 sm:flex flex-wrap gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
