"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { fakeDataService, Booking } from "@/services/fakeData";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  QueueListIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Skeleton loader component
const BookingsSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-6"></div>

    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-3/4"></div>
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-1/4"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm h-28 p-6">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="h-10 bg-gray-200 rounded-md mb-6"></div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border-t border-gray-100 py-4">
          <div className="grid grid-cols-8 gap-4">
            {[...Array(8)].map((_, j) => (
              <div key={j} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await fakeDataService.getAdminBookings();
        setBookings(data);

        // Calculate booking stats
        const stats = {
          total: data.length,
          pending: data.filter(b => b.status === "pending").length,
          confirmed: data.filter(b => b.status === "confirmed").length,
          cancelled: data.filter(b => b.status === "cancelled").length,
          completed: data.filter(b => b.status === "completed").length
        };
        setBookingStats(stats);

        // Delay loading state to show skeleton effect
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const filteredBookings = bookings.filter((booking) => {
    // Apply search filter
    const searchMatches =
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.villaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const statusMatches = filterStatus === "all" || booking.status === filterStatus;

    return searchMatches && statusMatches;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace(/\s+₫/, "đ");
  };

  const getStatusBadge = (status: "pending" | "confirmed" | "cancelled" | "completed") => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Đã xác nhận
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
            <ClockIcon className="mr-1 h-4 w-4" />
            Chờ xác nhận
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Đã hủy
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Hoàn thành
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (paymentStatus: "pending" | "paid" | "refunded") => {
    switch (paymentStatus) {
      case "paid":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            Đã thanh toán
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
            <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
            Chưa thanh toán
          </span>
        );
      case "refunded":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-purple-100 text-purple-800">
            Đã hoàn tiền
          </span>
        );
      default:
        return null;
    }
  };

  const handleConfirmBooking = (id: string) => {
   
  Swal.fire({
    title: 'Bạn có chắc chắn muốn xác nhận?',
    text: `Đơn đặt phòng #${id} sẽ được chuyển sang trạng thái hoàn tất.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
    // reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Cập nhật trạng thái thanh toán
      const updatedBookings = bookings.map(booking => 
        booking.id === id ? { ...booking, status: "completed" as const } : booking
      );
      setBookings(updatedBookings);

      // Cập nhật thống kê
        // // Update stats
    setBookingStats({
      ...bookingStats,
      pending: bookingStats.pending - 1,
      confirmed: bookingStats.confirmed + 1
    });

      // Thông báo xác nhận thành công
      Swal.fire({
        icon: 'success',
        title: 'Xác nhận thành công!',
        text: `Đơn đặt phòng #${id} đã được xác nhận.`,
        confirmButtonText: 'OK'
      });
    }
  });
};

  const handleCancelBooking = (id: string) => {
   Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: `Bạn có chắc chắn muốn hủy đơn đặt phòng #${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Có, hủy đơn!',
    cancelButtonText: 'Không',
    // reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // Tìm đơn đặt phòng
      const booking = bookings.find(b => b.id === id);
      
      // Cập nhật danh sách
      const updatedBookings = bookings.map(booking =>
        booking.id === id ? { ...booking, status: "cancelled" as const } : booking
      );
      setBookings(updatedBookings);

      // Cập nhật thống kê
      if (booking) {
        const statsCopy = { ...bookingStats };
        if (booking.status === "pending") {
          statsCopy.pending -= 1;
        } else if (booking.status === "confirmed") {
          statsCopy.confirmed -= 1;
        }
        statsCopy.cancelled += 1;
        setBookingStats(statsCopy);
      }

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'info',
        title: 'Đã hủy đặt phòng',
        text: `Đơn đặt phòng #${id} đã bị hủy .`,
        confirmButtonText: 'OK'
      });
    }
  });
  };

  if (loading) {
    return <BookingsSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý đặt phòng</h1>
          <p className="text-sm text-gray-500">Theo dõi và quản lý tất cả các đơn đặt phòng</p>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
              <QueueListIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng đơn đặt phòng</p>
              <p className="text-2xl font-bold text-gray-900">{bookingStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Chờ xác nhận</p>
              <p className="text-2xl font-bold text-yellow-600">{bookingStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã xác nhận</p>
              <p className="text-2xl font-bold text-green-600">{bookingStats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 text-red-600">
              <XCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã hủy</p>
              <p className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tìm kiếm theo tên khách hàng, villa..."
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            {/* <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" /> */}
            <h2 className="text-lg font-semibold text-gray-900">Danh sách đặt phòng</h2>
          </div>
          <div className="text-sm text-gray-500">Hiển thị {filteredBookings.length} đơn đặt phòng</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đặt phòng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Villa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        <BuildingOfficeIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{booking.villaName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {booking.guests} khách
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(booking.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentBadge(booking.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-3">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="Xác nhận"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Hủy"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Hủy"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {/* <a href="#" className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50">
                        <ArrowPathIcon className="h-5 w-5" />
                      </a> */}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-base font-medium">Không tìm thấy đơn đặt phòng nào</p>
                      <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 