"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  User,
  Settings,
  ShoppingBag,
  Heart,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const UserDropdown = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Lấy thông tin từ props, không đọc localStorage
  const displayName = userInfo?.name || "Người dùng";
  const displayEmail = userInfo?.email || "";
  const displayAvatar = userInfo?.image || userInfo?.logo || null;

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
    setIsOpen(false);
    logout();
    window.location.href = "/";
  };

  const menuItems = [
    {
      icon: User,
      label: "Tài khoản của tôi",
      onClick: () => {
        router.push("/profile");
        setIsOpen(false);
      },
    },
    {
      icon: ShoppingBag,
      label: "Đơn hàng",
      onClick: () => {
        router.push("/orders");
        setIsOpen(false);
      },
    },
    // {
    //   icon: Heart,
    //   label: "Yêu thích",
    //   onClick: () => {
    //     router.push("/wishlist");
    //     setIsOpen(false);
    //   },
    // },
    {
      icon: LogOut,
      label: "Đăng xuất",
      onClick: handleLogout,
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={displayName}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-green-100 flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
          )}
        </div>

        {/* Name - chỉ hiển thị trên desktop */}
        <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[240px] truncate">
          {displayName}
        </span>

        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {displayEmail}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                    item.className || "text-gray-700"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
