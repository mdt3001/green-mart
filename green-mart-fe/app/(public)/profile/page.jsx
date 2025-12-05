"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Store, Save, Lock, Upload } from "lucide-react";

export default function ProfilePage() {
    const { user: authUser, updateUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        image: null,
    });

    const [storeData, setStoreData] = useState({
        name: "",
        description: "",
        address: "",
        email: "",
        logo: null,
    });

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const isSeller = authUser?.roles?.includes("seller");
    const isCustomer = authUser?.roles?.includes("customer");

    useEffect(() => {
        if (!authUser) {
            router.push("/login/customer");
            return;
        }
        fetchProfile();
    }, [authUser, router]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profilePath = isSeller 
                ? API_PATHS.SELLER.PROFILE 
                : API_PATHS.CUSTOMER.PROFILE;
            
            const response = await axiosInstance.get(profilePath);
            const data = response.data.data;
            
            setProfileData({
                name: data.name || "",
                email: data.email || "",
                phone_number: data.phone_number || "",
                address: data.address || "",
                image: data.image || null,
            });

            if (isSeller && data.store) {
                setStoreData({
                    name: data.store.name || "",
                    description: data.store.description || "",
                    address: data.store.address || "",
                    email: data.store.email || "",
                    logo: data.store.logo || null,
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Không thể tải thông tin profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const formData = new FormData();
            
            if (profileData.name) formData.append("name", profileData.name);
            if (profileData.phone_number) formData.append("phone_number", profileData.phone_number);
            if (profileData.address) formData.append("address", profileData.address);
            if (profileData.imageFile) {
                formData.append("image", profileData.imageFile);
            }

            const updatePath = isSeller 
                ? API_PATHS.SELLER.UPDATE_PROFILE 
                : API_PATHS.CUSTOMER.UPDATE_PROFILE;

            const response = await axiosInstance.put(updatePath, formData);

            updateUser(response.data.data);
            toast.success("Cập nhật thông tin thành công");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleStoreUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const formData = new FormData();
            
            if (storeData.name) formData.append("name", storeData.name);
            if (storeData.description) formData.append("description", storeData.description);
            if (storeData.address) formData.append("address", storeData.address);
            if (storeData.logoFile) {
                formData.append("logo", storeData.logoFile);
            }

            await axiosInstance.put(API_PATHS.SELLER.UPDATE_STORE, formData);

            toast.success("Cập nhật cửa hàng thành công");
            fetchProfile();
        } catch (error) {
            console.error("Error updating store:", error);
            toast.error(error.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            setChangingPassword(true);
            const changePasswordPath = isSeller 
                ? API_PATHS.SELLER.CHANGE_PASSWORD 
                : API_PATHS.CUSTOMER.CHANGE_PASSWORD;

            await axiosInstance.post(changePasswordPath, passwordData);
            toast.success("Đổi mật khẩu thành công");
            setPasswordData({
                current_password: "",
                password: "",
                password_confirmation: "",
            });
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleImageChange = (e, type = "profile") => {
        const file = e.target.files[0];
        if (file) {
            if (type === "profile") {
                setProfileData({
                    ...profileData,
                    imageFile: file,
                    imagePreview: URL.createObjectURL(file),
                });
            } else {
                setStoreData({
                    ...storeData,
                    logoFile: file,
                    logoPreview: URL.createObjectURL(file),
                });
            }
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Hồ sơ của tôi</h1>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`px-6 py-3 font-medium ${
                                activeTab === "profile"
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Thông tin cá nhân
                        </button>
                        {isSeller && (
                            <button
                                onClick={() => setActiveTab("store")}
                                className={`px-6 py-3 font-medium ${
                                    activeTab === "store"
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Cửa hàng
                            </button>
                        )}
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`px-6 py-3 font-medium ${
                                activeTab === "password"
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleProfileUpdate}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh đại diện
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={profileData.imagePreview || profileData.image || "/default-avatar.png"}
                                            alt="Avatar"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label className="cursor-pointer">
                                        <div className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
                                            <Upload size={16} />
                                            Chọn ảnh
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, "profile")}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User size={16} className="inline mr-2" />
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={16} className="inline mr-2" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone size={16} className="inline mr-2" />
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileData.phone_number}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                phone_number: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin size={16} className="inline mr-2" />
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) =>
                                            setProfileData({
                                                ...profileData,
                                                address: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Store Tab (Seller only) */}
                {activeTab === "store" && isSeller && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleStoreUpdate}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo cửa hàng
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={storeData.logoPreview || storeData.logo || "/default-store.png"}
                                            alt="Store Logo"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label className="cursor-pointer">
                                        <div className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
                                            <Upload size={16} />
                                            Chọn logo
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e, "store")}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Store size={16} className="inline mr-2" />
                                        Tên cửa hàng
                                    </label>
                                    <input
                                        type="text"
                                        value={storeData.name}
                                        onChange={(e) =>
                                            setStoreData({ ...storeData, name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={storeData.description}
                                        onChange={(e) =>
                                            setStoreData({
                                                ...storeData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin size={16} className="inline mr-2" />
                                        Địa chỉ cửa hàng
                                    </label>
                                    <input
                                        type="text"
                                        value={storeData.address}
                                        onChange={(e) =>
                                            setStoreData({
                                                ...storeData,
                                                address: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail size={16} className="inline mr-2" />
                                        Email cửa hàng
                                    </label>
                                    <input
                                        type="email"
                                        value={storeData.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Password Tab */}
                {activeTab === "password" && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleChangePassword}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Lock size={16} className="inline mr-2" />
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                current_password: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                password: e.target.value,
                                            })
                                        }
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                password_confirmation: e.target.value,
                                            })
                                        }
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Lock size={16} />
                                {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

