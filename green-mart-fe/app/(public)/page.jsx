'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import TopCategories from "@/components/TopCategories";
import  FlashSale  from "@/components/FlashSale";

export default function Home() {
    return (
        <div>
            <Hero />
            <TopCategories />
            <FlashSale />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
