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
