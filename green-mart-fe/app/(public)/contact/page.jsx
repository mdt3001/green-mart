"use client";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi form đến API
    toast.success("Đã gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Hotline",
      content: "1900-xxxx",
      subContent: "Thứ 2 - Chủ nhật: 8:00 - 22:00",
      color: "bg-blue-100 text-blue-600",
      link: "tel:1900xxxx",
    },
    {
      icon: Mail,
      title: "Email",
      content: "support@greenmart.com",
      subContent: "Phản hồi trong 24h",
      color: "bg-green-100 text-green-600",
      link: "mailto:support@greenmart.com",
    },
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "227 Nguyễn Văn Cừ, Phường 4",
      subContent: "Quận 5, TP.HCM",
      color: "bg-red-100 text-red-600",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Chủ nhật",
      subContent: "8:00 - 22:00",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <MessageCircle size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-green-50">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const Component = info.link ? "a" : "div";
            return (
              <Component
                key={index}
                href={info.link}
                target={info.link?.startsWith("http") ? "_blank" : undefined}
                rel={info.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-lg ${info.color} mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-gray-700 font-medium mb-1">{info.content}</p>
                <p className="text-sm text-gray-500">{info.subContent}</p>
              </Component>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Chủ đề tin nhắn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Gửi tin nhắn
              </button>
            </form>
          </div>

          {/* Map & Social */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Vị trí của chúng tôi
              </h3>
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9544221364097!2d106.68086187570755!3d10.738002959890937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fac48f81f8d%3A0x8d6f2f9d8c9e7c2a!2zMjI3IE5ndXnhu4VuIFbEg24gQ-G7qywgUGjGsOG7nW5nIDQsIFF1YW4gNSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1702000000000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Kết nối với chúng tôi
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Facebook size={24} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition-colors"
                >
                  <Twitter size={24} />
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Theo dõi chúng tôi để cập nhật tin tức và ưu đãi mới nhất!
              </p>
            </div>

            {/* Quick Support */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-sm p-8 text-white">
              <h3 className="text-xl font-bold mb-2">Cần hỗ trợ ngay?</h3>
              <p className="text-green-50 mb-4">
                Chat trực tiếp với đội ngũ hỗ trợ của chúng tôi
              </p>
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Bắt đầu chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
