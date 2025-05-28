"use client";

import { useState, useEffect } from "react";
import { fakeDataService, Villa } from "@/services/fakeData";
// import { Villa } from "@/services/villa.service";
import Image from "next/image";
import Swal from 'sweetalert2';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  StarIcon,
  BuildingOfficeIcon,
  ListBulletIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

// Skeleton loader component
const VillasSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-6"></div>

    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-2/3"></div>
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-1/4"></div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="h-10 bg-gray-200 rounded-md mb-6"></div>
      <table className="min-w-full">
        <thead>
          <tr>
            {[...Array(6)].map((_, i) => (
              <th key={i} className="pb-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(4)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-100">
              <td className="py-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded bg-gray-200"></div>
                  <div className="ml-3">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </td>
              {[...Array(4)].map((_, colIndex) => (
                <td key={colIndex} className="py-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>
              ))}
              <td className="py-4">
                <div className="flex justify-end">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Star Rating component
const StarRating = ({ rating, count }: { rating: number, count: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow-400">
          {i < Math.floor(rating) ? (
            <StarIconSolid className="h-4 w-4" />
          ) : (
            <StarIcon className="h-4 w-4" />
          )}
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)} ({count})</span>
    </div>
  );
};

export default function AdminVillas() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVilla, setSelectedVilla] = useState<Villa | null>(null);

  useEffect(() => {
    const fetchVillas = async () => {
      try {
        const response = await fakeDataService.getVillas();
        setVillas(response.villas);
        // Delay loading state to show skeleton effect
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching villas:", error);
        setLoading(false);
      }
    };

    fetchVillas();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredVillas = villas.filter(
    (villa) =>
      villa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (villa.location?.address && villa.location.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace(/\s+₫/, "đ");
  };

  const getDiscountStatus = (villa: Villa) => {
    if (!villa.discounts || villa.discounts.length === 0) {
      return { hasDiscount: false, text: "Không" };
    }

    const activeDiscounts = villa.discounts.filter(
      (d: any) => d.isActive && new Date(d.endDate) > new Date()
    );

    if (activeDiscounts.length === 0) {
      return { hasDiscount: false, text: "Hết hạn" };
    }

    const discount = activeDiscounts[0];
    if (discount.type === "percentage") {
      return {
        hasDiscount: true,
        text: `${discount.value}%`,
      };
    } else {
      return {
        hasDiscount: true,
        text: formatPrice(discount.value),
      };
    }
  };

  const handleEdit = (villa: Villa) => {
    setSelectedVilla(villa);
    setShowModal(true);
  };

  const handleDeleteVilla = (id: string) => {
    // In a real application, you would call an API to delete the villa
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      // text: `Bạn có chắc chắn muốn xóa villa ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        setVillas(villas.filter((villa) => villa._id !== id));
        Swal.fire('Đã xóa!', `Villa ID ${id} đã được xóa.`, 'success');
      }
    });
  };

  const handleAddNew = () => {
    setSelectedVilla(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVilla(null);
  };

  const handleSaveVilla = () => {
    // In a real application, you would save the changes to the API
    setShowModal(false);
    setSelectedVilla(null);

    Swal.fire({
      icon: 'success',
      title: selectedVilla ? 'Đã cập nhật thành công!' : 'Đã thêm mới thành công!',
      text: selectedVilla
        ? 'Thông tin villa đã được cập nhật (giả lập).'
        : 'Villa mới đã được thêm (giả lập).',
      confirmButtonText: 'OK',
    });
  };

  if (loading) {
    return <VillasSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý chỗ ở</h1>
          <p className="text-sm text-gray-500">Quản lý thông tin, giá và khuyến mãi của các villa</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Villa stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
              <BuildingOfficeIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng số chỗ ở</p>
              <p className="text-2xl font-bold text-gray-900">{villas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-amber-100 text-amber-600">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng số phòng ngủ</p>
              <p className="text-2xl font-bold text-gray-900">
                {villas.reduce((sum, villa) => sum + (villa.bedrooms || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(villas.reduce((sum, villa) => sum + villa.basePrice, 0) / Math.max(1, villas.length))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
              <TagIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Có khuyến mãi</p>
              <p className="text-2xl font-bold text-gray-900">
                {villas.filter(villa => getDiscountStatus(villa).hasDiscount).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
          />
        </div>
      </div>

      {/* Villa table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <ListBulletIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Danh sách chỗ ở</h2>
          </div>
          <div className="text-sm text-gray-500">Hiển thị {filteredVillas.length} chỗ ở</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Villa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khuyến mãi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVillas.map((villa) => {
                const discountStatus = getDiscountStatus(villa);
                const reviews = villa.reviews || [];
                const avgRating = reviews.length
                  ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
                  : 0;

                return (
                  <tr key={villa._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={villa.images[0] || "/placeholder.jpg"}
                            alt={villa.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {villa.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {villa.location?.address || "Không có địa chỉ"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {villa.bedrooms} phòng ngủ · {villa.beds} giường
                      </div>
                      <div className="text-sm text-gray-500">
                        {villa.maxGuests} khách · {villa.size}m²
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatPrice(villa.basePrice)}
                      </div>
                      <div className="text-xs text-gray-500">/đêm</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${discountStatus.hasDiscount
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {discountStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StarRating rating={avgRating} count={reviews.length} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(villa)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVilla(villa._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          title="Xóa"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredVillas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <BuildingOfficeIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-base font-medium">Không tìm thấy chỗ ở nào</p>
                      <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm bằng từ khóa khác</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding/editing villa */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedVilla ? "Chỉnh sửa chỗ ở" : "Thêm chỗ ở"}
                      </h3>
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Tên Villa
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          defaultValue={selectedVilla?.name || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          defaultValue={selectedVilla?.description || ""}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Giá cơ bản (VNĐ)
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            defaultValue={selectedVilla?.basePrice || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                            Diện tích (m²)
                          </label>
                          <input
                            type="number"
                            name="size"
                            id="size"
                            defaultValue={selectedVilla?.size || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                            Phòng ngủ
                          </label>
                          <input
                            type="number"
                            name="bedrooms"
                            id="bedrooms"
                            defaultValue={selectedVilla?.bedrooms || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
                            Giường
                          </label>
                          <input
                            type="number"
                            name="beds"
                            id="beds"
                            defaultValue={selectedVilla?.beds || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700">
                            Khách tối đa
                          </label>
                          <input
                            type="number"
                            name="maxGuests"
                            id="maxGuests"
                            defaultValue={selectedVilla?.maxGuests || ""}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          defaultValue={selectedVilla?.location?.address || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveVilla}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Lưu
                </button>
                {/* <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 