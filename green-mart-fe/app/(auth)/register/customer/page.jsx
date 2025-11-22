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
import { RHFInput } from "@/components/ui/rhf-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { customerRegisterSchema } from "@/lib/validations/auth";
import { apiPaths } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CustomerRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone_number: "",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        apiPaths.auth.customerRegister,
        data
      );

      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Đăng ký tài khoản khách hàng
        </CardTitle>
        <CardDescription className="text-center">
          Tạo tài khoản để bắt đầu mua sắm tại Green Mart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RHFInput
              name="name"
              label="Họ và tên"
              control={form.control}
              placeholder="Nguyễn Văn A"
            />

            <RHFInput
              name="email"
              label="Email"
              type="email"
              control={form.control}
              placeholder="example@gmail.com"
            />

            <RHFInput
              name="password"
              label="Mật khẩu"
              type="password"
              control={form.control}
              placeholder="••••••••"
            />

            <RHFInput
              name="password_confirmation"
              label="Xác nhận mật khẩu"
              type="password"
              control={form.control}
              placeholder="••••••••"
            />

            <RHFInput
              name="phone_number"
              label="Số điện thoại"
              control={form.control}
              placeholder="0123456789"
            />

            <RHFInput
              name="address"
              label="Địa chỉ"
              control={form.control}
              placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="space-y-3 text-center text-sm">
          <p className="text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
          <p className="text-muted-foreground">
            Bạn muốn bán hàng?{" "}
            <Link
              href="/register/seller"
              className="text-primary hover:underline font-medium"
            >
              Đăng ký tài khoản người bán
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
