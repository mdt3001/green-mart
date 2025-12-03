"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RHFInput } from "@/components/ui/rhf-input";
import { Button } from "@/components/ui/button";
import { verifyEmailSchema } from "@/lib/validations/auth";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/lib/axios/axiosInstance";
import toast from "react-hot-toast";
import { CheckCircle2, Store, Clock } from "lucide-react"; // Import thêm icon

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

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
      const response = await axiosInstance.post(
        API_PATHS.AUTH.CUSTOMER_VERIFY_EMAIL,
        {
          email: email,
          code: data.code,
        }
      );

      const responseData = response.data;
      toast.success(
        "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
      );
      setTimeout(() => {
        router.push("/login/customer");
      }, 3000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Mã xác thực không đúng!";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.CUSTOMER_RESEND_VERIFICATION, {
        email: email,
      });
      toast.success("Mã xác thực đã được gửi lại đến email của bạn.");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Gửi lại mã xác thực thất bại!";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Xác thực người dùng
        </CardTitle>
        <CardDescription className="text-center">
          Nhập mã 6 chữ số đã được gửi đến email <br />
          <strong className="text-primary">{email}</strong>
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
              {isLoading ? "Đang xử lý..." : "Xác thực ngay"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
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
