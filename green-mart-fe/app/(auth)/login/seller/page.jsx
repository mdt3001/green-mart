"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import Cookies from "js-cookie"; // 2. Import js-cookie

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
import { loginSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Khởi tạo router

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = form.watch("email");

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.SELLER_LOGIN,
        formData
      );

      const result = response.data;

    
      const { token, user, store } = result.data;

      if (!token) {
        throw new Error("Không tìm thấy token xác thực!");
      }

      Cookies.set("token", token, { expires: 7, path: "/" });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (store) {
        localStorage.setItem("store", JSON.stringify(store));
      }

      toast.success("Đăng nhập thành công!");
      router.push("/store"); // Chuyển hướng sau khi đăng nhập thành công

      
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || error.message || "Đăng nhập thất bại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center">
          Đăng nhập vào tài khoản người bán
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RHFInput
              name="email"
              label="Email"
              control={form.control}
              type="email"
              placeholder="example@gmail.com"
            />

            <RHFInput
              name="password"
              label="Mật khẩu"
              control={form.control}
              type="password"
              placeholder="••••••••"
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register/seller"
              className="text-primary hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>

          <p className="text-muted-foreground">
            Tài khoản chưa kích hoạt?{" "}
            <Link
              href={
                emailValue
                  ? `/verify-email?email=${encodeURIComponent(emailValue)}`
                  : "/verify-email"
              }
              className="text-primary hover:underline font-medium"
            >
              Xác thực ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
