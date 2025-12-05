'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingModal = ({ ratingModal, setRatingModal, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating <= 0 || rating > 5) {
            return toast.error('Vui lòng chọn số sao');
        }
        try {
            setSubmitting(true);
            await onSubmit({
                order_id: ratingModal.orderId,
                product_id: ratingModal.productId,
                rating,
                review,
            });
            toast.success('Gửi đánh giá thành công');
            setRatingModal(null);
            setRating(0);
            setReview('');
        } catch (err) {
            const message = err?.message || err?.data?.message || 'Gửi đánh giá thất bại';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button onClick={() => setRatingModal(null)} className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'>
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Đánh giá sản phẩm</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${rating > i ? "text-green-400 fill-current" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400'
                    placeholder='Viết đánh giá ngắn (tùy chọn)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button
                    disabled={submitting}
                    onClick={() => toast.promise(handleSubmit(), { loading: 'Đang gửi...' })}
                    className='w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-70'
                >
                    Gửi đánh giá
                </button>
            </div>
        </div>
    );
};

export default RatingModal;