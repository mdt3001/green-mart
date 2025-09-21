"use client";
import { StarIcon, ShoppingCart, Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  // Calculate the average rating of the product
  const rating = Math.round(
    product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
      product.rating.length
  );
    
    const sale = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <Link href={`/product/${product.id}`} className="group max-xl:mx-auto">
      <div className="relative bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center">
        <Image
          width={500}
          height={500}
          className="max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300"
          src={product.images[0]}
          alt=""
        />
        <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg shadow">
          Sale {sale}%
        </span>
        {/* Heart and Eye icons in top-right corner */}
        <div className="absolute top-2 right-2 flex gap-2 flex-col">
          <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
            <Heart className="w-4 h-4 text-gray-9" />
          </div>
          <div className="bg-white rounded-full p-2 w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
            <Eye className="w-4 h-4 text-gray-9" />
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60">
        <div>
          <p>{product.name}</p>
          <div className="flex">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <StarIcon
                  key={index}
                  size={14}
                  className="text-transparent mt-0.5"
                  fill={
                    rating >= index + 1 ? "var(--color-warning)" : "#D1D5DB"
                  }
                />
              ))}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-xl">
              {currency}
              {product.price}
            </p>
            <p className="text-xs text-gray-7 line-through">
              {currency}
              {product.mrp}
            </p>
          </div>
        </div>
        <div className="bg-gray-1 rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors mx-4 my-2">
          <ShoppingCart className="w-5 h-5 text-gray-9" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
