"use client";
import { assets } from "@/assets/assets";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import CategoriesMarquee from "./CategoriesMarquee";

const Hero = () => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  return (
    <div className="mx-6">
      <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10">
        <div className="overflow-hidden relative flex-1 flex flex-col bg-gradient-to-r from-primary-hard via-primary to-primary-soft rounded-3xl xl:min-h-100 group">
          <div className="p-5 sm:p-16">
            <div className="inline-flex items-center gap-3 bg-white text-primary pr-4 p-1 rounded-full text-xs sm:text-sm">
              <span className="bg-primary px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs">
                NEWS
              </span>{" "}
              Free Shipping on Orders Above $50!{" "}
              <ChevronRightIcon
                className="group-hover:ml-2 transition-all"
                size={16}
              />
            </div>
            <h2 className="text-3xl sm:text-5xl leading-[1.2] my-3 font-medium  bg-clip-text text-white max-w-xs  sm:max-w-md">
              Fresh & Healthy Organic Food
            </h2>
            <div className="text-white text-sm font-medium mt-4 sm:mt-8 flex items-center gap-4">
              <p className="text-2xl">Sale up to</p>
              <p className="text-2xl bg-warning py-1 px-3 rounded-md">
                30% OFF
              </p>
            </div>
            <div className="mt-8">
              <button className="btn btn-border btn-md">
                SHOP NOW{" "}
                <ArrowRightIcon
                  className="group-hover:ml-4 transition-all inline ml-2"
                  size={16}
                />
              </button>
            </div>
          </div>
          <Image
            className="sm:absolute bottom-0 right-0 md:right-10 md:top-17 w-full sm:max-w-lg scale-150"
            src={assets.hero_model_img}
            alt=""
          />
        </div>
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-gray-9">
          <div className="flex-1 flex items-center justify-between w-full bg-gray-4 rounded-3xl p-6 px-8 group overflow-hidden">
            <div className="gap-1 flex flex-col">
              <p className="text-xl font-medium bg-clip-text text-gray-9 max-w-40">
                SUMMER SALE
              </p>
              <p className="text-3xl">75% OFF</p>
              <p>Only Fruit & Vegetable</p>
              <p className="flex items-center gap-1 mt-4 text-primary cursor-pointer">
                Shop Now{" "}
                <ArrowRightIcon
                  className="group-hover:ml-2 transition-all cursor-pointer"
                  size={18}
                />{" "}
              </p>
            </div>
            <Image
              className="w-35 scale-220 mr-10 "
              src={assets.hero_product_img1}
              alt=""
            />
          </div>
          <div className="flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group relative overflow-hidden">
            <Image
              className="object-cover absolute inset-0 z-0 rounded-3xl"
              src={assets.hero_product_img2}
              fill
              alt=""
            />
            <div className="relative z-10 gap-1 flex flex-col">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-white text-xl">BEST DEAL</p>
                <p className="text-white text-3xl">
                  Special Products Deal of the Month
                </p>
                <p className="flex items-center gap-1 mt-4 text-primary cursor-pointer">
                  Shop Now{" "}
                  <ArrowRightIcon
                    className="group-hover:ml-2 transition-all"
                    size={18}
                  />{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <CategoriesMarquee /> */}
    </div>
  );
};

export default Hero;
