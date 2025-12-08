"use client";
import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  RefreshCw,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      icon: ShoppingCart,
      title: "Đặt hàng",
      description: "Hướng dẫn đặt hàng và thanh toán",
      color: "bg-blue-100 text-blue-600",
      guide: {
        steps: [
          {
            title: "Bước 1: Tìm kiếm sản phẩm",
            content: "Sử dụng thanh tìm kiếm hoặc duyệt danh mục để tìm sản phẩm bạn muốn mua.",
          },
          {
            title: "Bước 2: Thêm vào giỏ hàng",
            content: "Click vào sản phẩm, chọn số lượng và nhấn 'Thêm vào giỏ hàng'.",
          },
          {
            title: "Bước 3: Kiểm tra giỏ hàng",
            content: "Click vào icon giỏ hàng để xem lại sản phẩm đã chọn, điều chỉnh số lượng nếu cần.",
          },
          {
            title: "Bước 4: Thanh toán",
            content: "Nhấn 'Thanh toán', điền đầy đủ thông tin giao hàng (họ tên, số điện thoại, địa chỉ).",
          },
          {
            title: "Bước 5: Chọn phương thức thanh toán",
            content: "Chọn COD, Chuyển khoản, hoặc Ví điện tử. Xác nhận và hoàn tất đơn hàng.",
          },
        ],
      },
    },
    {
      icon: Package,
      title: "Đơn hàng của tôi",
      description: "Theo dõi và quản lý đơn hàng",
      color: "bg-green-100 text-green-600",
      guide: {
        steps: [
          {
            title: "Xem danh sách đơn hàng",
            content: "Vào 'Tài khoản của tôi' → 'Đơn hàng của tôi' để xem tất cả đơn hàng đã đặt.",
          },
          {
            title: "Theo dõi trạng thái",
            content: "Mỗi đơn hàng hiển thị trạng thái: Chờ xác nhận, Đã xác nhận, Đang giao, Đã giao, Đã hủy.",
          },
          {
            title: "Xem chi tiết đơn hàng",
            content: "Click vào mã đơn hàng để xem chi tiết sản phẩm, giá, phí vận chuyển, và thông tin giao hàng.",
          },
          {
            title: "Hủy đơn hàng",
            content: "Chỉ hủy được khi đơn hàng ở trạng thái 'Chờ xác nhận'. Click 'Hủy đơn' và xác nhận.",
          },
          {
            title: "Liên hệ hỗ trợ",
            content: "Nếu gặp vấn đề với đơn hàng, liên hệ Hotline 1900-xxxx hoặc chat trực tuyến.",
          },
        ],
      },
    },
    {
      icon: Truck,
      title: "Vận chuyển",
      description: "Thông tin giao hàng và phí ship",
      color: "bg-orange-100 text-orange-600",
      guide: {
        steps: [
          {
            title: "Phí vận chuyển",
            content: "Phí ship từ 15.000đ - 50.000đ tùy khu vực. MIỄN PHÍ vận chuyển cho đơn hàng trên 500.000đ.",
          },
          {
            title: "Thời gian giao hàng",
            content: "Nội thành: 2-3 ngày làm việc. Ngoại thành: 4-5 ngày. Tỉnh xa: 5-7 ngày làm việc.",
          },
          {
            title: "Theo dõi đơn hàng",
            content: "Nhận mã vận đơn qua SMS/Email. Tra cứu trạng thái giao hàng trong 'Đơn hàng của tôi'.",
          },
          {
            title: "Nhận hàng",
            content: "Kiểm tra sản phẩm trước khi thanh toán (với COD). Ký xác nhận đã nhận hàng.",
          },
          {
            title: "Giao hàng không thành công",
            content: "Shipper sẽ gọi 2 lần. Nếu không liên lạc được, đơn hàng sẽ được hoàn về kho.",
          },
        ],
      },
    },
    {
      icon: CreditCard,
      title: "Thanh toán",
      description: "Phương thức thanh toán",
      color: "bg-purple-100 text-purple-600",
      guide: {
        steps: [
          {
            title: "COD (Thanh toán khi nhận hàng)",
            content: "Thanh toán bằng tiền mặt cho shipper khi nhận hàng. Phí COD: 0đ - 20.000đ tùy đơn hàng.",
          },
          {
            title: "Chuyển khoản ngân hàng",
            content: "Chuyển khoản đến STK được cung cấp sau khi đặt hàng. Ghi rõ mã đơn hàng khi chuyển.",
          },
          {
            title: "Ví điện tử (MoMo, ZaloPay)",
            content: "Quét mã QR hoặc nhập số điện thoại ví để thanh toán nhanh chóng, an toàn.",
          },
          {
            title: "Thẻ ATM/Credit Card",
            content: "Thanh toán qua cổng thanh toán an toàn. Hỗ trợ các loại thẻ Visa, Mastercard, JCB.",
          },
          {
            title: "Bảo mật thanh toán",
            content: "Thông tin thẻ được mã hóa SSL. Green Mart không lưu trữ thông tin thanh toán của bạn.",
          },
        ],
      },
    },
    {
      icon: RefreshCw,
      title: "Đổi trả",
      description: "Chính sách đổi trả hàng",
      color: "bg-red-100 text-red-600",
      guide: {
        steps: [
          {
            title: "Điều kiện đổi trả",
            content: "Sản phẩm lỗi, hỏng, không đúng mô tả, hoặc sai hàng. Còn nguyên tem mác, chưa qua sử dụng.",
          },
          {
            title: "Thời gian đổi trả",
            content: "Trong vòng 7 ngày kể từ ngày nhận hàng. Quá thời hạn sẽ không được chấp nhận.",
          },
          {
            title: "Quy trình đổi trả",
            content: "Liên hệ Hotline 1900-xxxx → Cung cấp mã đơn hàng, hình ảnh sản phẩm → Chờ xác nhận.",
          },
          {
            title: "Phí vận chuyển đổi trả",
            content: "Lỗi của shop: Green Mart chịu phí ship. Đổi do lý do cá nhân: Khách hàng chịu phí.",
          },
          {
            title: "Hoàn tiền",
            content: "Sau khi nhận hàng trả, hoàn tiền trong 3-5 ngày làm việc vào tài khoản đã thanh toán.",
          },
        ],
      },
    },
    {
      icon: Shield,
      title: "Bảo mật",
      description: "Bảo vệ thông tin cá nhân",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const faqs = [
    {
      category: "Đặt hàng",
      question: "Làm thế nào để đặt hàng trên Green Mart?",
      answer:
        "Để đặt hàng, bạn chọn sản phẩm → Thêm vào giỏ hàng → Vào giỏ hàng → Thanh toán. Điền thông tin giao hàng và chọn phương thức thanh toán để hoàn tất.",
    },
    {
      category: "Đặt hàng",
      question: "Tôi có thể đặt hàng mà không cần tài khoản không?",
      answer:
        "Không, bạn cần đăng ký tài khoản để đặt hàng. Điều này giúp bạn theo dõi đơn hàng và nhận các ưu đãi độc quyền.",
    },
    {
      category: "Thanh toán",
      question: "Green Mart chấp nhận những phương thức thanh toán nào?",
      answer:
        "Chúng tôi chấp nhận: COD (thanh toán khi nhận hàng), Chuyển khoản ngân hàng, Ví điện tử (MoMo, ZaloPay), Thẻ ATM/Credit Card.",
    },
    {
      category: "Thanh toán",
      question: "Thông tin thanh toán của tôi có được bảo mật không?",
      answer:
        "Có, chúng tôi sử dụng công nghệ mã hóa SSL để bảo vệ thông tin thanh toán của bạn. Thông tin thẻ không được lưu trên hệ thống của chúng tôi.",
    },
    {
      category: "Vận chuyển",
      question: "Phí vận chuyển là bao nhiêu?",
      answer:
        "Phí vận chuyển từ 15.000đ - 50.000đ tùy khu vực. Miễn phí vận chuyển cho đơn hàng trên 500.000đ.",
    },
    {
      category: "Vận chuyển",
      question: "Bao lâu tôi sẽ nhận được hàng?",
      answer:
        "Thời gian giao hàng: 2-5 ngày làm việc đối với nội thành, 5-7 ngày đối với ngoại thành và tỉnh xa.",
    },
    {
      category: "Đơn hàng của tôi",
      question: "Làm thế nào để theo dõi đơn hàng?",
      answer:
        'Vào "Tài khoản của tôi" → "Đơn hàng của tôi" để xem tất cả đơn hàng và trạng thái giao hàng.',
    },
    {
      category: "Đơn hàng của tôi",
      question: "Tôi có thể hủy đơn hàng không?",
      answer:
        "Có, bạn có thể hủy đơn hàng khi đơn hàng ở trạng thái 'Chờ xác nhận'. Sau khi đã xác nhận, vui lòng liên hệ bộ phận hỗ trợ.",
    },
    {
      category: "Đổi trả",
      question: "Chính sách đổi trả như thế nào?",
      answer:
        "Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả. Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng.",
    },
    {
      category: "Đổi trả",
      question: "Ai chịu phí vận chuyển khi đổi trả?",
      answer:
        "Nếu sản phẩm lỗi do nhà sản xuất hoặc giao sai hàng, chúng tôi sẽ chịu phí vận chuyển. Nếu đổi do lý do cá nhân, bạn sẽ chịu phí.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Trung tâm trợ giúp</h1>
          <p className="text-lg text-green-50">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                onClick={() => category.guide && setSelectedCategory(category)}
                disabled={!category.guide}
                className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left ${
                  category.guide ? "cursor-pointer" : "cursor-default opacity-75"
                }`}
              >
                <div className={`inline-flex p-3 rounded-lg ${category.color} mb-4`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  {category.guide && (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Guide Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${selectedCategory.color}`}>
                    {<selectedCategory.icon size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedCategory.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedCategory.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {selectedCategory.guide.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {step.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/contact"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Liên hệ chúng tôi</h3>
            <p className="text-sm text-gray-600">
              Phản hồi nhanh chóng trong giờ làm việc
            </p>
          </Link>

          <a
            href="tel:1900xxxx"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
              <Phone size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Hotline</h3>
            <p className="text-sm text-gray-600">1900-xxxx (8:00 - 22:00)</p>
          </a>

          <a
            href="mailto:support@greenmart.com"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
            <p className="text-sm text-gray-600">support@greenmart.com</p>
          </a>
        </div>

        {/* Working Hours */}
        <div className="bg-green-50 rounded-xl p-6 text-center mb-12">
          <Clock size={32} className="text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Giờ làm việc</h3>
          <p className="text-gray-600">
            Thứ 2 - Chủ nhật: 8:00 - 22:00
          </p>
        </div>
      </div>
    </div>
  );
}
