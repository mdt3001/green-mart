import { topCategoriesData } from "../assets/assets.js";
import Image from "next/image";
import React from "react";
import Title from "./Title.jsx";

export default function TopCategories() {
  return (
    <div className="my-20 max-w-7xl mx-auto">
      <Title
        visibleButton={false}
        title="CATEGORY"
        description="Shop by Top Categories"
      />
      <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
        {topCategoriesData.map((category) => (
          <div
            className="flex flex-col items-center text-center border py-3 lg:py-5 cursor-pointer border-gray-4 hover:border-primary transition-all"
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
          </div>
        ))}
      </div>
    </div>
  );
}
