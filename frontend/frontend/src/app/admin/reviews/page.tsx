"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { fakeDataService } from "@/services/fakeData";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  HomeIcon,
  FlagIcon,
  ShieldCheckIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Define the Review type based on what we expect from the API
interface Review {
  id: string;
  userName: string;
  villaName: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "published" | "rejected";
}

// Skeleton loader component
const ReviewsSkeleton = () => (
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
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border-t border-gray-100 py-6">
          <div className="flex space-x-4">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-16 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Star Rating Component
const StarRating = ({ rating, size = 5 }: { rating: number; size?: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < Math.floor(rating) ? (
            <StarIconSolid className={`h-${size} w-${size} text-yellow-400`} />
          ) : i < rating ? (
            <div className="relative">
              <StarIcon className={`h-${size} w-${size} text-gray-300`} />
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${(rating - Math.floor(rating)) * 100}%` }}>
                <StarIconSolid className={`h-${size} w-${size} text-yellow-400`} />
              </div>
            </div>
          ) : (
            <StarIcon className={`h-${size} w-${size} text-gray-300`} />
          )}
        </span>
      ))}
    </div>
  );
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    average: 0,
    pending: 0,
    published: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await fakeDataService.getAdminReviews();
        // Transform data if needed to match our Review interface
        const typedData = data.map((item: any) => ({
          ...item,
          // Map 'approved' status to 'published' if needed
          status: item.status === "approved" ? "published" : item.status
        }));

        setReviews(typedData);

        // Calculate review stats
        const total = typedData.length;
        const average = typedData.reduce((sum: number, r: Review) => sum + r.rating, 0) / (total || 1);
        const pending = typedData.filter((r: Review) => r.status === "pending").length;
        const published = typedData.filter((r: Review) => r.status === "published").length;
        const rejected = typedData.filter((r: Review) => r.status === "rejected").length;

        setReviewStats({ total, average, pending, published, rejected });

        // Delay loading state to show skeleton effect
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };
  const handleDeleteReview = (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn có muốn xóa người dùng ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        setReviews(reviews.filter(review => review.id !== id));
        Swal.fire('Đã xóa!', `Người dùng ID ${id} đã bị xóa.`, 'success');
      }
    });
  }
  const filteredReviews = reviews.filter((review) => {
    // Apply search filter
    const searchMatches =
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.villaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const statusMatches = filterStatus === "all" || review.status === filterStatus;

    return searchMatches && statusMatches;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleApproveReview = (id: string) => {
  Swal.fire({
    title: 'Bạn có chắc chắn muốn xác nhận?',
    text: `Đánh giá #${id} sẽ được chuyển sang trạng thái đã phê duyệt.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Xác nhận',
    cancelButtonText: 'Hủy',
  }).then((result) => {
    if (result.isConfirmed) {
      // Giả lập cập nhật đánh giá
      const updatedReviews = reviews.map(review =>
        review.id === id ? { ...review, status: "published" as const } : review
      );
      setReviews(updatedReviews);

      // Cập nhật thống kê
      setReviewStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        published: prev.published + 1,
      }));

      // Hiển thị thông báo thành công
      Swal.fire({
        icon: 'success',
        title: 'Phê duyệt thành công!',
        text: 'Đánh giá đã được phê duyệt.',
        confirmButtonText: 'OK',
      });
    }
  });
};


  const handleRejectReview = (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Bạn có chắc chắn muốn từ chối đánh giá này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if (result.isConfirmed) {
        // Cập nhật đánh giá
        const updatedReviews = reviews.map(review =>
          review.id === id ? { ...review, status: "rejected" as const } : review
        );
        setReviews(updatedReviews);

        // Cập nhật thống kê
        setReviewStats({
          ...reviewStats,
          pending: reviewStats.pending - 1,
          rejected: reviewStats.rejected + 1
        });

        // Thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Từ chối thành công!',
          text: 'Đánh giá đã bị từ chối (giả lập).',
          confirmButtonText: 'OK'
        });
      }
    });
  };

  const getStatusBadge = (status: "pending" | "published" | "rejected") => {
    switch (status) {
      case "published":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Đã phê duyệt
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
            <FlagIcon className="mr-1 h-4 w-4" />
            Chờ phê duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full bg-red-100 text-red-800">
            <XCircleIcon className="mr-1 h-4 w-4" />
            Đã từ chối
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <ReviewsSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý đánh giá</h1>
          <p className="text-sm text-gray-500">Kiểm duyệt và quản lý các đánh giá của khách hàng</p>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng số đánh giá</p>
              <p className="text-2xl font-bold text-gray-900">{reviewStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-amber-100 text-amber-600">
              <StarIconSolid className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đánh giá trung bình</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900">{reviewStats.average.toFixed(1)}</p>
                <StarRating rating={reviewStats.average} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã phê duyệt</p>
              <p className="text-2xl font-bold text-green-600">{reviewStats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FlagIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Chờ phê duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">{reviewStats.pending}</p>
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
              placeholder="Tìm kiếm theo nội dung, khách hàng, villa..."
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="pending">Chờ phê duyệt</option>
              <option value="published">Đã phê duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Danh sách đánh giá</h2>
          </div>
          <div className="text-sm text-gray-500">Hiển thị {filteredReviews.length} đánh giá</div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-gray-900">{review.userName}</div>
                    <div>{getStatusBadge(review.status)}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 mb-2 gap-y-1 sm:gap-x-4">
                    <div className="flex items-center">
                      <HomeIcon className="h-3.5 w-3.5 mr-1" />
                      <span>{review.villaName}</span>
                    </div>
                    <div>{formatDate(review.date)}</div>
                    <div className="flex items-center">
                      <StarRating rating={review.rating} size={4} />
                      <span className="ml-1 font-medium">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {review.comment}
                  </div>

                  {review.status === "pending" && (
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleRejectReview(review.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircleIcon className="h-4 w-4 mr-1.5" />
                        Từ chối
                      </button>
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                        Phê duyệt
                      </button>
                    </div>
                  )}

                  {review.status === "published" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <TrashIcon
                          className="h-4 w-4 mr-1.5" />
                        Xóa đánh giá
                      </button>
                    </div>
                  )}

                  {review.status === "rejected" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-1.5" />
                        Phê duyệt lại
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredReviews.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-base font-medium">Không tìm thấy đánh giá nào</p>
                <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 