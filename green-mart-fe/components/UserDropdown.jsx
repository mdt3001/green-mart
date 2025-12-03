"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogOut, User, Settings, Store, ChevronDown } from "lucide-react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const UserDropdown = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);

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
    setTimeout(() => {
      window.location.replace("/login/seller");
    }, 0);
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => {
        router.push("/profile");
        setIsOpen(false);
      },
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: handleLogout,
      className: "text-red-600 hover:bg-red-50",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className="relative w-10 h-10 rounded-full shadow-md overflow-hidden">
          {userInfo?.logo ? (
            <Image
              src={userInfo.logo}
              alt={userInfo.name || "user Logo"}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>

        <div className="hidden lg:block text-left">
          <p className="text-sm font-semibold text-slate-800">
            {userInfo?.name || "user Name"}
          </p>
          <p className="text-xs text-slate-500">
            {userInfo?.email || userInfo?.user?.email || user?.email}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
          {/* user Info Header */}
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-800">
              {userInfo?.name || "user Name"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {userInfo?.email || user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                    item.className || "text-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
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
