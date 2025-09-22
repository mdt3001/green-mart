"use client";
import { Suspense, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { MoveLeftIcon, ChevronRight, StarIcon, House } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

function ShopContent() {
  // get query params ?search=abc
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const categoryParam = searchParams.get("category"); // Thêm dòng này để lấy category từ query param
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  // Toggle helpers
  const toggleShowFilters = () => setShowFilters((prev) => !prev);

  // Category (radio) — cho phép bỏ chọn khi click lại
  const [category, setCategory] = useState(""); // Khởi tạo từ param sau useEffect

  // Thêm useEffect để set category từ query param khi component mount hoặc param thay đổi
  useEffect(() => {
    if (categoryParam && category !== categoryParam) {
      setCategory(categoryParam);
    }
  }, [categoryParam]);

  const toggleCategory = (value) => {
    setCategory((prev) => (prev === value ? "" : value));
  };

  // Rating (checkbox)
  const [ratings, setRatings] = useState(new Set());
  const toggleRating = (value) => {
    setRatings((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  // Price range (input + apply)
  const [price, setPrice] = useState({ min: "", max: "" });
  const [appliedPrice, setAppliedPrice] = useState({ min: 0, max: Infinity });
  const applyPrice = () => {
    setAppliedPrice({
      min: Number(price.min) || 0,
      max: Number(price.max) || Infinity,
    });
  };

  // Sort
  const [sort, setSort] = useState("relevant");
  const handleSortChange = (e) => setSort(e.target.value);

  const products = useSelector((state) => state.product.list);

  const getAverageRating = (p) => {
    const arr = Array.isArray(p?.rating) ? p.rating : [];
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, cur) => acc + (Number(cur?.rating) || 0), 0);
    return sum / arr.length;
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill("")
      .map((_, index) => (
        <StarIcon
          key={index}
          size={14}
          className="text-transparent mt-0.5"
          fill={rating >= index + 1 ? "var(--color-warning)" : "#D1D5DB"}
        />
      ));
  };

  const filteredProducts = (search
    ? products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    : products)
    .filter((p) => (category ? p.category === category : true))
    .filter((p) => p.price >= appliedPrice.min && p.price <= appliedPrice.max)
    .filter((p) => {
      if (ratings.size === 0) return true;
      const avg = getAverageRating(p);
      return Array.from(ratings).some((r) => avg >= r);
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    return 0; // relevant
  });

  const breadcrumbCategory = category || ""; // Đã có sẵn, sẽ tự động cập nhật khi category thay đổi

  return (
    <div className="min-h-[70vh] mx-6 max-w-7xl sm:mx-auto mb-40">
      <div className=" flex items-center gap-2 text-gray-600 text-sm mt-8">
        <House size={16} />
        <span>/</span>
        <span>Category</span>
        {breadcrumbCategory && (
          <>
            <span>/</span>
            <span>{breadcrumbCategory}</span>
          </>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
        {/* Filtered Products */}
        <div className="min-w-60">
          <p
            onClick={toggleShowFilters}
            className="text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <span className="sm:hidden">
              {showFilters ? (
                <ChevronRight size={20} className="rotate-90" />
              ) : (
                <ChevronRight size={20} />
              )}
            </span>
          </p>

          <div
            className={`border-b border-t border-gray-300 pl-5 py-3 mt-6 ${showFilters ? "" : "hidden"
              } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">ALL CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-8">
              <p className="flex gap-2 text-primary">
                <input
                  className="w-3"
                  type="radio"
                  name="category"
                  value="all"
                  onChange={() => setCategory(null)}  // chọn All => reset lọc
                  checked={category === null}
                />
                All 
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Fresh Fruit"}
                  name="category"
                  onChange={() => toggleCategory("Fresh Fruit")}
                  checked={category === "Fresh Fruit"} // Đã controlled, sẽ tự check khi setCategory
                />
                Fresh Fruit
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Vegetables"}
                  name="category"
                  onChange={() => toggleCategory("Vegetables")}
                  checked={category === "Vegetables"}
                />
                Vegetables
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Cooking"}
                  name="category"
                  onChange={() => toggleCategory("Cooking")}
                  checked={category === "Cooking"}
                />
                Cooking
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Snacks"}
                  name="category"
                  onChange={() => toggleCategory("Snacks")}
                  checked={category === "Snacks"}
                />
                Snacks
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Beverages"}
                  name="category"
                  onChange={() => toggleCategory("Beverages")}
                  checked={category === "Beverages"}
                />
                Beverages
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Beauty & Health"}
                  name="category"
                  onChange={() => toggleCategory("Beauty & Health")}
                  checked={category === "Beauty & Health"}
                />
                Beauty & Health
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="radio"
                  value={"Bread & Bakery"}
                  name="category"
                  onChange={() => toggleCategory("Bread & Bakery")}
                  checked={category === "Bread & Bakery"}
                />
                Bread & Bakery
              </p>
            </div>
          </div>

          {/* Price Range */}
          <div
            className={`border-b border-t border-gray-300 pl-5 py-3 mt-6 ${showFilters ? "" : "hidden"
              } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 sm:w-[100px]  border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none"
                value={price.min}
                onChange={(e) =>
                  setPrice((p) => ({ ...p, min: e.target.value }))
                }
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 sm:w-[100px] border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none"
                value={price.max}
                onChange={(e) =>
                  setPrice((p) => ({ ...p, max: e.target.value }))
                }
              />
            </div>
            <button
              onClick={applyPrice}
              className="mt-4 rounded-md bg-green-500 w-full sm:w-[210px] px-4 py-2 text-sm text-white hover:bg-green-600"
            >
              Apply
            </button>
          </div>

          {/* Rating */}
          <div
            className={`border-b border-t border-gray-300 pl-5 py-3 mt-6 ${showFilters ? "" : "hidden"
              } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">RATING</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-8">
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"5"}
                  name="rating"
                  onChange={() => toggleRating(5)}
                  checked={ratings.has(5)}
                />
                {renderStars(5)}
                5.0
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"4"}
                  name="rating"
                  onChange={() => toggleRating(4)}
                  checked={ratings.has(4)}
                />
                {renderStars(4)} 4.0 & Up
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"3"}
                  name="rating"
                  onChange={() => toggleRating(3)}
                  checked={ratings.has(3)}
                />
                {renderStars(3)} 3.0 & Up
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"2"}
                  name="rating"
                  onChange={() => toggleRating(2)}
                  checked={ratings.has(2)}
                />
                {renderStars(2)} 2.0 & Up
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"1"}
                  name="rating"
                  onChange={() => toggleRating(1)}
                  checked={ratings.has(1)}
                />
                {renderStars(1)} 1.0 & Up
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-xl mb-4">
            <p>ALL PRODUCT</p>

            {/* product sort */}
            <select
              className="border-2 border-gray-6 text-sm px-2"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low">Sort by: Low to High</option>
              <option value="high">Sort by: High to Low</option>
            </select>
          </div>

          {/* product */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}