import { Discount, Villa } from './type';

/**
 * Format giá tiền theo định dạng tiền Việt Nam
 */
export const formatPrice = (price: string | number): string => {
  if (typeof price === "string") {
    return price; // Already formatted
  }
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

/**
 * Tính toán giá trị giảm giá từ danh sách discount
 */
export const calculateDiscount = (
  discounts: Discount[] | undefined, 
  basePrice: number
): number => {
  if (!discounts || discounts.length === 0) return 0;
  
  // Lọc ra các discount đang active
  const activeDiscounts = discounts.filter(
    (d) => d.isActive && 
           new Date(d.startDate) <= new Date() && 
           new Date(d.endDate) >= new Date()
  );
  
  if (activeDiscounts.length === 0) return 0;
  
  // Tìm discount có giá trị lớn nhất
  let maxDiscountValue = 0;
  
  activeDiscounts.forEach((discount) => {
    let discountValue = 0;
    
    if (discount.type === "percentage") {
      discountValue = (basePrice * discount.value) / 100;
    } else { // fixed
      discountValue = discount.value;
    }
    
    maxDiscountValue = Math.max(maxDiscountValue, discountValue);
  });
  
  return maxDiscountValue;
};

/**
 * Tính giá sau khi áp dụng giảm giá
 */
export const calculateDiscountedPrice = (
  price: number,
  discounts: Discount[] | undefined,
  date: Date
): number => {
  if (!discounts || discounts.length === 0) return price;
  
  // Lọc ra các discount áp dụng cho ngày cụ thể
  const applicableDiscounts = discounts.filter(
    (d) => d.isActive && 
           new Date(d.startDate) <= date && 
           new Date(d.endDate) >= date
  );
  
  if (applicableDiscounts.length === 0) return price;
  
  // Tìm discount có giá trị lớn nhất
  let maxDiscountValue = 0;
  
  applicableDiscounts.forEach((discount) => {
    let discountValue = 0;
    
    if (discount.type === "percentage") {
      discountValue = (price * discount.value) / 100;
    } else { // fixed
      discountValue = discount.value;
    }
    
    maxDiscountValue = Math.max(maxDiscountValue, discountValue);
  });
  
  return price - maxDiscountValue;
};


/**
 * Tính tổng giá dựa trên ngày check-in, check-out và áp dụng giảm giá
 */
export const calculateTotalPrice = (
  villa: Villa,
  startDate: string | undefined,
  endDate: string | undefined
): number => {
  if (!villa || !startDate || !endDate) return villa.basePrice + villa.serviceCharge;
  
  // Convert strings to Date objects
  const checkIn = new Date(startDate);
  const checkOut = new Date(endDate);
  
  // Calculate number of nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return villa.basePrice + villa.serviceCharge;
  
  let totalPrice = 0;
  const currentDate = new Date(checkIn);
  
  // Iterate through each day of the stay
  for (let i = 0; i < nights; i++) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Convert to our day format
    let dayName: string;
    if (dayOfWeek === 0) dayName = "Chủ nhật";
    else dayName = `Thứ ${dayOfWeek + 1}`;
    
    // Find the price for this day
    const dayPrice = villa.priceByDay.find(p => p.day === dayName);
    let priceForDay = dayPrice 
      ? (typeof dayPrice.price === 'string' 
          ? parseFloat(dayPrice.price.replace(/[^\d]/g, '')) 
          : dayPrice.price)
      : villa.basePrice;
    
    // Apply discount if applicable for THIS SPECIFIC DATE
    if (villa.discounts && villa.discounts.some(d => d.isActive)) {
      priceForDay = calculateDiscountedPrice(priceForDay, villa.discounts, new Date(currentDate));
    }
    
    totalPrice += priceForDay;
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Add service charge
  totalPrice += villa.serviceCharge;

  return totalPrice;
};

/**
 * Tính giá cơ bản sau khi áp dụng giảm giá cho ngày hiện tại
 */
export const getDiscountedBasePrice = (villa: Villa): number => {
  if (!villa.discounts || villa.discounts.length === 0) {
    return villa.basePrice;
  }
  
  const currentDate = new Date();
  
  // Lọc ra các discount đang active cho ngày hiện tại
  const activeDiscounts = villa.discounts.filter(
    (d) => d.isActive && 
           new Date(d.startDate) <= currentDate && 
           new Date(d.endDate) >= currentDate
  );
  
  if (activeDiscounts.length === 0) {
    return villa.basePrice;
  }
  
  // Tính giá sau khi áp dụng giảm giá cho ngày hiện tại
  return calculateDiscountedPrice(villa.basePrice, villa.discounts, currentDate);
};
/**
 * Trả về danh sách các ngày giữa hai ngày
 */
export const getDaysBetweenDates = (
  startDate: string | Date,
  endDate: string | Date
): Date[] => {
  const start = new Date(new Date(startDate).toLocaleString("en-US", { timeZone: "Asia/Saigon" }));
  const end = new Date(new Date(endDate).toLocaleString("en-US", { timeZone: "Asia/Saigon" }));
  const days: Date[] = [];

  // Loop through dates
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    days.push(new Date(dt));
  }

  return days;
};

/**
 * Format ngày tháng theo định dạng tiếng Việt
 */
export const formatDateString = (dateString: string): string => {
  try {
    const date = new Date(new Date(dateString).toLocaleString("en-US", { timeZone: "Asia/Saigon" }));
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Lấy tên thứ trong tuần từ đối tượng Date
 */
export const getDayName = (date: Date): string => {
  const days: string[] = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return days[date.getDay()];
};
