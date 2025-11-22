"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
  Store,
} from "lucide-react";
import Link from "next/link";

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="hidden md:block text-sm font-medium max-w-[100px] truncate">
          {user?.name}
        </span>
        <ChevronDown
          size={16}
          className={`hidden md:block transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>Tài khoản của tôi</span>
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <Package size={16} />
              <span>Đơn hàng</span>
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={16} />
              <span>Yêu thích</span>
            </Link>

            {user?.role === "seller" && (
              <Link
                href="/seller/dashboard"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setIsOpen(false)}
              >
                <Store size={16} />
                <span>Quản lý cửa hàng</span>
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
