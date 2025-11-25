"use client";

import { RHFInput } from "@/components/ui/rhf-input";
import { Button } from "@/components/ui/button";

export function SellerStep1({ form, onNext }) {
  const handleNext = async () => {
    const fields = [
      "name",
      "email",
      "password",
      "password_confirmation",
      "phone_number",
      "address",
    ];
    const isValid = await form.trigger(fields);

    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin cá nhân của bạn để tạo tài khoản seller
        </p>
      </div>

      <RHFInput
        name="name"
        label="Họ và tên *"
        control={form.control}
        placeholder="Nguyễn Văn A"
      />

      <RHFInput
        name="email"
        label="Email *"
        control={form.control}
        type="email"
        placeholder="example@example.com"
      />

      <RHFInput
        name="password"
        label="Mật khẩu *"
        control={form.control}
        type="password"
        placeholder="••••••••"
      />

      <RHFInput
        name="password_confirmation"
        label="Xác nhận mật khẩu *"
        control={form.control}
        type="password"
        placeholder="••••••••"
      />

      <RHFInput
        name="phone_number"
        label="Số điện thoại *"
        control={form.control}
        placeholder="0123456789"
      />

      <RHFInput
        name="address"
        label="Địa chỉ *"
        control={form.control}
        placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
      />

      <Button type="button" onClick={handleNext} className="w-full">
        Tiếp tục
      </Button>
    </div>
  );
}
