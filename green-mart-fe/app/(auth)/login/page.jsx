"use client";

import { useState } from "react";
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
import { apiPaths } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        apiPaths.auth.customerLogin,
        data
      );
      const result = response.data;

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      toast.success("Đăng nhập thành công!");
      window.location.href = "/";
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
          Đăng nhập vào tài khoản của bạn
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

        <p className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/register/customer"
            className="text-primary hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
