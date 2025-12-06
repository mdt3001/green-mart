"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Camera, Lock, Save } from "lucide-react";
import Loading from "@/components/Loading";

function ProfileContent() {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.CUSTOMER.PROFILE);
      const userData = response.data?.data || response.data;
      setUser(userData);
      resetProfile({
        name: userData.name,
        phone_number: userData.phone_number || "",
        address: userData.address || "",
      });
    } catch (error) {
      toast.error("Không thể tải thông tin tài khoản");
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
  const onSubmitProfile = async (data) => {
    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.address) formData.append("address", data.address);
      formData.append("_method", "PUT");

      const imageInput = document.getElementById("avatar-input");
      if (imageInput?.files[0]) {
        formData.append("image", imageInput.files[0]);
      }
      const response = await axiosInstance.post(
        API_PATHS.CUSTOMER.UPDATE_PROFILE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data?.data || response.data;
      setUser(updatedUser);
      updateUser(updatedUser);
      toast.success("Cập nhật thông tin thành công");
      setImagePreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setUpdating(false);
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
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-4xl mx-auto my-12">
        <h1 className="text-3xl font-semibold text-slate-800 mb-8">
          Tài khoản của tôi
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 mb-4">
                  {imagePreview || user?.image ? (
                    <Image
                      src={imagePreview || user?.image}
                      alt={user?.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User size={48} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-input"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition text-sm text-slate-700"
                >
                  <Camera size={16} />
                  Đổi ảnh đại diện
                </label>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-sm text-slate-500 mt-4 text-center">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <User size={20} />
                Thông tin cá nhân
              </h2>
              <form
                onSubmit={handleSubmitProfile(onSubmitProfile)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    {...registerProfile("name", {
                      required: "Vui lòng nhập họ và tên",
                    })}
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {profileErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {profileErrors.name.message}
                    </p>
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
                  <p className="text-xs text-slate-400 mt-1">
                    Email không thể thay đổi
                  </p>
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
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {updating ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>
            </div>

            {/* Password Form */}
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
                <form
                  onSubmit={handleSubmitPassword(onSubmitPassword)}
                  className="space-y-4"
                >
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
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.password.message}
                      </p>
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
                          value ===
                            document.getElementById("password")?.value ||
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
                    className="w-full bg-slate-700 text-white py-2.5 rounded-lg hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return <ProfileContent />;
}
