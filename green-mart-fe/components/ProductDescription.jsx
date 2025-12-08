'use client'
import { ArrowRight, StarIcon, User, Package, MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const ProductDescription = ({ product }) => {

    const [selectedTab, setSelectedTab] = useState('Mô tả')
    const ratingsArray = Array.isArray(product.rating) ? product.rating : [];
    const averageRating = ratingsArray.length > 0
        ? ratingsArray.reduce((acc, item) => acc + (item.rating || 0), 0) / ratingsArray.length
        : 0;

    return (
        <div className="my-12 border-t border-gray-200 pt-8">

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg max-w-md">
                {['Mô tả', 'Đánh giá'].map((tab, index) => (
                    <button 
                        className={`${
                            tab === selectedTab 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        } flex-1 px-4 py-2.5 font-semibold rounded-md transition-all flex items-center justify-center gap-2`} 
                        key={index} 
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab === 'Mô tả' ? <Package size={16} /> : <MessageSquare size={16} />}
                        {tab}
                        {tab === 'Đánh giá' && ratingsArray.length > 0 && (
                            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {ratingsArray.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Mô tả" && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="text-green-600" size={24} />
                        Thông tin sản phẩm
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                        <p className="whitespace-pre-line">{product.description}</p>
                    </div>
                </div>
            )}

            {/* Reviews */}
            {selectedTab === "Đánh giá" && (
                <div>
                    {/* Review Summary */}
                    {ratingsArray.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-green-600 mb-2">
                                        {averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex items-center justify-center mb-1">
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon 
                                                key={index} 
                                                size={20} 
                                                className='text-transparent' 
                                                fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">{ratingsArray.length} đánh giá</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-700 font-medium mb-2">Phân bố đánh giá</p>
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratingsArray.filter(r => r.rating === star).length;
                                        const percentage = (count / ratingsArray.length * 100).toFixed(0);
                                        return (
                                            <div key={star} className="flex items-center gap-3 mb-1">
                                                <span className="text-sm text-gray-600 w-8">{star} ⭐</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-green-600 h-2 rounded-full transition-all" 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500 w-12 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review List */}
                    {ratingsArray.length > 0 ? (
                        <div className="space-y-6">
                            {ratingsArray.map((item, index) => (
                                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        {item.user?.image ? (
                                            <Image 
                                                src={item.user.image} 
                                                alt={item.user.name} 
                                                className="w-12 h-12 rounded-full object-cover" 
                                                width={48} 
                                                height={48} 
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <User className="w-6 h-6 text-green-600" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.user?.name || 'Người dùng'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(item.created_at).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {Array(5).fill('').map((_, idx) => (
                                                        <StarIcon 
                                                            key={idx} 
                                                            size={16} 
                                                            className='text-transparent' 
                                                            fill={item.rating >= idx + 1 ? "#00C950" : "#D1D5DB"} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">{item.review}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đánh giá</h4>
                            <p className="text-gray-600 text-sm">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Store Page */}
            <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                    <Image 
                        src={product.store.logo} 
                        alt={product.store.name} 
                        className="w-16 h-16 rounded-full ring-2 ring-green-500 shadow-md object-cover" 
                        width={64} 
                        height={64} 
                    />
                    <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">{product.store.name}</p>
                        <p className="text-sm text-gray-600 mb-2">Cửa hàng chính thức</p>
                        <Link 
                            href={`/shop/${product.store.id}`} 
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                        > 
                            Xem cửa hàng 
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDescription