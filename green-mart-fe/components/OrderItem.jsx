"use client";
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "./Rating";
import { useState, useMemo } from "react";
import RatingModal from "./RatingModal";
import { createRating } from "@/lib/redux/features/rating/ratingSlice";

const OrderItem = ({ order }) => {
  const items = order.order_items || [];

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";
  const [ratingModal, setRatingModal] = useState(null);
  const dispatch = useDispatch();

  const { list: ratings = [] } = useSelector((state) => state.rating);

  const getStatusColor = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "Mới đặt";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const normalizedRatings = useMemo(() => {
    return ratings.map((r) => ({
      orderId: r.order_id || r.orderId,
      productId: r.product_id || r.productId,
      rating: r.rating,
    }));
  }, [ratings]);

  return (
    <>
      <tr className="text-sm">
        <td className="text-left">
          <div className="flex flex-col gap-6">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                  <Image
                    className="h-14 w-auto"
                    src={item.product.images[0]}
                    alt="product_img"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex flex-col justify-center text-sm">
                  <p className="font-medium text-slate-600 text-base">
                    {item.product.name}
                  </p>
                  <p>
                    {item.price.toLocaleString("vi-VN")}
                    {currency} SL : {item.quantity}{" "}
                  </p>
                  <p className="mb-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <div>
                    {normalizedRatings.find(
                      (rating) =>
                        order.id === rating.orderId &&
                        item.product.id === rating.productId
                    ) ? (
                      <Rating
                        value={
                          normalizedRatings.find(
                            (rating) =>
                              order.id === rating.orderId &&
                              item.product.id === rating.productId
                          ).rating
                        }
                      />
                    ) : (
                      <button
                        onClick={() =>
                          setRatingModal({
                            orderId: order.id,
                            productId: item.product.id,
                          })
                        }
                        className={`text-green-500 hover:bg-green-50 transition ${
                          order.status !== "DELIVERED" && "hidden"
                        }`}
                      >
                        Đánh giá sản phẩm
                      </button>
                    )}
                  </div>
                  {ratingModal && (
                    <RatingModal
                      ratingModal={ratingModal}
                      setRatingModal={setRatingModal}
                      onSubmit={(payload) =>
                        dispatch(createRating(payload)).unwrap()
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </td>

        <td className="text-center max-md:hidden">
          {order.total.toLocaleString("vi-VN")}
          {currency}
        </td>

        <td className="text-left max-md:hidden">
          <p>
            {order.address.name}, {order.address.street},
          </p>
          <p>
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country},
          </p>
          <p>{order.address.phone}</p>
        </td>

        <td className="text-left space-y-2 text-sm max-md:hidden">
          <div
            className={`flex items-center justify-center gap-1 rounded-full p-1 ${getStatusColor(
              order.status
            )}`}
          >
            <DotIcon size={10} className="scale-250" />
            {getStatusLabel(order.status)}
          </div>
        </td>
      </tr>
      {/* Mobile */}
      <tr className="md:hidden">
        <td colSpan={5}>
          <p>
            {order.address.name}, {order.address.street}
          </p>
          <p>
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country}
          </p>
          <p>{order.address.phone}</p>
          <br />
          <div className="flex items-center">
            <span
              className={`text-center mx-auto px-6 py-1.5 rounded ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-300 w-6/7 mx-auto" />
        </td>
      </tr>
    </>
  );
};

export default OrderItem;
