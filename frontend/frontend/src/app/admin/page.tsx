"use client";

import { useEffect, useState } from "react";
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  UserGroupIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { fakeDataService } from "@/services/fakeData";

// Biểu đồ giả lập thay vì dùng thư viện thật (có thể thay thế với ReCharts, ChartJS, v.v.)
const SimpleTrendChart = ({ 
  data, 
  color = 'blue' 
}: { 
  data: number[],
  color?: 'blue' | 'green' | 'amber' | 'purple' 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500'
  };
  
  return (
    <div className="flex items-end h-12 gap-1">
      {data.map((value, i) => {
        const height = range === 0 ? 50 : ((value - min) / range) * 100;
        return (
          <div 
            key={i} 
            className={`${colorClasses[color]} rounded-t w-3`} 
            style={{ height: `${Math.max(10, height)}%` }}
          ></div>
        );
      })}
    </div>
  );
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVillas: 0,
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    recentBookings: [] as any[],
    activeUsers: 0,
    completedPayments: 0
  });
  const [trendData, setTrendData] = useState({
    bookings: [25, 30, 45, 55, 42, 65, 75],
    revenue: [150, 230, 190, 250, 320, 380, 450],
    users: [5, 8, 12, 14, 16, 18, 21],
    villas: [10, 12, 15, 18, 20, 22, 25]
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const villas = await fakeDataService.getVillas();
        const users = await fakeDataService.getAdminUsers();
        const bookings = await fakeDataService.getAdminBookings();
        const payments = await fakeDataService.getAdminPayments();
        
        const pendingBookings = bookings.filter(b => b.status === "pending").length;
        const totalRevenue = payments
          .filter(p => p.status === "completed")
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        const recentBookings = bookings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        const activeUsers = users.filter(u => u.status === "active").length;
        const completedPayments = payments.filter(p => p.status === "completed").length;

        setStats({
          totalVillas: villas.villas.length,
          totalUsers: users.length,
          totalBookings: bookings.length,
          pendingBookings,
          totalRevenue,
          recentBookings,
          activeUsers,
          completedPayments
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(amount)
      .replace(/\s+₫/, 'đ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-6"></div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 h-40 flex flex-col justify-between">
            <div className="flex items-center">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 h-72">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded-md"></div>
        </div>
        <div className="bg-white rounded-xl p-6 h-72">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 h-80">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Tổng quan quản trị</h1>
            <p className="text-sm text-gray-500">Xem nhanh các số liệu hoạt động của hệ thống</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <DocumentCheckIcon className="h-4 w-4 mr-2" />
              Tạo báo cáo
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <EyeIcon className="h-4 w-4 mr-2" />
              Xem chi tiết
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-6">
              {/* Villas */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
                      <BuildingOfficeIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500">Tổng số chỗ ở</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalVillas}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <SimpleTrendChart data={trendData.villas} color="blue" />
                  </div>
                  <div className="mt-3 pt-2">
                    <a href="/admin/villas" className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <ArrowRightIcon className="h-4 w-4 mr-1" />
                      <span>Quản lý chỗ ở</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Users */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
                      <UserGroupIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500">Người dùng</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                        <div className="ml-2 px-1.5 py-0.5 bg-green-50 rounded text-xs font-medium text-green-700 flex items-center">
                          <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                          {stats.activeUsers}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <SimpleTrendChart data={trendData.users} color="green" />
                  </div>
                  <div className="mt-3 pt-2">
                    <a href="/admin/users" className="flex items-center text-sm text-green-600 hover:text-green-700 font-medium">
                      <ArrowRightIcon className="h-4 w-4 mr-1" />
                      <span>Quản lý người dùng</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bookings */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-amber-100 text-amber-600">
                      <CalendarIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500">Đặt phòng</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                        {stats.pendingBookings > 0 && (
                          <div className="ml-2 px-1.5 py-0.5 bg-amber-50 rounded text-xs font-medium text-amber-700 flex items-center">
                            <ExclamationCircleIcon className="h-3 w-3 mr-0.5" />
                            {stats.pendingBookings}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <SimpleTrendChart data={trendData.bookings} color="amber" />
                  </div>
                  <div className="mt-3 pt-2">
                    <a href="/admin/bookings" className="flex items-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                      <ArrowRightIcon className="h-4 w-4 mr-1" />
                      <span>Quản lý đặt phòng</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
                      <CreditCardIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                      <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                        <div className="ml-2 px-1.5 py-0.5 bg-purple-50 rounded text-xs font-medium text-purple-700 flex items-center">
                          <BanknotesIcon className="h-3 w-3 mr-0.5" />
                          {stats.completedPayments}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <SimpleTrendChart data={trendData.revenue} color="purple" />
                  </div>
                  <div className="mt-3 pt-2">
                    <a href="/admin/payments" className="flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                      <ArrowRightIcon className="h-4 w-4 mr-1" />
                      <span>Quản lý thanh toán</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Split section - Charts and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 mb-6">
              {/* Revenue by day chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo ngày</h3>
                    <select className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                      <option>7 ngày qua</option>
                      <option>30 ngày qua</option>
                      <option>Quý này</option>
                    </select>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 h-56 flex items-center justify-center">
                    <div className="w-full h-full flex flex-col">
                      <div className="flex-1 flex items-end gap-6 px-6">
                        {trendData.revenue.map((value, i) => {
                          const height = (value / Math.max(...trendData.revenue)) * 100;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <div className="text-xs text-gray-500">{formatCurrency(value * 1000).split('₫')[0]}</div>
                              <div className="w-full bg-purple-100 rounded-t relative overflow-hidden" style={{ height: `${height}%` }}>
                                <div className="absolute bottom-0 left-0 right-0 bg-purple-500 opacity-80" style={{ height: `${height}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between gap-6 px-6 mt-2">
                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                          <div key={i} className="flex-1 text-center text-xs text-gray-500">
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Xem tất cả
                    </a>
                  </div>
                  <div className="space-y-4">
                    {stats.recentBookings.slice(0, 4).map((booking, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                          {booking.userName?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {booking.userName} đã đặt {booking.villaName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Đã xác nhận' : 
                          booking.status === 'pending' ? 'Chờ xác nhận' :
                          booking.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                        </div>
                      </div>
                    ))}
                    
                    {stats.recentBookings.length === 0 && (
                      <div className="text-center py-8">
                        <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">Không có hoạt động gần đây</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Đặt phòng gần đây</h2>
                <a href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Xem tất cả
                </a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Villa
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in / Check-out
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              {booking.userName?.charAt(0) || "?"}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.villaName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(booking.totalPrice)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full 
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'}`}>
                            {booking.status === 'confirmed' ? 'Đã xác nhận' : 
                            booking.status === 'pending' ? 'Chờ xác nhận' :
                            booking.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">xem sua</a>
                          <a href="#" className="text-blue-600 hover:text-blue-900">Sửa</a>
                        </td>
                      </tr>
                    ))}

                    {stats.recentBookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CalendarIcon className="h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-base">Không có đặt phòng nào gần đây</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 