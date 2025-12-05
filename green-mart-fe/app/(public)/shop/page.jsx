"use client";
import { Suspense, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import { ChevronRight, StarIcon, House, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "@/lib/redux/features/product/productSlice";
import { fetchCategories } from "@/lib/redux/features/category/categorySlice";

function ShopContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const categoryParam = searchParams.get("category");
  // Lấy ID category cha từ URL
  const parentCategoryId = categoryParam ? Number(categoryParam) : null;

  const router = useRouter();
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const toggleShowFilters = () => setShowFilters((prev) => !prev);

  // Filter state
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [ratings, setRatings] = useState(new Set());
  const [price, setPrice] = useState({ min: "", max: "" });
  const [appliedPrice, setAppliedPrice] = useState({ min: 0, max: Infinity });
  const [sort, setSort] = useState("relevant");

  // Redux Data
  const products = useSelector((state) => state.product.products) || [];
  const pagination = useSelector((state) => state.product.pagination) || {};
  const currentCategory = useSelector((state) => state.product.currentCategory);
  const loading = useSelector((state) => state.product.loading);
  const categories = useSelector((state) => state.category.categories) || [];

  // Load categories
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [categories.length, dispatch]);

  // Logic xác định danh sách Category hiển thị
  const parentCategory =
    parentCategoryId != null
      ? categories.find((c) => c.id === parentCategoryId)
      : null;
  const childCategories = parentCategory?.children || [];

  // Nếu có parent -> dùng childCategories. Nếu không -> dùng categories (root)
  const displayCategories =
    parentCategory && childCategories.length > 0 ? childCategories : categories;

  // Xử lý logic filters
  const toggleRating = (value) => {
    setRatings((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const applyPrice = () => {
    setAppliedPrice({
      min: Number(price.min) || 0,
      max: Number(price.max) || Infinity,
    });
  };

  const handleSortChange = (e) => setSort(e.target.value);

  // Check trạng thái filter để hiển thị nút xóa
  const hasActiveFilters =
    !!search ||
    appliedPrice.min > 0 ||
    (appliedPrice.max !== Infinity && appliedPrice.max > 0) ||
    !!selectedCategoryId ||
    sort !== "relevant" ||
    ratings.size > 0;

  const isFilteredBackend =
    !!search ||
    appliedPrice.min > 0 ||
    (appliedPrice.max !== Infinity && appliedPrice.max > 0) ||
    !!selectedCategoryId ||
    sort !== "relevant";

  const clearAllFilters = () => {
    setSelectedCategoryId(null);
    setPrice({ min: "", max: "" });
    setAppliedPrice({ min: 0, max: Infinity });
    setRatings(new Set());
    setSort("relevant");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [search, parentCategoryId, selectedCategoryId, appliedPrice.min, appliedPrice.max, sort]);

  // Fetch data
  useEffect(() => {
    // 1. Không có category cha -> Fetch All Products
    if (!parentCategoryId) {
      const params = { page };
      if (search) params.search = search;
      if (selectedCategoryId) params.category_id = selectedCategoryId;
      if (appliedPrice.min > 0) params.min_price = appliedPrice.min;
      if (appliedPrice.max !== Infinity && appliedPrice.max > 0) params.max_price = appliedPrice.max;

      if (sort === "low") { params.sort_by = "price"; params.sort_order = "asc"; }
      else if (sort === "high") { params.sort_by = "price"; params.sort_order = "desc"; }
      else { params.sort_by = "created_at"; params.sort_order = "desc"; }

      dispatch(fetchProducts(params));
      return;
    }

    // 2. Có category cha
    if (!isFilteredBackend) {
      dispatch(fetchProductsByCategory({ categoryId: parentCategoryId, page }));
    } else {
      const params = { page };
      if (search) params.search = search;
      if (selectedCategoryId) params.category_id = selectedCategoryId;
      else params.parent_category_id = parentCategoryId;

      if (appliedPrice.min > 0) params.min_price = appliedPrice.min;
      if (appliedPrice.max !== Infinity && appliedPrice.max > 0) params.max_price = appliedPrice.max;

      if (sort === "low") { params.sort_by = "price"; params.sort_order = "asc"; }
      else if (sort === "high") { params.sort_by = "price"; params.sort_order = "desc"; }
      else { params.sort_by = "created_at"; params.sort_order = "desc"; }

      dispatch(fetchProducts(params));
    }
  }, [dispatch, parentCategoryId, search, selectedCategoryId, appliedPrice.min, appliedPrice.max, sort, isFilteredBackend, page]);

  // Filter Rating (Frontend)
  const getAverageRating = (p) => {
    const arr = Array.isArray(p?.rating) ? p.rating : [];
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, cur) => acc + (Number(cur?.rating) || 0), 0);
    return sum / arr.length;
  };

  const renderStars = (rating) => {
    return Array(5).fill("").map((_, index) => (
      <StarIcon key={index} size={14} className="text-transparent mt-0.5" fill={rating >= index + 1 ? "var(--color-warning)" : "#D1D5DB"} />
    ));
  };

  const sortedProducts = products.filter((p) => {
    if (ratings.size === 0) return true;
    const avg = getAverageRating(p);
    return Array.from(ratings).some((r) => avg >= r);
  });

  const breadcrumbCategory = currentCategory?.name || parentCategory?.name || "";

  // Hàm chuyển hướng khi click vào Root Category
  const handleRootCategoryClick = (id) => {
    // Reset các filter khác để trải nghiệm tốt hơn
    clearAllFilters();
    router.push(`/shop?category=${id}`);
  };

  return (
    <div className="min-h-[70vh] mx-6 max-w-7xl sm:mx-auto mb-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mt-8">
        <div className="flex items-center cursor-pointer hover:text-black" onClick={() => router.push("/")}>
          <House size={16} />
        </div>
        <span>/</span>
        <span
          className={`cursor-pointer ${!breadcrumbCategory ? 'font-bold text-black' : 'hover:text-black'}`}
          onClick={() => router.push("/shop")}
        >
          Sản phẩm
        </span>
        {breadcrumbCategory && (
          <>
            <span>/</span>
            <span className="font-bold text-black">{breadcrumbCategory}</span>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
        {/* Left Sidebar */}
        <div className="min-w-60">
          <div className="flex flex-col gap-2">
            <p onClick={toggleShowFilters} className="text-xl flex items-center cursor-pointer gap-2 font-bold text-gray-700">
              BỘ LỌC
              <span className="sm:hidden">
                <ChevronRight size={20} className={showFilters ? "rotate-90" : ""} />
              </span>
            </p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="hidden sm:flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors w-fit">
                <RotateCcw size={14} /> Xóa tất cả
              </button>
            )}
          </div>

          {/* --- CATEGORY SECTION (ĐÃ SỬA ĐỔI) --- */}
          <div className={`border-b border-t border-gray-300 pl-5 py-3 mt-4 ${showFilters ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium uppercase text-gray-700">DANH MỤC</p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {displayCategories.map((cat) => {
                // LOGIC QUAN TRỌNG Ở ĐÂY:
                // Nếu KHÔNG có parentCategoryId (đang ở trang Shop chính) -> Render Link
                if (!parentCategoryId) {
                  return (
                    <p
                      key={cat.id}
                      onClick={() => handleRootCategoryClick(cat.id)}
                      className="cursor-pointer hover:text-black hover:underline hover:decoration-1 underline-offset-4 transition-all py-0.5"
                    >
                      {cat.name}
                    </p>
                  );
                }
                // Nếu ĐANG CÓ parentCategoryId (đang ở trong 1 category) -> Render Checkbox
                else {
                  return (
                    <label key={cat.id} className="flex gap-2 items-center cursor-pointer hover:text-black">
                      <input
                        className="w-3.5 h-3.5 accent-black"
                        type="checkbox"
                        checked={selectedCategoryId === cat.id}
                        onChange={() => setSelectedCategoryId((prev) => (prev === cat.id ? null : cat.id))}
                      />
                      {cat.name}
                    </label>
                  );
                }
              })}

              {!displayCategories.length && (
                <p className="text-xs text-gray-500">Chưa có danh mục.</p>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className={`border-b border-t border-gray-300 pl-5 py-3 mt-6 ${showFilters ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium uppercase text-gray-700">Khoảng giá</p>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Từ" className="w-1/2 sm:w-[100px] border border-gray-300 rounded-l-md p-2 text-sm focus:outline-none focus:border-black"
                value={price.min} onChange={(e) => setPrice((p) => ({ ...p, min: e.target.value }))} />
              <input type="number" placeholder="Đến" className="w-1/2 sm:w-[100px] border border-gray-300 rounded-r-md p-2 text-sm focus:outline-none focus:border-black"
                value={price.max} onChange={(e) => setPrice((p) => ({ ...p, max: e.target.value }))} />
            </div>
            <button onClick={applyPrice} className="mt-4 rounded-md bg-black w-full sm:w-[210px] px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors">
              Áp dụng
            </button>
          </div>

          {/* Rating */}
          <div className={`border-b border-t border-gray-300 pl-5 py-3 mt-6 ${showFilters ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium uppercase text-gray-700">Đánh giá</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-8">
              {[5, 4, 3, 2, 1].map((r) => (
                <p key={r} className="flex gap-2 items-center">
                  <input className="w-3.5 h-3.5 accent-black" type="checkbox" value={r} onChange={() => toggleRating(r)} checked={ratings.has(r)} />
                  {renderStars(r)} {r === 5 ? "5.0" : `từ ${r}.0`}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex-1">
          <div className="flex justify-between items-center text-base sm:text-xl mb-4">
            <p className="font-semibold text-gray-700">
              {parentCategory ? parentCategory.name : "TẤT CẢ SẢN PHẨM"}
            </p>
            <select className="border border-gray-300 rounded text-sm px-2 py-1 outline-none" value={sort} onChange={handleSortChange}>
              <option value="relevant">Sắp xếp: Liên quan</option>
              <option value="low">Giá: Thấp đến Cao</option>
              <option value="high">Giá: Cao đến Thấp</option>
            </select>
          </div>

          {loading ? (
            <div className="py-10">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </div>
              )}
            </div>
          )}

          {/* Pagination UI */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className={`px-3 py-1 border rounded ${page <= 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>Trước</button>
              <span className="text-sm text-gray-600">Trang {pagination.current_page || page} / {pagination.last_page}</span>
              <button onClick={() => setPage((p) => Math.min(pagination.last_page || p + 1, (pagination.last_page || p + 1)))} disabled={(pagination.current_page || page) >= pagination.last_page} className={`px-3 py-1 border rounded ${(pagination.current_page || page) >= pagination.last_page ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}>Sau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopContent />
    </Suspense>
  );
}