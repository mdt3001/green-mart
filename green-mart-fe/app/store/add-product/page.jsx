"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios/axiosInstance"; // Đảm bảo đường dẫn đúng
import { API_PATHS } from "@/utils/apiPaths"; // Đảm bảo đường dẫn đúng

// Dữ liệu mẫu danh mục (Bạn có thể move ra file constant riêng)
const PRODUCT_CATEGORIES = [
  {
    name: "Rau củ hữu cơ",
    subcategories: [
      "Rau ăn lá",
      "Củ quả",
      "Rau gia vị",
      "Nấm các loại",
      "Rau mầm",
    ],
  },
  {
    name: "Trái cây",
    subcategories: [
      "Trái cây nội địa",
      "Trái cây nhập khẩu",
      "Trái cây có múi",
      "Dưa các loại",
    ],
  },
  {
    name: "Thịt & Trứng",
    subcategories: ["Thịt heo sạch", "Thịt bò", "Gia cầm", "Trứng gia cầm"],
  },
  {
    name: "Thủy hải sản",
    subcategories: [
      "Cá các loại",
      "Tôm - Cua - Ghẹ",
      "Mực - Bạch tuộc",
      "Hải sản có vỏ",
    ],
  },
  {
    name: "Gạo & Ngũ cốc",
    subcategories: [
      "Gạo đặc sản",
      "Gạo lứt & Hữu cơ",
      "Các loại đậu",
      "Hạt dinh dưỡng",
    ],
  },
];

export default function StoreAddProduct() {
  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: "", 
    price: "", 
    category: "",
    subcategory: "",
  });
  const [loading, setLoading] = useState(false);

  const currentSubcategories = useMemo(() => {
    return (
      PRODUCT_CATEGORIES.find((c) => c.name === productInfo.category)
        ?.subcategories || []
    );
  }, [productInfo.category]);

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const onCategoryChange = (e) => {
    setProductInfo({
      ...productInfo,
      category: e.target.value,
      subcategory: "", 
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      if (Number(productInfo.price) > Number(productInfo.mrp)) {
        throw new Error("Giá bán không được cao hơn giá niêm yết!");
      }

      const formData = new FormData();
      formData.append("name", productInfo.name);
      formData.append("description", productInfo.description);
      formData.append("mrp", productInfo.mrp);
      formData.append("price", productInfo.price);
      formData.append("category", productInfo.category);
      formData.append("subcategory", productInfo.subcategory);

      Object.keys(images).forEach((key) => {
        if (images[key]) {
        
          formData.append("images[]", images[key]);
        }
      });


      await axiosInstance.post(API_PATHS.SELLER.CREATE_PRODUCT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Thêm sản phẩm thành công!");

      setImages({ 1: null, 2: null, 3: null, 4: null });
      setProductInfo({
        name: "",
        description: "",
        mrp: "",
        price: "",
        category: "",
        subcategory: "",
      });
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || error.message || "Có lỗi xảy ra!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="text-slate-500 mb-28 w-full max-w-4xl"
    >
      <h1 className="text-2xl text-slate-800 font-medium">
        Thêm sản phẩm mới
      </h1>

      <div className="mt-7">
        <p className="mb-2">Hình ảnh sản phẩm (Tối đa 4 ảnh)</p>
        <div className="flex gap-3 flex-wrap">
          {Object.keys(images).map((key) => (
            <label
              key={key}
              htmlFor={`images${key}`}
              className="relative group"
            >
              <Image
                width={300}
                height={300}
                className="h-24 w-24 object-cover border border-slate-200 rounded cursor-pointer hover:opacity-80 transition"
                src={
                  images[key]
                    ? URL.createObjectURL(images[key])
                    : assets.upload_area ||
                      "https://placehold.co/100x100?text=Upload" 
                }
                alt="Upload"
              />
              <input
                type="file"
                accept="image/*"
                id={`images${key}`}
                onChange={(e) =>
                  setImages({ ...images, [key]: e.target.files[0] })
                }
                hidden
              />
              {images[key] && (
                <div
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setImages({ ...images, [key]: null });
                  }}
                >
                  x
                </div>
              )}
            </label>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          * Ảnh đầu tiên sẽ là ảnh đại diện.
        </p>
      </div>

      <div className="flex flex-col gap-2 my-6">
        <label className="font-medium">Tên sản phẩm</label>
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="Ví dụ: Cà chua bi hữu cơ Đà Lạt"
          className="w-full max-w-xl p-2 px-4 outline-none border border-slate-200 rounded focus:border-slate-800 transition"
          required
        />
      </div>

      <div className="flex flex-col gap-2 my-6">
        <label className="font-medium">Mô tả chi tiết</label>
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Mô tả về nguồn gốc, quy cách đóng gói, hướng dẫn sử dụng..."
          rows={5}
          className="w-full max-w-xl p-2 px-4 outline-none border border-slate-200 rounded resize-none focus:border-slate-800 transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mb-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Danh mục chính</label>
          <select
            onChange={onCategoryChange}
            value={productInfo.category}
            className="w-full p-2 px-4 outline-none border border-slate-200 rounded focus:border-slate-800 transition"
            required
          >
            <option value="">Chọn danh mục</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">Danh mục phụ</label>
          <select
            name="subcategory"
            onChange={onChangeHandler}
            value={productInfo.subcategory}
            className="w-full p-2 px-4 outline-none border border-slate-200 rounded focus:border-slate-800 transition disabled:bg-gray-100"
            required
            disabled={!productInfo.category}
          >
            <option value="">Chọn loại chi tiết</option>
            {currentSubcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Giá niêm yết (MRP)</label>
          <input
            type="number"
            name="mrp"
            onChange={onChangeHandler}
            value={productInfo.mrp}
            placeholder="0"
            min="0"
            className="w-full p-2 px-4 outline-none border border-slate-200 rounded focus:border-slate-800 transition"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Giá bán khuyến mãi</label>
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            placeholder="0"
            min="0"
            className="w-full p-2 px-4 outline-none border border-slate-200 rounded focus:border-slate-800 transition"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`bg-slate-800 text-white px-8 py-3 mt-8 rounded hover:bg-slate-900 transition flex items-center justify-center min-w-[150px] ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Thêm sản phẩm"
        )}
      </button>
    </form>
  );
}
