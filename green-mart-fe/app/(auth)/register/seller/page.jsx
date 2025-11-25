"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { sellerRegisterSchema } from "@/lib/validations/auth";
import { SellerStep1 } from "./_components/SellerStep1";
import { SellerStep2 } from "./_components/SellerStep2";
import Link from "next/link";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";

export default function SellerRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(sellerRegisterSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
      address: "",
      store_name: "",
      store_username: "",
      store_email: "",
      store_description: "",
      store_address: "",
      store_contact: "",
      store_logo: undefined,
      brc_tax_code: "",
      brc_number: "",
      brc_date_of_issue: "",
      brc_place_of_issue: "",
      brc_images: undefined,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "brc_images" && data[key]) {
          // Xử lý multiple images
          if (Array.isArray(data[key])) {
            data[key].forEach((file) => {
              formData.append("brc_images[]", file);
            });
          } else {
            formData.append("brc_images[]", data[key]);
          }
        } else if (key === "store_logo" && data[key]) {
          // Xử lý single logo
          formData.append("store_logo", data[key]);
        } else if (data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });

      console.log("Form Data Entries:", Array.from(formData.entries()));

      const response = await axiosInstance.post(
        API_PATHS.AUTH.SELLER_REGISTER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(
        response?.data?.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản."
      );
      router.push("/login/seller");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Đăng ký tài khoản người bán
        </CardTitle>
        <CardDescription className="text-center">
          Hoàn thành 2 bước để tạo cửa hàng của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center ${
                currentStep >= 1 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= 1
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Bước 1</p>
                <p className="text-xs">Thông tin cá nhân</p>
              </div>
            </div>

            <Separator className="flex-1 mx-4" />

            <div
              className={`flex items-center ${
                currentStep >= 2 ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= 2
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Bước 2</p>
                <p className="text-xs">Thông tin cửa hàng</p>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <SellerStep1 form={form} onNext={() => setCurrentStep(2)} />
            )}
            {currentStep === 2 && (
              <SellerStep2
                form={form}
                onBack={() => setCurrentStep(1)}
                isLoading={isLoading}
              />
            )}
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="space-y-3 text-center text-sm">
          <p className="text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/login/seller"
              className="text-primary hover:underline font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
