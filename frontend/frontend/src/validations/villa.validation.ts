import { z } from 'zod';

export const villaSchema = z.object({
  name: z.string()
    .min(3, 'Tên villa phải có ít nhất 3 ký tự'),
  
  description: z.string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  
  basePrice: z.number()
    .min(0, 'Giá không được âm'),
  
  size: z.number()
    .min(0, 'Diện tích không được âm'),
  
  maxGuests: z.number()
    .min(1, 'Số khách tối đa phải lớn hơn 0'),
  
  bedrooms: z.number()
    .min(0, 'Số phòng ngủ không được âm'),
  
  beds: z.number()
    .min(0, 'Số giường không được âm'),
  
  isAvailable: z.boolean(),
  
  serviceCharge: z.number()
    .min(0, 'Phí dịch vụ không được âm'),
  
  timing: z.object({
    checkIn: z.string(),
    checkOut: z.string()
  }),
  
  amenities: z.object({
    wifi: z.boolean(),
    airConditioning: z.boolean(),
    kitchen: z.boolean(),
    tv: z.boolean(),
    pool: z.boolean(),
    parking: z.boolean(),
    security: z.boolean(),
    breakfast: z.boolean()
  }),
  
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
      .min(1, 'Địa chỉ không được để trống')
  }),
  
  images: z.array(z.string())
    .min(1, 'Phải có ít nhất 1 hình ảnh')
});

export type VillaFormData = z.infer<typeof villaSchema>; 