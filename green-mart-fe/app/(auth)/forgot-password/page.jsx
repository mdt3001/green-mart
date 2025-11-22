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
import { forgotPasswordSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiPaths } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(apiPaths.auth.passwordForgot, data);

      setSuccess(true);
      toast.success("Link đặt lại mật khẩu đã được gửi đến email của bạn!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
        <CardDescription className="text-center">
          {success
            ? "Kiểm tra email của bạn để đặt lại mật khẩu"
            : "Nhập email để nhận link đặt lại mật khẩu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui
                lòng kiểm tra hộp thư.
              </p>
            </div>
            <Link href="/login">
              <Button className="w-full" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <RHFInput
                name="email"
                label="Email"
                control={form.control}
                type="email"
                placeholder="example@gmail.com"
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Gửi link đặt lại mật khẩu"}
              </Button>

              <Link href="/login">
                <Button className="w-full" variant="outline" type="button">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại đăng nhập
                </Button>
              </Link>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
