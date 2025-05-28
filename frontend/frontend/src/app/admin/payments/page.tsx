"use client";

import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { fakeDataService } from "@/services/fakeData";
import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  CreditCardIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  ChartBarIcon,
  ReceiptRefundIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Define the Payment interface based on what's expected from the API
interface Payment {
  id: string;
  bookingId: string;
  userName: string;
  amount: number;
  date: string;
  method: string;
  status: "pending" | "completed" | "failed";
  isRefund: boolean;
}

// Skeleton loader component
const PaymentsSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-6"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm h-28 p-6">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
    
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-3/4"></div>
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-1/4"></div>
    </div>
    
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="h-10 bg-gray-200 rounded-md mb-6"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t border-gray-100 py-4">
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, j) => (
              <div key={j} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    income: 0,
    refunds: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await fakeDataService.getAdminPayments();
        
        // Transform the data if needed to match our Payment interface
        const typedData = data.map((item: any) => ({
          ...item,
          // Make sure we have the isRefund property
          isRefund: item.isRefund || false,
          // Ensure date exists
          date: item.date || item.createdAt
        }));
        
        setPayments(typedData);
        
        // Calculate payment stats
        const total = typedData.length;
        const income = typedData
          .filter((p: Payment) => p.status === "completed" && !p.isRefund)
          .reduce((sum: number, p: Payment) => sum + p.amount, 0);
        const refunds = typedData
          .filter((p: Payment) => p.isRefund)
          .reduce((sum: number, p: Payment) => sum + p.amount, 0);
        const pending = typedData.filter((p: Payment) => p.status === "pending").length;
        
        setPaymentStats({ total, income, refunds, pending });
        
        // Delay loading state to show skeleton effect
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  const filteredPayments = payments.filter((payment) => {
    // Apply search filter
    const searchMatches =
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    let typeMatches = false;
    if (filterType === "all") {
      typeMatches = true;
    } else if (filterType === "booking") {
      typeMatches = !payment.isRefund;
    } else if (filterType === "refund") {
      typeMatches = payment.isRefund;
    } else if (filterType === "pending") {
      typeMatches = payment.status === "pending";
    } else if (filterType === "completed") {
      typeMatches = payment.status === "completed";
    }
    
    return searchMatches && typeMatches;
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

  const getStatusBadge = (status: "pending" | "completed" | "failed", isRefund: boolean) => {
    if (isRefund) {
      return (
        <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-purple-100 text-purple-800">
          <ReceiptRefundIcon className="mr-1 h-4 w-4" />
          Hoàn tiền
        </span>
      );
    }
    
    switch (status) {
      case "completed":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
            <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
            Đang xử lý
          </span>
        );
      case "failed":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
            Thất bại
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "credit_card":
        return (
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-blue-600 mr-1.5" />
            <span>Thẻ tín dụng</span>
          </div>
        );
      case "bank_transfer":
        return (
          <div className="flex items-center">
            <BanknotesIcon className="h-5 w-5 text-green-600 mr-1.5" />
            <span>Chuyển khoản</span>
          </div>
        );
      default:
        return <span>{method}</span>;
    }
  };

 const handleConfirmPayment = (id: string) => {
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
      const updatedPayments = payments.map(payment => 
        payment.id === id ? { ...payment, status: "completed" as const } : payment
      );
      setPayments(updatedPayments);

      // Cập nhật thống kê
      const paymentToUpdate = payments.find(p => p.id === id);
      if (paymentToUpdate) {
        setPaymentStats({
          ...paymentStats,
          pending: paymentStats.pending - 1,
          income: !paymentToUpdate.isRefund 
            ? paymentStats.income + paymentToUpdate.amount
            : paymentStats.income
        });
      }

      // Thông báo xác nhận thành công
      Swal.fire({
        icon: 'success',
        title: 'Xác nhận thành công!',
        text: `Đơn đặt phòng #${id} đã được xác nhận (giả lập).`,
        confirmButtonText: 'OK'
      });
    }
  });
};

  if (loading) {
    return <PaymentsSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý thanh toán</h1>
          <p className="text-sm text-gray-500">Theo dõi tất cả các giao dịch thanh toán và hoàn tiền</p>
        </div>
      </div>
      
      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng giao dịch</p>
              <p className="text-2xl font-bold text-gray-900">{paymentStats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng thu</p>
              <p className="text-2xl font-bold text-green-600">{formatPrice(paymentStats.income)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
              <ArrowTrendingDownIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng hoàn tiền</p>
              <p className="text-2xl font-bold text-purple-600">{formatPrice(paymentStats.refunds)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đang xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</p>
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
              placeholder="Tìm kiếm theo mã giao dịch, khách hàng..."
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả giao dịch</option>
              <option value="booking">Thanh toán đặt phòng</option>
              <option value="refund">Hoàn tiền</option>
              <option value="pending">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <BanknotesIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Lịch sử giao dịch</h2>
          </div>
          <div className="text-sm text-gray-500">Hiển thị {filteredPayments.length} giao dịch</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã giao dịch
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đặt phòng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                      #{payment.bookingId}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={payment.isRefund ? "text-purple-600" : "text-green-600"}>
                      {payment.isRefund ? "- " : "+ "}
                      {formatPrice(payment.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPaymentMethodBadge(payment.method)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status, payment.isRefund)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-3">
                      {payment.status === "pending" && (
                        <button
                          onClick={() => handleConfirmPayment(payment.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Xác nhận"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {/* <a href="#" className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-50">
                        <ArrowPathIcon className="h-5 w-5" />
                      </a> */}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <BanknotesIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-base font-medium">Không tìm thấy giao dịch nào</p>
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