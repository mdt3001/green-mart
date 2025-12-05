'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/lib/redux/features/order/orderSlice";
import { fetchMyRatings } from "@/lib/redux/features/rating/ratingSlice";
import Loading from "@/components/Loading";


export default function Orders() {
    const dispatch = useDispatch();
    const { list: orders = [], loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchMyRatings());
    }, [dispatch]);

    if (loading) return <Loading />
    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                (
                    <div className="my-20 max-w-7xl mx-auto">
                        <PageTitle heading="Đơn hàng của bạn" text={`Hiện có ${orders.length} đơn hàng`} linkText={'Về trang chủ'} />

                        <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                            <thead>
                                <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                    <th className="text-left">Sản phẩm</th>
                                    <th className="text-center">Tổng tiền</th>
                                    <th className="text-left">Địa chỉ giao hàng</th>
                                    <th className="text-left">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Chưa có đơn hàng nào</h1>
                </div>
            )}
        </div>
    )
}