import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, { message: "Tên không được để trống" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }).regex(/^\d+$/, { message: "Số điện thoại chỉ chứa số" }),
  role: z.enum(["admin", "user"], { message: "Vai trò không hợp lệ" }),
  status: z.enum(["active", "inactive"], { message: "Trạng thái không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }).optional(), // Mật khẩu tùy chọn khi chỉnh sửa
});

// Schema cho thêm mới (password bắt buộc)
export const newUserSchema = userSchema.extend({
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type UserFormData = z.infer<typeof userSchema>;
export type NewUserFormData = z.infer<typeof newUserSchema>; 