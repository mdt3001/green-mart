"use client";
import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getNotificationIcon,
} from "@/components/NotificationDropdown";

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login/customer");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Get initial notifications
    setNotifications(getNotifications());

    // Subscribe to updates
    const unsubscribe = subscribeToNotifications(setNotifications);

    return unsubscribe;
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Bell size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Không có thông báo mới"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-t pt-4">
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "Tất cả" : f === "unread" ? "Chưa đọc" : "Đã đọc"}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không có thông báo nào</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const IconComponent = getNotificationIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md ${
                    !notif.isRead ? "border-l-4 border-green-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-full ${
                        !notif.isRead ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <IconComponent
                        size={20}
                        className={!notif.isRead ? "text-green-600" : "text-gray-500"}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <Link href={notif.link}>
                        <h3
                          className={`font-semibold mb-1 hover:text-green-600 transition-colors ${
                            !notif.isRead ? "text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {notif.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-400">{notif.time}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Đánh dấu đã đọc"
                        >
                          <Check
                            size={18}
                            className="text-gray-400 group-hover:text-green-600"
                          />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Xóa"
                      >
                        <Trash2
                          size={18}
                          className="text-gray-400 group-hover:text-red-600"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
