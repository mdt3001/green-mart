"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Package, Truck, ShoppingBag, Star, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Shared notifications state
let sharedNotifications = [];
let notificationListeners = [];

export const getNotifications = () => sharedNotifications;

export const setNotifications = (newNotifications) => {
  sharedNotifications = newNotifications;
  notificationListeners.forEach((listener) => listener(newNotifications));
};

export const subscribeToNotifications = (listener) => {
  notificationListeners.push(listener);
  return () => {
    notificationListeners = notificationListeners.filter((l) => l !== listener);
  };
};

export const markNotificationAsRead = (id) => {
  const updated = sharedNotifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
  setNotifications(updated);
};

export const markAllNotificationsAsRead = () => {
  const updated = sharedNotifications.map((n) => ({ ...n, isRead: true }));
  setNotifications(updated);
};

export const deleteNotification = (id) => {
  const updated = sharedNotifications.filter((n) => n.id !== id);
  setNotifications(updated);
};

// Icon mapping helper
export const getNotificationIcon = (type) => {
  const iconMap = {
    order: Package,
    shipping: Truck,
    promotion: ShoppingBag,
    review: Star,
  };
  return iconMap[type] || Package;
};

const NotificationDropdown = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setLocalNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Don't show notification button if not logged in
  if (!loading && !user) {
    return null;
  }

  useEffect(() => {
    // Initialize with shared state
    setLocalNotifications(sharedNotifications);

    // Subscribe to updates
    const unsubscribe = subscribeToNotifications(setLocalNotifications);

    // Fetch from API if empty
    if (sharedNotifications.length === 0) {
      // TODO: Replace with actual API call
      const mockNotifications = [
        {
          id: 1,
          type: "order",
          title: "Đơn hàng đã được xác nhận",
          message: "Đơn hàng #ORD001 đã được xác nhận và đang được chuẩn bị",
          time: "5 phút trước",
          isRead: false,
          link: "/profile/orders",
        },
        {
          id: 2,
          type: "shipping",
          title: "Đơn hàng đang được giao",
          message: "Đơn hàng #ORD002 đang trên đường giao đến bạn",
          time: "2 giờ trước",
          isRead: false,
          link: "/profile/orders",
        },
        {
          id: 3,
          type: "promotion",
          title: "Giảm giá 20% cho đơn hàng tiếp theo",
          message: "Sử dụng mã SAVE20 để nhận ưu đãi đặc biệt",
          time: "1 ngày trước",
          isRead: false,
          link: "/shop",
        },
        {
          id: 4,
          type: "review",
          title: "Đánh giá sản phẩm của bạn",
          message: "Hãy chia sẻ trải nghiệm về sản phẩm Cà chua bi",
          time: "2 ngày trước",
          isRead: false,
          link: "/profile/orders",
        },
        {
          id: 5,
          type: "order",
          title: "Đơn hàng đã giao thành công",
          message: "Đơn hàng #ORD003 đã được giao thành công",
          time: "3 ngày trước",
          isRead: false,
          link: "/profile/orders",
        },
      ];
      setNotifications(mockNotifications);
    }

    return unsubscribe;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const displayNotifications = unreadNotifications;
  const unreadCount = unreadNotifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-green-600 transition flex items-center gap-1"
      >
        <div className="relative">
          {unreadCount > 0 && (
            <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center z-10">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <Bell size={16} />
        </div>
        <span className="hidden sm:inline">Thông Báo</span>
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              Trang thông báo
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Không có thông báo mới</p>
              </div>
            ) : (
              displayNotifications.map((notif) => {
                const IconComponent = getNotificationIcon(notif.type);
                return (
                  <div
                    key={notif.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-4 flex items-start gap-3">
                      {/* Icon */}
                      <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                        <IconComponent size={18} className="text-green-600" />
                      </div>

                      {/* Content */}
                      <Link
                        href={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="flex-1 min-w-0"
                      >
                        <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-1 hover:text-green-600">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400">{notif.time}</p>
                      </Link>

                      {/* Mark as Read Button */}
                      {!notif.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(notif.id);
                          }}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                          title="Đánh dấu đã đọc"
                        >
                          <Check size={16} className="text-gray-400 hover:text-green-600" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
