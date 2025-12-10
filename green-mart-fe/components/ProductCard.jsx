"use client";
import { StarIcon, ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₫";

  const ratingArray = Array.isArray(product?.ratings) ? product.ratings : [];
  const averageRating =
    product?.ratings_avg_rating ??
    (ratingArray.length > 0
      ? ratingArray.reduce((acc, item) => acc + item.rating, 0) /
        ratingArray.length
      : 0);
  const ratingCount = product?.ratings_count ?? ratingArray.length;

  const sale =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const productImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : product.image || "https://placehold.co/400x400?text=No+Image";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group max-xl:mx-auto border p-2 rounded-lg bg-white hover:shadow-md hover:border-green-600 transition-shadow flex flex-col items-start"
    >
     <div className="relative  h-40 sm:w-60 sm:h-68 rounded-lg overflow-hidden">
  <Image
    fill
    className="group-hover:scale-115 transition duration-300 object-cover"
    src={productImage}
    alt={product.name || "Product"}
  />
  
  {sale > 0 && (
    <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg shadow">
      -{sale}%
    </span>
  )}

  {product.in_stock === 0 && (
    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow">
      Hết hàng
    </span>
  )}
</div>

      <div className="text-sm text-slate-800 pt-2 max-w-60">
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium">{product.name}</p>
          {product.store && (
            <p className="text-xs text-gray-500 truncate">
              {product.store.name}
            </p>
          )}
          <div className="flex items-center gap-1 mt-1">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <StarIcon
                  key={index}
                  size={14}
                  className="text-transparent"
                  fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
                />
              ))}
            {ratingCount > 0 && (
              <span className="text-xs text-gray-500">({ratingCount})</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-semibold text-lg text-primary">
              {formatPrice(product.price)}
              {currency}
            </p>
            {product.mrp && product.mrp > product.price && (
              <p className="text-xs text-gray-400 line-through">
                {formatPrice(product.mrp)}
                {currency}
              </p>
            )}
          </div>
        </div>
        {/* <div className="bg-gray-1 rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors my-2 flex-shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div> */}
      </div>
    </Link>
  );
};

export default ProductCard;
