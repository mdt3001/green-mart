"use client";

import {
  Search,
  ShoppingCart,
  Heart,
  Package,
  Bell,
  HelpCircle,
  PackageIcon,
  Globe,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { assets } from "@/assets/assets";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserDropdown } from "@/components/UserDropdown";

const Navbar = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);
  const pathname = usePathname();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div>
        <div>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between py-2 text-sm text-gray-7">
              {/* Left Links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/login/seller"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  Kênh người bán
                </Link>
                <span className="h-4 w-px bg-black"></span>
                <Link
                  href="/register/seller"
                  className="hover:text-primary transition"
                >
                  Trở thành người bán 
                </Link>
                <span className="h-4 w-px bg-black"></span>

                <div className="flex items-center gap-2">
                  <span>Kết nối</span>
                  <Link href="#" className="hover:text-primary transition">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                  <Link href="#" className="hover:text-primary transition">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/notifications"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <Bell size={16} />
                  Thông Báo
                </Link>
                <Link
                  href="/help"
                  className="hover:text-primary transition flex items-center gap-1"
                >
                  <HelpCircle size={16} />
                  Hỗ Trợ
                </Link>

                {/* Auth Links */}
                {!loading && !user && (
                  <>
                    <Link
                      href="/register/customer"
                      className="hover:text-primary transition"
                    >
                      Đăng Ký
                    </Link>
                    <span className="h-4 w-px bg-black"></span>
                    <Link
                      href="/login/customer"
                      className="hover:text-primary transition"
                    >
                      Đăng Nhập
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* <hr className="border-gray-300" /> */}

        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 pr-28 border border-gray-300 rounded-lg outline-none focus:border-green-500 transition"
              />
              <button
                type="submit"
                className="absolute right-0 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-r-lg transition font-medium"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-gray-7">
            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                href="/wishlist"
                className="relative flex items-center text-gray-7 transition"
              >
                <Heart size={18} className="hover:text-primary transition" />
              </Link>

              <span className="h-6 w-px bg-black"></span>

              <Link
                href="/cart"
                className="relative flex items-center text-gray-7"
              >
                <ShoppingCart
                  className="hover:text-primary transition"
                  size={18}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-3 text-[8px] text-white bg-primary-hard size-3.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Auth Section */}
            {!loading && (
              <>
                {!user ? (
                  <Link href="/login">
                    <button className="btn btn-fill btn-md">Login</button>
                  </Link>
                ) : (
                  <UserDropdown />
                )}
              </>
            )}
          </div>

          {/* Mobile User Button */}
          <div className="sm:hidden">
            {!loading && (
              <>
                {!user ? (
                  <Link href="/login/customer">
                    <button className="btn btn-fill btn-md">Login</button>
                  </Link>
                ) : (
                  <UserDropdown />
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto ">
            <div className="flex items-center gap-8 py-3">
              {/* Categories Dropdown */}
              <button className="flex items-center gap-2 hover:text-green-400 transition">
                <span className="font-medium">Trang chủ</span>
                <ChevronDown size={16} />
              </button>

              {/* Menu Links */}
              <Link
                href="/shop"
                className={`hover:text-green-400 transition ${
                  pathname === "/shop" ? "text-green-400" : ""
                }`}
              >
                Cửa hàng
              </Link>
              <Link
                href="/about"
                className={`hover:text-green-400 transition ${
                  pathname === "/about" ? "text-green-400" : ""
                }`}
              >
                Về chúng tôi
              </Link>
              <Link
                href="/contact"
                className={`hover:text-green-400 transition ${
                  pathname === "/contact" ? "text-green-400" : ""
                }`}
              >
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
