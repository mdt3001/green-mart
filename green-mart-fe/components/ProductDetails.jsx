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
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

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
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images?.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer overflow-hidden"
            >
              <Image
                src={image}
                className="group-hover:scale-103 group-active:scale-95 transition object-cover"
                alt=""
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
        <div className="relative flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg overflow-hidden">
          <Image
            src={mainImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-800">
          {product.name}
        </h1>
        <div className="flex items-center mt-2">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={14}
                className="text-transparent mt-0.5"
                fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"}
              />
            ))}
          <p className="text-sm ml-3 text-slate-500">
            {ratingsArray.length} Đánh giá
          </p>
        </div>
        <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
          <p>
            {" "}
            {product.price} {currency}
          </p>
          <p className="text-xl text-slate-500 line-through">
            {product.mrp}
            {currency}
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <TagIcon size={14} />
          <p>
            Tiết kiệm{" "}
            {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
            ngay hôm nay
          </p>
        </div>
        <div className="flex items-end gap-5 mt-10">
          {cart[productId] && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-slate-800 font-semibold">Số lượng</p>
              <Counter productId={productId} />
            </div>
          )}
          <button
            onClick={() =>
              !cart[productId] ? handleAddToCart() : router.push("/cart")
            }
            className="bg-green-600  text-white px-10 py-3 text-sm font-medium rounded hover:bg-green-700 active:scale-95 transition"
          >
            {!cart[productId] ? "Thêm vào giỏ hàng" : "Xem giỏ hàng"}
          </button>
        </div>
        <hr className="border-gray-300 my-5" />
        <div className="flex flex-col gap-4 text-slate-500">
          <p className="flex gap-3">
            {" "}
            <EarthIcon className="text-slate-400" /> Miễn phí vận chuyển{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <CreditCardIcon className="text-slate-400" /> 100% Thanh toán an
            toàn{" "}
          </p>
          <p className="flex gap-3">
            {" "}
            <UserIcon className="text-slate-400" /> Được tin cậy cao bởi khách
            hàng{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
