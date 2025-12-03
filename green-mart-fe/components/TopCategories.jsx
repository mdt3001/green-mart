import { topCategoriesData } from "../assets/assets.js";
import Image from "next/image";
import React from "react";
import Title from "./Title.jsx";
import Link from "next/link.js";

export default function TopCategories() {
  return (
    <div className="my-10 max-w-7xl mx-5 sm:mx-auto">
      <Title
        visibleButton={false}
        title="Danh mục"
        description="Mua sắm theo danh mục phổ biến"
      />
      <div className="mt-4 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
        {topCategoriesData.map((category) => (
          <Link
            href={`/shop?category=${category.name}`}
            className="flex flex-col items-center text-center  py-3 lg:py-5 cursor-pointer hover:scale-105 transition-all"
            key={category.id}
          >
            <Image
              src={category.image}
              alt={category.name}
              width={180}
              height={120}
              className="rounded-lg object-cover"
            />
            <h3 className="my-2 text-base font-medium">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
