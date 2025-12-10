"use client";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createAddress } from "@/lib/redux/features/address/addressSlice";

const AddressModal = ({ setShowAddressModal }) => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createAddress(address)).unwrap();
    setShowAddressModal(false);
  };

  return (
    <form
      onSubmit={(e) =>
        toast.promise(handleSubmit(e), { loading: "Đang thêm địa chỉ..." })
      }
      className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center"
    >
      <div className="flex flex-col gap-5 text-slate-700 w-full max-w-sm mx-6">
        <h2 className="text-3xl ">
          Thêm <span className="font-semibold">Địa chỉ</span>
        </h2>
        <input
          name="name"
          onChange={handleAddressChange}
          value={address.name}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="text"
          placeholder="Họ tên"
          required
        />
        <input
          name="email"
          onChange={handleAddressChange}
          value={address.email}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="email"
          placeholder="Email"
          required
        />
        <input
          name="street"
          onChange={handleAddressChange}
          value={address.street}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="text"
          placeholder="Địa chỉ"
          required
        />
        <div className="flex gap-4">
          <input
            name="city"
            onChange={handleAddressChange}
            value={address.city}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="text"
            placeholder="Quận/Huyện"
            required
          />
          <input
            name="state"
            onChange={handleAddressChange}
            value={address.state}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="text"
            placeholder="Thành phố/ Tỉnh"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="country"
            onChange={handleAddressChange}
            value={address.country}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="text"
            placeholder="Quốc gia"
            required
          />
        </div>
        <input
          name="phone"
          onChange={handleAddressChange}
          value={address.phone}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="text"
          placeholder="Số điện thoại"
        />
        <button className="bg-green-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-green-700 active:scale-95 transition-all">
          Lưu địa chỉ
        </button>
      </div>
      <XIcon
        size={30}
        className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer"
        onClick={() => setShowAddressModal(false)}
      />
    </form>
  );
};

export default AddressModal;