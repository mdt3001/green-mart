"use client";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";
import StoreUserDropdown from "./StoreUserDropdown";

const StoreNavbar = ({ storeInfo }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
          <Link href="/store" className="text-2xl font-bold text-green-600">
            GreenMart <span className="text-slate-800">Seller</span>
          </Link>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg">
            <Bell size={22} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Dropdown */}
          <StoreUserDropdown storeInfo={storeInfo} />
        </div>
      </div>
    </nav>
  );
};

export default StoreNavbar;
