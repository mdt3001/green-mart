"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { assets } from "@/assets/assets";
import AdminUserDropdown from "./AdminUserDropdown";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-3 pr-12 py-3 border-b border-slate-200 transition-all">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu size={24} />
        </button>
        <Link
          href="/admin"
          className="relative text-4xl font-semibold text-slate-700"
        >
          <img
            src={assets.logo.src}
            alt="GreenMart"
            className="w-8 inline mr-2 mb-2"
          />
          <span className="text-gray-9">GreenMart</span>
          <p className="absolute text-xs font-semibold -top-1 -right-14 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
            Admin
          </p>
        </Link>
      </div>

      {/* Admin User Dropdown in Top Right */}
      <div className="flex items-center gap-4">
        <AdminUserDropdown />
      </div>
    </div>
  );
};

export default AdminNavbar;
