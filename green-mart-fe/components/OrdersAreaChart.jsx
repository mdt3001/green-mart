'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersAreaChart({ allOrders }) {

    // Backend already provides ordersPerDay in the correct format
    // Format: [{ date: "2025-11-20", count: 4 }]
    const chartData = Array.isArray(allOrders) && allOrders.length > 0 
        ? allOrders.map(item => ({
            date: item.date,
            orders: item.count
          }))
        : []

    return (
        <div className="w-full max-w-4xl h-[300px] text-xs">
            <h3 className="text-lg font-medium text-slate-800 mb-4 pt-2 text-right"> <span className='text-slate-500'>Tổng đơn hàng /</span> Ngày</h3>
            <ResponsiveContainer width="100%" height="100%"> 
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} label={{ value: 'Tổng đơn hàng', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#4f46e5" fill="#8884d8" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
