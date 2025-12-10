"use client";
import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItem,
  removeCartItem,
  fetchCart,
} from "@/lib/redux/features/cart/cartSlice";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(new Set());
  const dropdownRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useAuth();

  const { items, total, totalPrice } = useSelector((state) => state.cart);
  const displayItems = items.slice(0, 3); // Show max 3 items

  // Calculate total price from items
  const calculatedTotalPrice = items.reduce((sum, item) => {
    const product = item.product || item;
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  // Fetch cart when user is logged in
  useEffect(() => {
    if (!authLoading && user) {
      dispatch(fetchCart());
    }
  }, [dispatch, authLoading, user]);

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

  // Delayed hover handlers
  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 200); // 200ms delay before opening
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setIsOpen(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setLoadingItems((prev) => new Set(prev).add(productId));
    try {
      await dispatch(
        updateCartItem({ productId, quantity: newQuantity })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setLoadingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    setLoadingItems((prev) => new Set(prev).add(productId));
    try {
      await dispatch(removeCartItem({ productId })).unwrap();
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setLoadingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cart Icon */}
      <Link
        href="/cart"
        className="relative hover:text-green-600 transition group flex items-center gap-2"
      >
        {total > 0 && (
          <span className="absolute -top-2 -left-2 text-[10px] font-bold text-white bg-red-500 min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white z-10">
            {total > 99 ? "99+" : total}
          </span>
        )}
        <ShoppingCart
          size={26}
          className="group-hover:scale-110 transition-transform"
        />
        <span className="hidden lg:inline text-sm font-medium">Giỏ hàng</span>
      </Link>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen max-w-md sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 mx-4 sm:mx-0 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
              Giỏ hàng của bạn ({total} sản phẩm)
            </h3>
          </div>

          {/* Cart Items */}
          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart
                    size={40}
                    className="sm:w-12 sm:h-12 text-gray-400"
                  />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  Giỏ hàng trống
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6">
                  Hãy thêm sản phẩm yêu thích vào giỏ hàng để mua sắm ngay!
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 active:scale-95 transition-all shadow-sm hover:shadow-md text-sm"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {displayItems.map((item, idx) => {
                  // Ensure a reliable unique key for each list child
                  const productId =
                    item.product_id ||
                    item.product?.id ||
                    item.id ||
                    `idx-${idx}`;
                  const isLoading = loadingItems.has(productId);

                  return (
                    <div
                      key={productId}
                      className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors ${
                        isLoading ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      <div className="flex gap-2 sm:gap-3 relative">
                        {/* Loading Overlay */}
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg z-10">
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {/* Product Image */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.images?.[0] ||
                          item.images?.[0] ||
                          item.image ? (
                            <Image
                              src={
                                item.product?.images?.[0] ||
                                item.images?.[0] ||
                                item.image
                              }
                              alt={item.product?.name || item.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart
                                size={20}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${productId}`}
                            className="font-medium text-xs sm:text-sm text-gray-800 hover:text-green-600 line-clamp-2 sm:line-clamp-1"
                          >
                            {item.product?.name || item.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-green-600 font-semibold mt-0.5 sm:mt-1">
                            {formatPrice(
                              parseFloat(item.product?.price || item.price) || 0
                            )}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={isLoading}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={10} className="sm:w-3 sm:h-3" />
                            </button>
                            <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  productId,
                                  item.quantity + 1
                                )
                              }
                              disabled={isLoading}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={10} className="sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(productId)}
                          disabled={isLoading}
                          className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 self-start group disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa"
                        >
                          <Trash2
                            size={14}
                            className="sm:w-4 sm:h-4 text-gray-400 group-hover:text-red-600 transition-colors"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Show more indicator */}
                {items.length > 3 && (
                  <div className="p-2.5 sm:p-3 bg-gray-50 text-center">
                    <Link
                      href="/cart"
                      className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Xem thêm {items.length - 3} sản phẩm khác
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-sm sm:text-base text-gray-600">
                  Tạm tính:
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-800">
                  {formatPrice(calculatedTotalPrice)}
                </span>
              </div>
              <Link
                href="/cart"
                className="block w-full bg-green-600 text-white text-center py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 active:scale-[0.98] transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
              >
                Xem giỏ hàng
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
