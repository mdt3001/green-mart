"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";

const StoreSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Bảng điều khiển",
      href: "/store",
      icon: LayoutDashboard,
    },
    {
      name: "Sản phẩm",
      href: "/store/manage-product",
      icon: Package,
    },
    {
      name: "Đơn hàng",
      href: "/store/orders",
      icon: ShoppingCart,
    },
    {
      name: "Mã giảm giá",
      href: "/store/coupons",
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

export default StoreSidebar;
