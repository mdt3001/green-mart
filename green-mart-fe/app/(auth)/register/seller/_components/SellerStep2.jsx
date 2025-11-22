"use client";

import { RHFInput } from "@/components/ui/rhf-input";
import { RHFTextarea } from "@/components/ui/rhf-textarea";
import { RHFFileUpload } from "@/components/ui/rhf-file-upload";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SellerStep2({ form, onBack, isLoading }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Thông tin cửa hàng</h3>
        <p className="text-sm text-muted-foreground">
          Cung cấp thông tin về cửa hàng của bạn
        </p>
      </div>

      <RHFInput
        name="store_name"
        label="Tên cửa hàng *"
        control={form.control}
        placeholder="Tech Store Test"
      />

      <RHFInput
        name="store_username"
        label="Username cửa hàng *"
        control={form.control}
        placeholder="tech_store_test"
      />

      <RHFInput
        name="store_email"
        label="Email cửa hàng *"
        control={form.control}
        type="email"
        placeholder="techstore.test@greenmart.com"
      />

      <RHFTextarea
        name="store_description"
        label="Mô tả cửa hàng"
        control={form.control}
        placeholder="Cửa hàng công nghệ chuyên cung cấp các sản phẩm điện tử..."
        rows={3}
      />

      <RHFInput
        name="store_address"
        label="Địa chỉ cửa hàng"
        control={form.control}
        placeholder="456 Lê Lợi, Q1, TP.HCM"
      />

      <RHFInput
        name="store_contact"
        label="Số liên hệ cửa hàng"
        control={form.control}
        placeholder="0987654321"
      />

      <RHFFileUpload
        name="store_logo"
        label="Logo cửa hàng"
        control={form.control}
        accept="image/jpeg,image/jpg,image/png,image/webp"
      />

      <Separator className="my-6" />

      <div className="space-y-4">
        <h4 className="font-semibold">Thông tin đăng ký kinh doanh</h4>

        <RHFInput
          name="brc_tax_code"
          label="Mã số thuế"
          control={form.control}
          placeholder="0123456789"
        />

        <RHFInput
          name="brc_number"
          label="Số đăng ký kinh doanh"
          control={form.control}
          placeholder="123456"
        />

        <RHFInput
          name="brc_date_of_issue"
          label="Ngày cấp"
          control={form.control}
          type="date"
        />

        <RHFInput
          name="brc_place_of_issue"
          label="Nơi cấp"
          control={form.control}
          placeholder="Sở Kế hoạch và Đầu tư TP.HCM"
        />

        <RHFFileUpload
          name="brc_images"
          label="Ảnh giấy phép kinh doanh (Tối đa 5 ảnh)"
          control={form.control}
          accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
          multiple={true}
          maxFiles={5}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Quay lại
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </div>
    </div>
  );
}
