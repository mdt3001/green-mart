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
import { verifyEmailSchema } from "@/lib/validations/auth";
import { apiPaths } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(apiPaths.auth.customerVerifyEmail, {
        email: email,
        verification_code: data.code,
      });

      toast.success("Xác thực email thành công!");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã xác thực không đúng!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      toast.success("Mã xác thực mới đã được gửi đến email của bạn!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi lại mã!");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Xác thực email</CardTitle>
        <CardDescription className="text-center">
          Nhập mã 6 chữ số đã được gửi đến email <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <RHFInput
              name="code"
              label="Mã xác thực"
              control={form.control}
              placeholder="123456"
              maxLength={6}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xác thực"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-primary hover:underline"
              >
                Gửi lại mã xác thực
              </button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
