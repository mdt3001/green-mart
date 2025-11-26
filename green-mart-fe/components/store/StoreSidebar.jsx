"use client";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutListIcon,
  SquarePenIcon,
  SquarePlusIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

const StoreSidebar = ({ storeInfo }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Bảng điều khiển", href: "/store", icon: HomeIcon },
    { name: "Tạo sản phẩm", href: "/store/add-product", icon: SquarePlusIcon },
    {
      name: "Quản lý sản phẩm",
      href: "/store/manage-product",
      icon: SquarePenIcon,
    },
    { name: "Đơn hàng", href: "/store/orders", icon: LayoutListIcon },
  ];

  return (
    <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60">
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <div className="relative w-14 h-14 rounded-full shadow-md overflow-hidden">
          <Image
            className="object-cover"
            src={storeInfo?.logo || assets.gs_logo}
            alt="Store Logo"
            fill
            sizes="56px"
          />
        </div>
        <p className="text-slate-700 font-medium px-2 text-center">
          {storeInfo?.name || "Store"}
        </p>
      </div>

      <div className="max-sm:mt-6">
        {sidebarLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`relative flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-2.5 transition ${
              pathname === link.href && "bg-slate-100 sm:text-slate-600"
            }`}
          >
            <link.icon size={18} className="sm:ml-5" />
            <p className="max-sm:hidden">{link.name}</p>
            {pathname === link.href && (
              <span className="absolute bg-green-500 right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoreSidebar;
