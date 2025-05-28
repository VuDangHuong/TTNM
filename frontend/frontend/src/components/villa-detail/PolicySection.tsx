import { Villa } from "./utils/type";

interface PolicySectionProps {
  villa: Villa;
}

const PolicySection = ({ villa }: PolicySectionProps) => {
  return (
    <div className="mt-12 pt-8 pb-16 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Chính sách đặt phòng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Policy Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <h3 className="font-bold text-lg text-gray-800">Chính sách thanh toán</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">•</span>
              <span>Đặt cọc 50% để xác nhận đặt phòng</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">•</span>
              <span>Thanh toán số tiền còn lại khi nhận phòng</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">•</span>
              <span>Đặt cọc nội thất 3,000,000đ (hoàn trả khi check-out)</span>
            </li>
          </ul>
        </div>

        {/* General Rules Card */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-lg text-gray-800">Quy định chung</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">•</span>
              <span>
                Nhận phòng: <span className="font-medium">{villa.timing.checkIn}</span>, 
                Trả phòng: <span className="font-medium">{villa.timing.checkOut}</span>
              </span>
            </li>
            {villa.amenities.general
              .filter(item => item.available)
              .slice(0, 3)
              .map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 text-lg">•</span>
                  <span>{item.name}</span>
                </li>
              ))}
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 text-lg">•</span>
              <span>Tuân thủ nội quy của khu nghỉ dưỡng</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PolicySection;