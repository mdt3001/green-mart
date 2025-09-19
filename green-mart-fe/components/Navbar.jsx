"use client";
import { Search, ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { assets } from "@/assets/assets";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const cartCount = useSelector((state) => state.cart.total);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/shop?search=${search}`);
  };

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <img
              src={assets.logo.src}
              alt="VietOrganic"
              className="w-8 inline mr-2 mb-2"
            />
            <span className="text-gray-9">GReen</span>
            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
              plus
            </p>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-gray-7 ">
            <Link
              className={`hover:text-primary transition ${
                pathname === "/" ? "text-primary" : ""
              }`}
              href="/"
            >
              Home
            </Link>
            <Link
              className={`hover:text-primary transition ${
                pathname === "/shop" ? "text-primary" : ""
              }`}
              href="/shop"
            >
              Shop
            </Link>
            <Link
              className={`hover:text-primary transition ${
                pathname === "/about" ? "text-primary" : ""
              }`}
              href="/about"
            >
              About
            </Link>
            <Link
              className={`hover:text-primary transition ${
                pathname === "/contact" ? "text-primary" : ""
              }`}
              href="/contact"
            >
              Contact
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full"
            >
              <Search size={18} className="text-slate-600" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-600"
                type="text"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                required
              />
            </form>

            <div className="flex items-center gap-2 lg:gap-4">
              <Link
                href="/wishlist"
                className="relative flex items-center text-gray-7  transition"
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
                <button className="absolute -top-1 left-3 text-[8px] text-white bg-primary-hard size-3.5 rounded-full">
                  {cartCount}
                </button>
              </Link>
            </div>

            <button className="btn btn-fill btn-md">Login</button>
          </div>

          {/* Mobile User Button  */}
          <div className="sm:hidden">
            <button className="btn btn-fill btn-md">Login</button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
