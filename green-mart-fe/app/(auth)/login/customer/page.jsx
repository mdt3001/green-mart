"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = form.watch("email");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.CUSTOMER_LOGIN,
        data
      );
      const result = response.data;
      const { token, user } = result.data;

      // ✅ Chỉ cần gọi login() - nó sẽ tự lưu vào localStorage và Cookies
      login(user, token);

      toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
        <CardDescription className="text-center">
          Đăng nhập vào tài khoản khách hàng
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
              href="/register/customer"
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
                  ? `/verify-email/customer?email=${encodeURIComponent(
                      emailValue
                    )}`
                  : "/verify-email/customer"
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
