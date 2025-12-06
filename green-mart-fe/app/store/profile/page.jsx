"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import { Store, Mail, Phone, MapPin, Camera, Lock, Save, User } from "lucide-react";
import Loading from "@/components/Loading";

export default function SellerProfile() {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingStore, setUpdatingStore] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm();

  const {
    register: registerStore,
    handleSubmit: handleSubmitStore,
    formState: { errors: storeErrors },
    reset: resetStore,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user profile
      const userResponse = await axiosInstance.get(API_PATHS.CUSTOMER.PROFILE);
      const userData = userResponse.data?.data || userResponse.data;
      setUser(userData);
      resetProfile({
        name: userData.name,
        phone_number: userData.phone_number || "",
        address: userData.address || "",
      });

      // Fetch store info
      const storeResponse = await axiosInstance.get(API_PATHS.SELLER.STORE);
      const storeData = storeResponse.data?.data;
      setStore(storeData);
      resetStore({
        name: storeData?.name || "",
        description: storeData?.description || "",
        address: storeData?.address || "",
        contact: storeData?.contact || "",
        email: storeData?.email || "",
      });
    } catch (error) {
      toast.error("Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      setUpdatingProfile(true);
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.address) formData.append("address", data.address);

      const imageInput = document.getElementById("avatar-input");
      if (imageInput?.files[0]) {
        formData.append("image", imageInput.files[0]);
      }

      const response = await axiosInstance.put(API_PATHS.CUSTOMER.UPDATE_PROFILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data?.data || response.data;
      setUser(updatedUser);
      updateUser(updatedUser);
      toast.success("Cập nhật thông tin thành công");
      setImagePreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const onSubmitStore = async (data) => {
    try {
      setUpdatingStore(true);
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.address) formData.append("address", data.address);
      if (data.contact) formData.append("contact", data.contact);

      const logoInput = document.getElementById("logo-input");
      if (logoInput?.files[0]) {
        formData.append("logo", logoInput.files[0]);
      }

      const response = await axiosInstance.put(API_PATHS.SELLER.UPDATE_STORE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedStore = response.data?.data || response.data;
      setStore(updatedStore);
      toast.success("Cập nhật cửa hàng thành công");
      setLogoPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdatingStore(false);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      setChangingPassword(true);
      await axiosInstance.post(API_PATHS.CUSTOMER.CHANGE_PASSWORD, {
        current_password: data.current_password,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      toast.success("Đổi mật khẩu thành công");
      resetPassword();
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Hồ sơ của tôi</h1>

      <div className="space-y-6">
        {/* User Profile Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <User size={20} />
            Thông tin cá nhân
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 mb-4">
                {imagePreview || user?.image ? (
                  <Image
                    src={imagePreview || user?.image}
                    alt={user?.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <User size={32} className="text-slate-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-input"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition text-sm text-slate-700"
              >
                <Camera size={14} />
                Đổi ảnh
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Họ và tên
                </label>
                <input
                  {...registerProfile("name", { required: "Vui lòng nhập họ và tên" })}
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {profileErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{profileErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Số điện thoại
                </label>
                <input
                  {...registerProfile("phone_number")}
                  type="tel"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Địa chỉ
                </label>
                <textarea
                  {...registerProfile("address")}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {updatingProfile ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </form>
          </div>
        </div>

        {/* Store Info Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <Store size={20} />
            Thông tin cửa hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200 mb-4">
                {logoPreview || store?.logo ? (
                  <Image
                    src={logoPreview || store?.logo}
                    alt={store?.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Store size={48} className="text-slate-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="logo-input"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition text-sm text-slate-700"
              >
                <Camera size={14} />
                Đổi logo
              </label>
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>

            <form onSubmit={handleSubmitStore(onSubmitStore)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tên cửa hàng
                </label>
                <input
                  {...registerStore("name", { required: "Vui lòng nhập tên cửa hàng" })}
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {storeErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{storeErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email cửa hàng
                </label>
                <input
                  {...registerStore("email")}
                  type="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Liên hệ
                </label>
                <input
                  {...registerStore("contact")}
                  type="tel"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Địa chỉ cửa hàng
                </label>
                <textarea
                  {...registerStore("address")}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mô tả cửa hàng
                </label>
                <textarea
                  {...registerStore("description")}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStore}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {updatingStore ? "Đang lưu..." : "Lưu thông tin cửa hàng"}
              </button>
            </form>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Lock size={20} />
              Đổi mật khẩu
            </h2>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                resetPassword();
              }}
              className="text-sm text-green-600 hover:text-green-700"
            >
              {showPasswordForm ? "Hủy" : "Đổi mật khẩu"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  {...registerPassword("current_password", {
                    required: "Vui lòng nhập mật khẩu hiện tại",
                  })}
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {passwordErrors.current_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.current_password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  {...registerPassword("password", {
                    required: "Vui lòng nhập mật khẩu mới",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                  })}
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {passwordErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  {...registerPassword("password_confirmation", {
                    required: "Vui lòng xác nhận mật khẩu",
                    validate: (value) =>
                      value === document.getElementById("password")?.value ||
                      "Mật khẩu xác nhận không khớp",
                  })}
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {passwordErrors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-1">
                    {passwordErrors.password_confirmation.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
              >
                {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

