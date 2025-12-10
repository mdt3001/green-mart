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
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import Rating from "./Rating";

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = "đ"; // VND currency

  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      setTimeout(() => {
        router.push("/login/customer");
      }, 2000);
      return;
    }

    dispatch(addCartItem({ productId: product.id, quantity }));
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để mua hàng!");
      setTimeout(() => {
        router.push("/login/customer");
      }, 2000);
      return;
    }

    dispatch(addCartItem({ productId: product.id, quantity }));
    router.push("/cart");
  };

  const ratingsArray = Array.isArray(product.ratings) ? product.ratings : [];
  const averageRating = (() => {
    if (typeof product?.ratings_avg_rating === 'number') {
      return product.ratings_avg_rating;
    }
    if (ratingsArray.length > 0) {
      const sum = ratingsArray.reduce((acc, item) => acc + (item.rating || 0), 0);
      return sum / ratingsArray.length;
    }
    return 0;
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={product.images?.[selectedImage] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-green-600"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Rating rating={averageRating} />
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({ratingsArray.length} đánh giá)
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Đã bán: {product.sold || 0}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {product.price?.toLocaleString("vi-VN")}đ
            </div>
            {product.mrp && product.mrp > product.price && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-500 line-through">
                  {product.mrp.toLocaleString("vi-VN")}đ
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  -
                  {Math.round(
                    ((product.mrp - product.price) / product.mrp) *
                      100
                  )}
                  %
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Số lượng</p>
              <div className="flex items-center gap-4">
                <Counter
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                />
                <span className="text-sm text-gray-600">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mua ngay
              </button>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Heart size={20} />
                Yêu thích
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Share2 size={20} />
                Chia sẻ
              </button>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Danh mục:</span>
              <span className="font-medium">{product.category?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Cửa hàng:</span>
              <span className="font-medium">{product.store?.name}</span>
            </div>
            {product.unit && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Đơn vị:</span>
                <span className="font-medium">{product.unit}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
