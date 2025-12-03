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
  // State lưu data thành công để hiển thị giao diện thông báo
  const [successData, setSuccessData] = useState(null);

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
        API_PATHS.AUTH.SELLER_VERIFY_EMAIL,
        {
          email: email,
          code: data.code,
        }
      );

      const responseData = response.data; // Lấy full response

      toast.success("Xác thực thành công!");

      // Thay vì redirect ngay, ta lưu data để hiển thị thông báo chờ duyệt
      setSuccessData({
        message: responseData.message,
        ...responseData.data, // { store_status: "pending", store_name: "..." }
      });
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
      await axiosInstance.post(API_PATHS.AUTH.SELLER_RESEND_VERIFICATION, {
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

  if (successData) {
    return (
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Xác thực Email thành công!
          </CardTitle>
          <CardDescription className="pt-2 text-base">
            Cửa hàng{" "}
            <span className="font-semibold text-foreground">
              "{successData.store_name}"
            </span>{" "}
            của bạn đã được ghi nhận.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-amber-800">
                Trạng thái: Chờ phê duyệt
              </p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {successData.message ||
                  "Vui lòng chờ Admin phê duyệt hồ sơ cửa hàng (thường mất 1-2 ngày làm việc)."}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button
            className="w-full"
            onClick={() => router.push("/login/seller")}
          >
            Đến trang đăng nhập
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Về trang chủ
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Xác thực cửa hàng
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
