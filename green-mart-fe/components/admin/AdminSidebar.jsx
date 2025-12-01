"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  ShieldCheck,
  Tag,
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Bảng điều khiển",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Cửa hàng",
      href: "/admin/stores",
      icon: Store,
    },
    {
      name: "Phê duyệt cửa hàng",
      href: "/admin/approve",
      icon: ShieldCheck,
    },
    {
      name: "Mã giảm giá",
      href: "/admin/coupons",
      icon: Tag,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-600 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;