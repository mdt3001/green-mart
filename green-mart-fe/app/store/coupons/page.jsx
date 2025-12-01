'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/axios/axiosInstance"
import { API_PATHS } from "@/utils/apiPaths"

export default function StoreCoupons() {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchCoupons = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(API_PATHS.SELLER.COUPONS)
            setCoupons(response.data.data || [])
        } catch (error) {
            console.error('Error fetching coupons:', error)
            toast.error('Không thể tải danh sách mã giảm giá')
        } finally {
            setLoading(false)
        }
    }

    const toggleCoupon = async (code) => {
        try {
            const response = await axiosInstance.post(API_PATHS.SELLER.TOGGLE_COUPON(code))
            toast.success(response.data.message)
            fetchCoupons()
        } catch (error) {
            console.error('Error toggling coupon:', error)
            toast.error(error.response?.data?.message || 'Không thể cập nhật trạng thái')
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Quản Lý Mã Giảm Giá</h1>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mô tả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Giảm giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hết hạn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    Chưa có mã giảm giá nào
                                </td>
                            </tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon.code} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">{coupon.code}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-700">{coupon.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-green-600">{coupon.discount}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-700">
                                            {coupon.expires_at ? format(new Date(coupon.expires_at), 'dd/MM/yyyy') : 'Vô thời hạn'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {coupon.is_public && (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    Công khai
                                                </span>
                                            )}
                                            {coupon.for_new_user && (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    Mới
                                                </span>
                                            )}
                                            {coupon.for_member && (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                    VIP
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={coupon.is_enabled}
                                                onChange={() => toggleCoupon(coupon.code)}
                                            />
                                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>
                                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}