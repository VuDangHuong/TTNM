import { useState } from "react";
import { Review } from "./utils/type";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../Auth/AuthModal";

interface ReviewsSectionProps {
  reviews: Review[];
  villaId: string;
  onReviewAdded: (newReview: Review) => void;
}

const ReviewsSection = ({ reviews, villaId, onReviewAdded }: ReviewsSectionProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  
  if (!reviews) {
    return null;
  }
  
  // Calculate average rating
  const getAverageRating = () => {
    if (!reviews || reviews.length === 0) return "0.0";
    
    // Đảm bảo tất cả rating đều là số
    const validRatings = reviews.filter(review => 
      !isNaN(Number(review.rating)) && review.rating > 0
    );
    
    if (validRatings.length === 0) return "0.0";
    
    const sum = validRatings.reduce((acc, review) => 
      acc + Number(review.rating), 0
    );
    
    return (sum / validRatings.length).toFixed(1);
  };
  
  // Determine how many reviews to show
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");
  
      // Fake API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create dummy review data
      const newReview: Review = {
        userId: "user-" + Math.floor(Math.random() * 1000),
        userName: "Khách hàng",
        rating: rating,
        comment: comment,
        createdAt: new Date().toISOString()
      };
      
      // Add to reviews
      onReviewAdded(newReview);
      
      // Reset form
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openLoginModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Đánh giá từ khách hàng</h2>
        <div className="flex items-center">
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(Number(getAverageRating()))
                      ? "text-amber-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
          </div>
          <span className="ml-2 text-gray-700 font-medium">
            {getAverageRating()}/5 · {reviews.length} đánh giá
          </span>
        </div>
      </div>

      {/* Review Form or Login/Register Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        {isAuthenticated ? (
          <>
            <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá của bạn
                </label>
                <div className="flex gap-2">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRating(index + 1)}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            index < rating ? "text-amber-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nhận xét của bạn
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold mb-4">Đăng nhập để đánh giá</h3>
            <p className="text-gray-600 mb-6">
              Vui lòng đăng nhập hoặc đăng ký để chia sẻ đánh giá của bạn về villa này
            </p>
            <div className="space-x-4">
              <button
                onClick={openLoginModal}
                className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng nhập
              </button>
              <button
                onClick={openRegisterModal}
                className="inline-flex justify-center py-2 px-6 border border-blue-500 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đăng ký
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedReviews.map((review, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-3">
                {review.userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h4 className="font-medium">{review.userName || "Khách hàng"}</h4>
                <p className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="flex mb-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "text-amber-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
            </div>
            <p className="text-gray-700">{review.comment || "Rất hài lòng!"}</p>
          </div>
        ))}
      </div>

      {/* See More Reviews Button */}
      {reviews.length > 3 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            {showAllReviews ? "Thu gọn" : "Xem thêm đánh giá"}
          </button>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode} 
      />
    </div>
  );
};

export default ReviewsSection;
