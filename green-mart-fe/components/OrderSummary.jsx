import { PlusIcon, SquarePenIcon, XIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import AddressModal from "./AddressModal";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchAddresses } from "@/lib/redux/features/address/addressSlice";
import {
    validateCoupon,
    clearCoupon,
} from "@/lib/redux/features/coupon/couponSlice";
import { createOrder } from "@/lib/redux/features/order/orderSlice";
import { clearCartApi } from "@/lib/redux/features/cart/cartSlice";
import { useAuth } from "@/context/AuthContext";

const OrderSummary = ({ totalPrice, items }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "đ";

    const router = useRouter();
    const dispatch = useDispatch();
    const addressList = useSelector((state) => state.address.list);
    const couponState = useSelector((state) => state.coupon);
    const { user } = useAuth();

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState("");

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleCouponCode = async (event) => {
        event.preventDefault();
        if (!couponCodeInput.trim() || items.length === 0) return;
        try {
            // Giả định tất cả sản phẩm cùng store; nếu khác store cần tách đơn
            const storeId = items?.[0]?.store_id || items?.[0]?.store?.id;
            if (!storeId) throw new Error("Không xác định được cửa hàng của đơn.");
            const res = await dispatch(
                validateCoupon({ code: couponCodeInput, store_id: storeId })
            ).unwrap();
            toast.success("Áp dụng mã thành công");
        } catch (err) {
            toast.error(err?.message || "Mã không hợp lệ");
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Bạn cần đăng nhập trước khi đặt hàng");
            setTimeout(() => router.push("/login/customer"), 1200);
            return;
        }
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ giao hàng");
            return;
        }
        if (!items.length) {
            toast.error("Giỏ hàng trống");
            return;
        }
        try {
            const storeId = items?.[0]?.store_id || items?.[0]?.store?.id;
            const payload = {
                store_id: storeId,
                address_id: selectedAddress.id,
                payment_method: paymentMethod,
                items: items.map((it) => ({
                    product_id: it.id,
                    quantity: it.quantity || 1,
                })),
            };
            if (couponState.current?.code) {
                payload.coupon_code = couponState.current.code;
            }
            await dispatch(createOrder(payload)).unwrap();
            // Xóa giỏ hàng trên server để navbar & trang giỏ cập nhật ngay
            dispatch(clearCartApi());
            dispatch(clearCoupon());
            toast.success("Đặt hàng thành công");
            router.push("/orders");
        } catch (err) {
            toast.error(err?.message || "Không thể đặt hàng");
        }
    };

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Thông tin đơn hàng</h2>
            <p className='text-slate-400 text-xs my-4'>Phương thức thanh toán</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>Thanh toán khi nhận hàng</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Thanh toán online</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Địa chỉ</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Chọn địa chỉ</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Thêm địa chỉ <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Tổng tiền sản phẩm:</p>
                        <p>Phí vận chuyển:</p>
                        {couponState.current && <p>Mã giảm giá:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{totalPrice.toLocaleString('vi-VN')}{currency}</p>
                        <p>Miễn phí</p>
                        {couponState.current && <p>{`-${(couponState.current.discount / 100 * totalPrice).toLocaleString('vi-VN')}${currency}`}</p>}
                    </div>
                </div>
                {
                    !couponState.current ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Kiểm tra mã giảm giá...' })} className='flex justify-center gap-2 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Mã giảm giá' className='border border-slate-400 p-1.5 rounded flex-1 outline-none' />
                            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all cursor-pointer'>Áp dụng</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Mã: <span className='font-semibold ml-1'>{couponState.current.code.toUpperCase()}</span></p>
                            <p>{couponState.current.description}</p>
                            <XIcon size={18} onClick={() => dispatch(clearCoupon())} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Tổng tiền thanh toán:</p>
                <p className='font-medium text-right'>{couponState.current ? (totalPrice - (couponState.current.discount / 100 * totalPrice)).toLocaleString('vi-VN') : totalPrice.toLocaleString('vi-VN')}{currency}</p>
            </div>
            <button onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'Đặt hàng...' })} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Đặt hàng</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary