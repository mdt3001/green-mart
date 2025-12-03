"use client";
import { StarIcon, ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₫";

  const ratingArray = Array.isArray(product?.rating) ? product.rating : [];
  const averageRating =
    ratingArray.length > 0
      ? ratingArray.reduce((acc, item) => acc + item.rating, 0) /
        ratingArray.length
      : 0;

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
    <Link href={`/product/${product.id}`} className="group max-xl:mx-auto">
      <div className="relative bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center overflow-hidden">
        <Image
          width={500}
          height={500}
          className="w-full h-full group-hover:scale-115 transition duration-300 object-cover"
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
        {/* <div className="absolute top-2 right-2 flex gap-2 flex-col opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
            <Heart className="w-4 h-4" />
          </div>
          <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </div>
        </div> */}
      </div>
      <div className="flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60">
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
            {ratingArray.length > 0 && (
              <span className="text-xs text-gray-500">
                ({ratingArray.length})
              </span>
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
        <div className="bg-gray-1 rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors my-2 flex-shrink-0">
          <ShoppingCart className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
