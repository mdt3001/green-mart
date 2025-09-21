'use client'
import { saleBanners } from "../assets/assets.js";
import Image from "next/image";

import React from 'react'

const FlashSale = () => {
  return (
    <div className="my-30 max-w-7xl mx-10 grid grid-cols-1  sm:mx-auto sm:flex flex-wrap gap-6 justify-between">
      {saleBanners.map((banner) => (
        <div className="relative" key={banner.id}>
          <Image src={banner.image} alt={`Flash Sale ${banner.id}`} width={400} />
        </div>
      ))}
    </div>
  );
}

export default FlashSale;

