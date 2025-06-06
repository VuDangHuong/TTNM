"use client";

import { useState, useEffect } from "react";
import { fakeDataService, Villa } from "@/services/fakeData";
// import { Villa } from "@/services/villa.service";
import Image from "next/image";
import Swal from 'sweetalert2';
import { villaSchema, VillaFormData } from "@/validations/villa.validation";
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
  const [formData, setFormData] = useState<VillaFormData>({
    name: "",
    description: "",
    images: [],
    basePrice: 0,
    size: 0,
    maxGuests: 0,
    bedrooms: 0,
    beds: 0,
    isAvailable: true,
    serviceCharge: 0,
    timing: {
      checkIn: "14:00",
      checkOut: "12:00"
    },
    amenities: {
      wifi: false,
      airConditioning: false,
      kitchen: false,
      tv: false,
      pool: false,
      parking: false,
      security: false,
      breakfast: false
    },
    location: {
      latitude: 0,
      longitude: 0,
      address: ""
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    if (selectedVilla) {
      setFormData({
        name: selectedVilla.name,
        description: selectedVilla.description,
        images: selectedVilla.images || [],
        basePrice: selectedVilla.basePrice,
        size: selectedVilla.size,
        maxGuests: selectedVilla.maxGuests,
        bedrooms: selectedVilla.bedrooms,
        beds: selectedVilla.beds,
        isAvailable: true,
        serviceCharge: 0,
        timing: {
          checkIn: "14:00",
          checkOut: "12:00"
        },
        amenities: {
          wifi: false,
          airConditioning: false,
          kitchen: false,
          tv: false,
          pool: false,
          parking: false,
          security: false,
          breakfast: false
        },
        location: selectedVilla.location || {
          latitude: 0,
          longitude: 0,
          address: ""
        }
      });
    }
  }, [selectedVilla]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        if (parent === 'location') {
          newData.location = {
            latitude: newData.location?.latitude || 0,
            longitude: newData.location?.longitude || 0,
            address: child === 'address' ? value : (newData.location?.address || '')
          };
        } else if (parent === 'timing') {
          newData.timing = { ...newData.timing, [child]: value };
        } else if (parent === 'amenities') {
          newData.amenities = { ...newData.amenities, [child]: value };
        }
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho trường giá
    if (name === 'basePrice') {
      // Loại bỏ tất cả ký tự không phải số
      const numericValue = value.replace(/[^\d]/g, '');
      const numValue = numericValue === '' ? 0 : Number(numericValue);
      
      if (numValue > 100000000) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Giá không được vượt quá 100.000.000đ'
        }));
      } else if (numValue < 1000000 && numValue !== 0) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Giá phải từ 1.000.000đ'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }

      setFormData(prev => ({
        ...prev,
        [name]: numValue
      }));
      return;
    }

    // Xử lý các trường số khác
    const numValue = value === '' ? 0 : Number(value);
    const validations = {
      size: {
        min: 20,
        max: 1000,
        error: 'Diện tích phải từ 20m² đến 1000m²'
      },
      bedrooms: {
        min: 1,
        max: 10,
        error: 'Số phòng ngủ phải từ 1 đến 10'
      }
    };

    const validation = validations[name as keyof typeof validations];
    if (validation) {
      if (numValue < validation.min || numValue > validation.max) {
        setErrors(prev => ({
          ...prev,
          [name]: validation.error
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Record<string, string> = {};

    try {
      // 1. Validate all required fields
      const requiredFields = {
        name: { label: 'Tên Villa', value: formData.name },
        description: { label: 'Mô tả', value: formData.description },
        basePrice: { label: 'Giá cơ bản', value: formData.basePrice },
        size: { label: 'Diện tích', value: formData.size },
        bedrooms: { label: 'Số phòng ngủ', value: formData.bedrooms },
        beds: { label: 'Số giường', value: formData.beds },
        maxGuests: { label: 'Số khách tối đa', value: formData.maxGuests }
      };

      // Check all required fields
      Object.entries(requiredFields).forEach(([field, { label, value }]) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field] = `${label} không được để trống.`;
        }
      });

      // Check address separately since it's nested
      if (!formData.location?.address?.trim()) {
        newErrors['location.address'] = 'Địa chỉ không được để trống.';
      }

      // 2. Validate numeric fields with ranges
      if (!newErrors.basePrice) {
        if (formData.basePrice < 1000000) {
          newErrors.basePrice = 'Giá phải từ 1.000.000đ';
        } else if (formData.basePrice > 100000000) {
          newErrors.basePrice = 'Giá không được vượt quá 100.000.000đ';
        }
      }

      if (!newErrors.size) {
        if (formData.size < 20 || formData.size > 1000) {
          newErrors.size = 'Diện tích phải từ 20m² đến 1000m²';
        }
      }

      if (!newErrors.bedrooms) {
        if (formData.bedrooms < 1 || formData.bedrooms > 10) {
          newErrors.bedrooms = 'Số phòng ngủ phải từ 1 đến 10';
        }
      }

      if (!newErrors.beds) {
        if (formData.beds < 1) {
          newErrors.beds = 'Số giường phải lớn hơn 0';
        } else if (formData.beds > 20) {
          newErrors.beds = 'Số giường không được vượt quá 20';
        }
      }

      if (!newErrors.maxGuests) {
        if (formData.maxGuests < 1) {
          newErrors.maxGuests = 'Số khách tối đa phải lớn hơn 0';
        } else if (formData.maxGuests > 40) {
          newErrors.maxGuests = 'Số khách tối đa không được vượt quá 40 người';
        }
      }

      // Validate relationship between beds and maxGuests
      if (!newErrors.beds && !newErrors.maxGuests) {
        // Số khách tối đa phải nằm trong khoảng hợp lý so với số giường
        // Giả sử mỗi giường có thể chứa tối đa 2 người
        const minGuests = formData.beds; // Ít nhất bằng số giường
        const maxGuests = formData.beds * 2; // Tối đa gấp đôi số giường

        if (formData.maxGuests < minGuests) {
          newErrors.maxGuests = `Số khách tối đa phải ít nhất bằng số giường (${minGuests} người)`;
        } else if (formData.maxGuests > maxGuests) {
          newErrors.maxGuests = `Số khách tối đa không được vượt quá ${maxGuests} người (gấp đôi số giường)`;
        }
      }

      // 3. Validate image
      if (!formData.images || formData.images.length === 0) {
        newErrors.images = 'Vui lòng chọn ít nhất 1 hình ảnh.';
      }

      // 4. Check for duplicate name (only if name is not empty and no other name errors)
      if (formData.name.trim() && !newErrors.name) {
        const nameExists = villas.some(villa =>
          villa.name.toLowerCase() === formData.name.toLowerCase() &&
          (!selectedVilla || villa._id !== selectedVilla._id)
        );

        if (nameExists) {
          newErrors.name = 'Tên Villa đã tồn tại vui lòng nhập tên villas khác.';
        }
      }

      // 5. Validate using Zod schema
      const formDataToValidate = {
        ...formData,
        basePrice: Number(formData.basePrice),
        size: Number(formData.size),
        maxGuests: Number(formData.maxGuests),
        bedrooms: Number(formData.bedrooms),
        beds: Number(formData.beds),
        serviceCharge: Number(formData.serviceCharge),
        location: {
          latitude: Number(formData.location?.latitude || 0),
          longitude: Number(formData.location?.longitude || 0),
          address: formData.location?.address || ""
        }
      };

      const validatedData = villaSchema.parse(formDataToValidate);

      // If there are any validation errors, show them all at once
      // if (Object.keys(newErrors).length > 0) {
      //   setErrors(newErrors);
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Lỗi nhập liệu!',
      //     text: 'Vui lòng kiểm tra lại thông tin bạn đã nhập.',
      //     confirmButtonText: 'OK',
      //   });
      //   return;
      // }

      // If all validations pass, proceed with saving
      if (selectedVilla) {
        // Cập nhật villa hiện có
        const updatedVillas = villas.map(villa =>
          villa._id === selectedVilla._id
            ? { 
                ...villa, 
                ...validatedData, 
                _id: villa._id,
                subDescription: validatedData.description.substring(0, 100),
                slug: validatedData.name.toLowerCase().replace(/\s+/g, '-'),
                reviews: villa.reviews,
                discounts: villa.discounts
              }
            : villa
        );
        setVillas(updatedVillas);
      } else {
        // Thêm villa mới vào danh sách
        const newVilla: Villa = {
          _id: Date.now().toString(),
          ...validatedData,
          subDescription: validatedData.description.substring(0, 100),
          slug: validatedData.name.toLowerCase().replace(/\s+/g, '-'),
          reviews: [],
          discounts: []
        };
        setVillas(prev => [...prev, newVilla]);
      }

      setShowModal(false);
      setSelectedVilla(null);
      setErrors({});

      Swal.fire({
        icon: 'success',
        title: selectedVilla ? 'Đã cập nhật thành công!' : 'Đã thêm mới thành công!',
        text: selectedVilla
          ? 'Thông tin villa đã được cập nhật.'
          : 'Villa mới đã được thêm vào danh sách.',
        confirmButtonText: 'OK',
      });

    } catch (error) {
      if (error instanceof Error) {
        const zodError = error as any;
        if (zodError.errors) {
          zodError.errors.forEach((err: any) => {
            const path = err.path.join('.');
            newErrors[path] = err.message;
          });
        }
        setErrors(newErrors);
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Lỗi!',
        //   text: 'Vui lòng kiểm tra lại thông tin nhập vào.',
        //   confirmButtonText: 'OK',
        // });
      }
    }
  };

  const handleEdit = (villa: Villa) => {
    setSelectedVilla(villa);
    setFormData({
      name: villa.name,
      description: villa.description,
      images: villa.images || [],
      basePrice: villa.basePrice,
      size: villa.size,
      maxGuests: villa.maxGuests,
      bedrooms: villa.bedrooms,
      beds: villa.beds,
      isAvailable: true,
      serviceCharge: 0,
      timing: {
        checkIn: "14:00",
        checkOut: "12:00"
      },
      amenities: {
        wifi: false,
        airConditioning: false,
        kitchen: false,
        tv: false,
        pool: false,
        parking: false,
        security: false,
        breakfast: false
      },
      location: villa.location || {
        latitude: 0,
        longitude: 0,
        address: ""
      }
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedVilla(null);
    setFormData({
      name: "",
      description: "",
      images: [],
      basePrice: 0,
      size: 0,
      maxGuests: 0,
      bedrooms: 0,
      beds: 0,
      isAvailable: true,
      serviceCharge: 0,
      timing: {
        checkIn: "14:00",
        checkOut: "12:00"
      },
      amenities: {
        wifi: false,
        airConditioning: false,
        kitchen: false,
        tv: false,
        pool: false,
        parking: false,
        security: false,
        breakfast: false
      },
      location: {
        latitude: 0,
        longitude: 0,
        address: ""
      }
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVilla(null);
  };

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Chỉ chấp nhận file ảnh',
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Kích thước file không được vượt quá 10MB',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Chỉ chấp nhận file ảnh',
          });
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Kích thước file không được vượt quá 10MB',
          });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
            {/* <ListBulletIcon className="h-5 w-5 text-gray-400 mr-2" /> */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg mx-auto p-8 max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none z-10"
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-center mb-6">
              {selectedVilla ? "Chỉnh sửa Villa" : "Thêm Villa mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên Villa</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    autoFocus
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">Giá cơ bản (VNĐ)</label>
                  <input
                    type="text"
                    name="basePrice"
                    value={formData.basePrice === 0 ? '' : formData.basePrice.toLocaleString('vi-VN')}
                    onChange={handleNumberChange}
                    placeholder="Nhập giá"
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.basePrice ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.basePrice && <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>}
                </div>
              </div>
              {/* Thông tin chi tiết */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size === 0 ? '' : formData.size}
                    onChange={handleNumberChange}
                    placeholder="Nhập diện tích"
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.size ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Phòng ngủ</label>
                  <input
                    type="text"
                    name="bedrooms"
                    value={formData.bedrooms === 0 ? '' : formData.bedrooms}
                    onChange={handleNumberChange}
                    placeholder="Nhập số phòng"
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.bedrooms ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>}
                </div>
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-700 mb-1">Giường</label>
                  <input
                    type="text"
                    name="beds"
                    value={formData.beds === 0 ? '' : formData.beds}
                    onChange={handleNumberChange}
                    placeholder="Nhập số giường"
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.beds ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.beds && <p className="mt-1 text-sm text-red-600">{errors.beds}</p>}
                </div>
                <div>
                  <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">Khách tối đa</label>
                  <input
                    type="text"
                    name="maxGuests"
                    value={formData.maxGuests === 0 ? '' : formData.maxGuests}
                    onChange={handleNumberChange}
                    placeholder="Nhập số khách"
                    required
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.maxGuests ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.maxGuests && <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p>}
                </div>
              </div>
              {/* Mô tả */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              {/* Địa chỉ */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location?.address || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors["location.address"] ? "border-red-500" : "border-gray-300"}`}
                />
                {errors["location.address"] && <p className="mt-1 text-sm text-red-600">{errors["location.address"]}</p>}
              </div>
              {/* Hình ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-2">
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="mb-2"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <span className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</span>
                  {formData.images.length > 0 && (
                    <div className="mt-2 flex gap-2">
                      <div className="relative group">
                        <img
                          src={formData.images[0]}
                          alt="Uploaded"
                          className="h-16 w-16 max-w-[64px] max-h-[64px] object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, images: [] }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                </div>
              </div>
              {/* Nút hành động */}
              <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-white z-10">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedVilla ? "Lưu" : "Lưu"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 