"use client";
import {
  Heart,
  Target,
  Users,
  Award,
  Leaf,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
} from "lucide-react";
import Image from "next/image";
import { assets } from "@/assets/assets";

export default function AboutPage() {
  const stats = [
    { value: "10,000+", label: "Khách hàng hài lòng" },
    { value: "500+", label: "Sản phẩm chất lượng" },
    { value: "50+", label: "Đối tác tin cậy" },
    { value: "99%", label: "Đánh giá tích cực" },
  ];

  const values = [
    {
      icon: Leaf,
      title: "Tự nhiên & An toàn",
      description:
        "Cam kết cung cấp sản phẩm sạch, không hóa chất độc hại, an toàn cho sức khỏe",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: ShieldCheck,
      title: "Chất lượng đảm bảo",
      description:
        "Tất cả sản phẩm được kiểm định chặt chẽ, nguồn gốc rõ ràng",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh",
      description:
        "Hệ thống vận chuyển chuyên nghiệp, giao hàng tươi ngon đến tay bạn",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: HeadphonesIcon,
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ chăm sóc khách hàng nhiệt tình, sẵn sàng giải đáp mọi thắc mắc",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      image: assets.logo.src,
    },
    {
      name: "Trần Thị B",
      role: "Giám đốc Vận hành",
      image: assets.logo.src,
    },
    {
      name: "Lê Văn C",
      role: "Trưởng phòng Marketing",
      image: assets.logo.src,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Heart size={40} />
          </div>
          <h1 className="text-5xl font-bold mb-6">Về Green Mart</h1>
          <p className="text-xl text-green-50 max-w-3xl mx-auto">
            Chúng tôi tin rằng mỗi gia đình đều xứng đáng được thưởng thức
            những sản phẩm tươi ngon, sạch sẽ và an toàn cho sức khỏe
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 text-center"
            >
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Target size={16} />
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Khởi đầu từ niềm đam mê
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Green Mart ra đời từ mong muốn mang đến cho mọi gia đình Việt
                  những sản phẩm thực phẩm tươi ngon, sạch sẽ và an toàn nhất.
                  Chúng tôi hiểu rằng sức khỏe là tài sản quý giá nhất của mỗi
                  người.
                </p>
                <p>
                  Với hơn 5 năm kinh nghiệm trong ngành, chúng tôi đã xây dựng
                  mạng lưới đối tác rộng khắp với các trang trại, nhà cung cấp
                  uy tín. Mỗi sản phẩm trên Green Mart đều được chọn lọc kỹ
                  càng, đảm bảo nguồn gốc rõ ràng và chất lượng tuyệt vời.
                </p>
                <p>
                  Sứ mệnh của chúng tôi không chỉ là cung cấp thực phẩm, mà còn
                  là xây dựng lối sống lành mạnh cho cộng đồng.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src={assets.logo.src}
                alt="About Green Mart"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award size={16} />
              Giá trị cốt lõi
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cam kết của chúng tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những giá trị mà chúng tôi luôn đặt lên hàng đầu trong mọi hoạt
              động
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex p-3 rounded-lg ${value.color} mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users size={16} />
              Đội ngũ của chúng tôi
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Những người đồng hành
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đội ngũ chuyên nghiệp, tận tâm và luôn đặt khách hàng lên hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-green-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-sm p-12 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Hãy là một phần của Green Mart
          </h2>
          <p className="text-green-50 mb-8 max-w-2xl mx-auto">
            Cùng chúng tôi xây dựng một cộng đồng yêu thích sản phẩm sạch và
            lối sống lành mạnh
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/shop"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Mua sắm ngay
            </a>
            <a
              href="/contact"
              className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Liên hệ với chúng tôi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
