"use client";

import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Facebook,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import { useAuth } from "@/context/AuthContext";
import UserDropdown from "@/components/UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/lib/redux/features/category/categorySlice";
import { fetchCart } from "@/lib/redux/features/cart/cartSlice";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const cartCount = useSelector((state) => state.cart.total);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isFetchingSuggest, setIsFetchingSuggest] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Load cart sau khi đã đăng nhập (có user) để badge hiển thị ngay
  useEffect(() => {
    if (!loading && user) {
      dispatch(fetchCart());
    }
  }, [dispatch, loading, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search)}`);
      setIsSuggestOpen(false);
    }
  };

  // Gợi ý tìm kiếm từ backend khi user gõ
  useEffect(() => {
    let cancel = false;

    const fetchSuggestions = async () => {
      const q = search.trim();
      if (q.length < 2) {
        setSuggestions(null);
        setIsSuggestOpen(false);
        return;
      }
      try {
        setIsFetchingSuggest(true);
        const res = await axiosInstance.get(API_PATHS.PUBLIC.SEARCH_SUGGESTIONS, {
          params: { q },
        });
        if (cancel) return;
        setSuggestions(res.data?.data || null);
        setIsSuggestOpen(true);
      } catch (err) {
        if (cancel) return;
        setSuggestions(null);
        setIsSuggestOpen(false);
      } finally {
        if (!cancel) setIsFetchingSuggest(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 250); // debounce nhẹ
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [search]);

  // Khi rời trang shop, reset ô search
  useEffect(() => {
    if (!pathname.startsWith("/shop")) {
      setSearch("");
      setSuggestions(null);
      setIsSuggestOpen(false);
    }
  }, [pathname]);

  return (
    <nav className="relative bg-white shadow-sm z-50 ">
      <div>
        {/* TOP BAR */}
        <div className="">
          <div className="max-w-7xl mx-auto px-4 xl:px-0">
            <div className="flex items-center justify-between py-2 text-sm text-gray-600">
              {/* Left Links */}
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  href="/login/seller"
                  className="hover:text-green-600 transition flex items-center gap-1"
                >
                  Kênh người bán
                </Link>
                <span className="h-4 w-px bg-gray-300"></span>
                <Link
                  href="/register/seller"
                  className="hover:text-green-600 transition"
                >
                  Trở thành người bán
                </Link>
                <span className="h-4 w-px bg-gray-300 hidden sm:block"></span>

                <div className="hidden sm:flex items-center gap-2">
                  <span>Kết nối</span>
                  <Link
                    href="#"
                    className="hover:text-green-600 hover:border-green-600 transition border rounded-full p-1 "
                  >
                    <Facebook size={13} />
                  </Link>
                  <Link
                    href="#"
                    className="hover:text-green-600 hover:border-green-600 transition border rounded-full p-1"
                  >
                    <Instagram size={13} />
                  </Link>
                </div>
              </div>

              {/* Right Links */}
              <div className="flex items-center gap-4 sm:gap-6">
                <Link
                  href="/notifications"
                  className="hover:text-green-600 transition flex items-center gap-1"
                >
                  <Bell size={16} />
                  <span className="hidden sm:inline">Thông Báo</span>
                </Link>
                <Link
                  href="/help"
                  className="hover:text-green-600 transition flex items-center gap-1"
                >
                  <HelpCircle size={16} />
                  <span className="hidden sm:inline">Hỗ Trợ</span>
                </Link>

                {/* Auth Links */}
                {!loading && !user && (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/register/customer"
                      className="hover:text-green-600 transition font-medium"
                    >
                      Đăng Ký
                    </Link>
                    <span className="h-4 w-px bg-gray-300"></span>
                    <Link
                      href="/login/customer"
                      className="hover:text-green-600 transition font-medium"
                    >
                      Đăng Nhập
                    </Link>
                  </div>
                )}

                {!loading && user && (
                  <div className="hidden sm:block">
                    <UserDropdown userInfo={user} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-4 px-4 xl:px-0">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="relative text-4xl font-semibold text-slate-700"
            >
              <img
                src={assets.logo.src}
                alt="VietOrganic"
                className="w-8 inline mr-2 mb-2"
              />
              <span className="text-gray-9">GreenMart</span>
              {/* <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              plus
            </p> */}
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2.5  border border-gray-300 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-green-600 hover:bg-green-700 text-white px-6 rounded-md transition font-medium flex items-center gap-2"
                >
                  <Search size={18} />
                </button>

                {/* Suggestions dropdown */}
                {isSuggestOpen && suggestions && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-72 overflow-y-auto text-sm">
                    {isFetchingSuggest && (
                      <div className="px-4 py-2 text-gray-500">Đang tải...</div>
                    )}

                    {!isFetchingSuggest && (
                      <>
                        {/* Sản phẩm */}
                        {suggestions.products?.length > 0 && (
                          <div className="border-b border-gray-100">
                            <p className="px-4 pt-2 pb-1 text-[11px] font-semibold text-gray-500 uppercase">
                              Sản phẩm
                            </p>
                            {suggestions.products.map((name) => (
                              <button
                                key={`p-${name}`}
                                type="button"
                                className="w-full text-left px-4 py-1.5 hover:bg-gray-50"
                                onClick={() => {
                                  router.push(`/shop?search=${encodeURIComponent(name)}`);
                                  setIsSuggestOpen(false);
                                }}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Category */}
                        {suggestions.categories?.length > 0 && (
                          <div className="border-b border-gray-100">
                            <p className="px-4 pt-2 pb-1 text-[11px] font-semibold text-gray-500 uppercase">
                              Danh mục
                            </p>
                            {suggestions.categories.map((name) => (
                              <button
                                key={`c-${name}`}
                                type="button"
                                className="w-full text-left px-4 py-1.5 hover:bg-gray-50"
                                onClick={() => {
                                  router.push(`/shop?search=${encodeURIComponent(name)}`);
                                  setIsSuggestOpen(false);
                                }}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Store */}
                        {suggestions.stores?.length > 0 && (
                          <div>
                            <p className="px-4 pt-2 pb-1 text-[11px] font-semibold text-gray-500 uppercase">
                              Cửa hàng
                            </p>
                            {suggestions.stores.map((name) => (
                              <button
                                key={`s-${name}`}
                                type="button"
                                className="w-full text-left px-4 py-1.5 hover:bg-gray-50"
                                onClick={() => {
                                  router.push(`/shop?search=${encodeURIComponent(name)}`);
                                  setIsSuggestOpen(false);
                                }}
                              >
                                {name}
                              </button>
                            ))}
                          </div>
                        )}

                        {(!suggestions.products?.length &&
                          !suggestions.categories?.length &&
                          !suggestions.stores?.length) && (
                            <div className="px-4 py-2 text-gray-500">
                              Không có gợi ý phù hợp.
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center gap-4 sm:gap-6 text-gray-700">
              <Link
                href="/wishlist"
                className="relative hover:text-green-600 transition group"
              >
                <Heart
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
              </Link>

              <span className="h-8 w-px bg-gray-200 hidden sm:block"></span>

              <Link
                href="/cart"
                className="relative hover:text-green-600 transition group"
              >
                <ShoppingCart
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-red-500 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="sm:hidden">
                {!loading && user && <UserDropdown />}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 xl:px-0">
            <div className="flex items-center gap-8 h-12">
              <Link
                href="/"
                className={`flex items-center gap-2 hover:text-green-400 transition h-full font-medium ${pathname === "/" ? "text-green-400" : ""
                  }`}
              >
                Trang chủ
              </Link>

              <div className="group relative h-full flex items-center">
                <button
                  className={`flex items-center gap-1 hover:text-green-400 transition font-medium ${pathname.includes("/shop") ? "text-green-400" : ""
                    }`}
                >
                  Sản phẩm
                  <ChevronDown size={16} />
                </button>

                <div className="absolute top-full left-0 w-64 bg-white text-gray-800 shadow-xl rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-2 border-green-500">
                  <ul className="py-2 text-sm">
                    {categories.map((cat) => (
                      <li key={cat.id} className="group/sub relative">
                        <div className="flex justify-between items-center px-4 py-2.5 hover:bg-green-50 hover:text-green-600 cursor-pointer transition-colors">
                          <Link
                            href={`/shop?category=${cat.id}`}
                            className="flex-1"
                          >
                            {cat.name}
                          </Link>

                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/about"
                className={`hover:text-green-400 transition font-medium ${pathname === "/about" ? "text-green-400" : ""
                  }`}
              >
                Về chúng tôi
              </Link>
              <Link
                href="/contact"
                className={`hover:text-green-400 transition font-medium ${pathname === "/contact" ? "text-green-400" : ""
                  }`}
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
