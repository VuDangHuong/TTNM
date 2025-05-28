import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();
    
    // Gọi đến API backend
    const response = await axios.post(
      `https://api.villaflcngocxanh.com/bookings`,
      bookingData
    );
    
    // Trả về dữ liệu từ backend
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating booking:', error);
    
    // Trả về lỗi với status code phù hợp
    const axiosError = error as { response?: { data?: { message?: string }, status?: number } };
    return NextResponse.json(
      { 
        message: axiosError.response?.data?.message || 'Có lỗi xảy ra khi đặt phòng' 
      }, 
      { status: axiosError.response?.status || 500 }
    );
  }
}
