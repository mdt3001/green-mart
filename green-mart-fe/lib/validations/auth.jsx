import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const customerRegisterSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    password_confirmation: z.string(),
    phone_number: z
      .string()
      .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

export const sellerStep1Schema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    password_confirmation: z.string(),
    phone_number: z
      .string()
      .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

export const sellerStep2Schema = z.object({
  store_name: z
    .string()
    .min(2, "Tên cửa hàng phải có ít nhất 2 ký tự")
    .max(255, "Tên cửa hàng không quá 255 ký tự"),
  store_username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(255, "Username không quá 255 ký tự")
    .regex(/^[a-z0-9_]+$/, "Username chỉ chứa chữ thường, số và _"),
  store_email: z
    .string()
    .email("Email cửa hàng không hợp lệ")
    .max(255, "Email không quá 255 ký tự"),
  store_description: z.string().optional(),
  store_address: z.string().max(500, "Địa chỉ không quá 500 ký tự").optional(),
  store_contact: z.string().max(20, "Số liên hệ không quá 20 ký tự").optional(),
  store_logo: z.any().optional(),
  brc_tax_code: z
    .string()
    .max(100, "Mã số thuế không quá 100 ký tự")
    .optional(),
  brc_number: z
    .string()
    .max(100, "Số đăng ký kinh doanh không quá 100 ký tự")
    .optional(),
  brc_date_of_issue: z.string().optional(),
  brc_place_of_issue: z
    .string()
    .max(255, "Nơi cấp không quá 255 ký tự")
    .optional(),
  brc_images: z.any().optional(),
});

// Schema kết hợp cả 2 step
export const sellerRegisterSchema = z
  .object({
    // Step 1 fields
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    password_confirmation: z.string(),
    phone_number: z
      .string()
      .regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
    address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),

    // Step 2 fields
    store_name: z
      .string()
      .min(2, "Tên cửa hàng phải có ít nhất 2 ký tự")
      .max(255, "Tên cửa hàng không quá 255 ký tự"),
    store_username: z
      .string()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .max(255, "Username không quá 255 ký tự")
      .regex(/^[a-z0-9_]+$/, "Username chỉ chứa chữ thường, số và _"),
    store_email: z
      .string()
      .email("Email cửa hàng không hợp lệ")
      .max(255, "Email không quá 255 ký tự"),
    store_description: z.string().optional(),
    store_address: z
      .string()
      .max(500, "Địa chỉ không quá 500 ký tự")
      .optional(),
    store_contact: z
      .string()
      .max(20, "Số liên hệ không quá 20 ký tự")
      .optional(),
    store_logo: z.any().optional(),
    brc_tax_code: z
      .string()
      .max(100, "Mã số thuế không quá 100 ký tự")
      .optional(),
    brc_number: z
      .string()
      .max(100, "Số đăng ký kinh doanh không quá 100 ký tự")
      .optional(),
    brc_date_of_issue: z.string().optional(),
    brc_place_of_issue: z
      .string()
      .max(255, "Nơi cấp không quá 255 ký tự")
      .optional(),
    brc_images: z.any().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

export const verifyEmailSchema = z.object({
  code: z.string().length(6, "Mã xác thực phải có 6 chữ số"),
});
