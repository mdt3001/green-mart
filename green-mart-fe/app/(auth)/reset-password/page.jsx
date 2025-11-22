"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
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
import { resetPasswordSchema } from "@/lib/validations/auth";
import { apiPaths } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token) form.setValue("token", token);
    if (email) form.setValue("email", email);
  }, [searchParams, form]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(apiPaths.auth.passwordReset, data);

      toast.success("Đặt lại mật khẩu thành công!");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đặt lại mật khẩu</CardTitle>
        <CardDescription className="text-center">
          Nhập mật khẩu mới của bạn
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
              disabled
            />

            <RHFInput
              name="password"
              label="Mật khẩu mới"
              control={form.control}
              type="password"
              placeholder="••••••••"
            />

            <RHFInput
              name="password_confirmation"
              label="Xác nhận mật khẩu mới"
              control={form.control}
              type="password"
              placeholder="••••••••"
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
