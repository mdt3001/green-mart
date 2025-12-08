"use client";

import { addCartItem } from "@/lib/redux/features/cart/cartSlice";
import {
  StarIcon,
  TagIcon,
  EarthIcon,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";


const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = "đ"; // VND currency

  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images?.[0]);

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      toast("Bạn cần đăng nhập mới có thể thêm sản phẩm vào giỏ hàng!")
      setTimeout(() => {
        router.push("/login/customer");
      }, 3000);
      return;
    }
    dispatch(addCartItem({ productId, quantity: 1 }));
  };

  const ratingsArray = Array.isArray(product.ratings) ? product.ratings : [];
  const averageRating =
    product?.ratings_avg_rating ??
    (ratingsArray.length > 0
      ? ratingsArray.reduce((acc, item) => acc + (item.rating || 0), 0) /
      ratingsArray.length
      : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="flex flex-col-reverse sm:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
          {product.images?.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className={`bg-gray-50 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 transition-all flex-shrink-0 ${
                mainImage === image
                  ? 'border-green-600 shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                className="object-cover rounded-md"
                alt=""
                width={100}
                height={100}
              />
            </button>
          ))}
        </div>
        
        {/* Main Image */}
        <div className="relative flex justify-center items-center aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <Image 
            src={mainImage} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw" 
            className="object-cover hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        {/* Title & Rating */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <StarIcon
                    key={index}
                    size={16}
                    className="text-transparent"
                    fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
                  />
                ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} ({ratingsArray.length} đánh giá)
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl sm:text-4xl font-bold text-green-600">
              {product.price.toLocaleString('vi-VN')}{currency}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {product.mrp.toLocaleString('vi-VN')}{currency}
            </span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <TagIcon size={16} />
            <p className="text-sm font-medium">
              Tiết kiệm {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}% ngay hôm nay
            </p>
          </div>
        </div>

        {/* Add to Cart Section */}
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            {cart[productId] && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">Số lượng</p>
                <Counter productId={productId} />
              </div>
            )}
            <button
              onClick={() =>
                !cart[productId] ? addToCartHandler() : router.push("/cart")
              }
              className="flex-1 bg-green-600 text-white px-8 py-3.5 text-base font-semibold rounded-lg hover:bg-green-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            >
              {!cart[productId] ? "Thêm vào giỏ hàng" : "Xem giỏ hàng"}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <p className="flex items-center gap-3 text-gray-700">
            <EarthIcon className="text-green-600" size={20} /> 
            <span>Miễn phí vận chuyển</span>
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <CreditCardIcon className="text-green-600" size={20} /> 
            <span>100% Thanh toán an toàn</span>
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <UserIcon className="text-green-600" size={20} /> 
            <span>Được tin cậy cao bởi khách hàng</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
