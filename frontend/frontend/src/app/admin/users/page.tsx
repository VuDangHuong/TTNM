"use client";

import { useState, useEffect } from "react";
import { fakeDataService, User } from "@/services/fakeData";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { userSchema, newUserSchema, UserFormData, NewUserFormData } from '@/validations/user.validation';

// Skeleton loader component
const UsersSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-6"></div>

    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-3/4"></div>
      <div className="bg-gray-200 h-10 rounded-md w-full sm:w-1/4"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => (
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
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="bg-gray-200 rounded-md h-8 w-8"></div>
              <div className="bg-gray-200 rounded-md h-8 w-8"></div>
              <div className="bg-gray-200 rounded-md h-8 w-8"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData | NewUserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fakeDataService.getAdminUsers();
        setUsers(data);
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const searchMatches =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const roleMatches = filterRole === "all" || user.role === filterRole;

    return searchMatches && roleMatches;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa đăng nhập";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    console.log('Editing user data:', user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as "admin" | "user",
      status: user.status as "active" | "inactive",
      password: '',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      password: '',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      password: '',
    });
    setErrors({});
  };

 const handleSubmitUser = (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  try {
    let validatedData;
    const dataToValidate = selectedUser && formData.password === '' ? { ...formData, password: undefined } : formData;

    if (selectedUser) {
      validatedData = userSchema.parse(dataToValidate);
    } else {
      validatedData = newUserSchema.parse(dataToValidate);
    }

    const emailExists = users.some(user => 
      user.email === validatedData.email && (!selectedUser || user.id !== selectedUser.id)
    );

    if (emailExists) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email đã tồn tại vui lòng nhập email khác.'
      }));
      Swal.fire({
        icon: 'error',
        title: 'Lỗi nhập liệu!',
        text: 'Email đã tồn tại vui lòng nhập email khác.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (selectedUser) {
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          const updatedUser = {
            ...user,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            role: validatedData.role,
            status: validatedData.status,
          };
          if (validatedData.password !== undefined) {
            (updatedUser as any).password = validatedData.password;
          }
          return updatedUser;
        }
        return user;
      });
      setUsers(updatedUsers);
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        status: validatedData.status,
        createdAt: new Date().toISOString(),
        lastLogin: undefined,
      };
      setUsers([...users, newUser]);
    }

    setShowModal(false);
    setSelectedUser(null);

    Swal.fire({
      icon: 'success',
      title: selectedUser ? 'Đã cập nhật thành công!' : 'Đã thêm mới thành công!',
      text: selectedUser 
        ? 'Thông tin người dùng đã được cập nhật.' 
        : 'Người dùng mới đã được thêm .',
      confirmButtonText: 'OK',
    });

  } catch (error) {
    console.error('Full validation error object:', error);
    if (error instanceof Error) {
      const zodError = error as any;
      const newErrors: Record<string, string> = {};
      if (zodError.errors) {
        zodError.errors.forEach((err: any) => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
      }
      setErrors(newErrors);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi nhập liệu!',
        text: 'Vui lòng kiểm tra lại thông tin bạn đã nhập.',
        confirmButtonText: 'OK',
      });
    }
  }
};

  const handleDeleteUser = (id: string) => {
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
        setUsers(users.filter(user => user.id !== id));
        Swal.fire('Đã xóa!', `Người dùng ID ${id} đã bị xóa.`, 'success');
      }
    });
  };

  const handleToggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const newStatus = user.status === "active" ? "inactive" : "active";
    const statusLabel = newStatus === "active" ? "hoạt động" : "ngưng hoạt động";

    Swal.fire({
      title: 'Xác nhận chuyển trạng thái',
      text: `Bạn có chắc chắn muốn chuyển trạng thái người dùng thành "${statusLabel}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, chuyển trạng thái',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = users.map(user =>
          user.id === id
            ? { ...user, status: newStatus as "active" | "inactive" }
            : user
        );
        setUsers(updatedUsers);

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: `Trạng thái người dùng đã được chuyển thành "${statusLabel}"!`,
          confirmButtonText: 'OK',
        });
      }
    });
  };

  if (loading) {
    return <UsersSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý người dùng</h1>
          <p className="text-sm text-gray-500">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Thêm người dùng
          </button>
        </div>
      </div>

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
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterRole}
              onChange={handleRoleFilterChange}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Người dùng đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quản trị viên</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === "admin").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách người dùng</h2>
          <div className="text-sm text-gray-500">Hiển thị {filteredUsers.length} người dùng</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đăng nhập gần nhất
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Thành viên từ {formatDate(user.createdAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center mb-1">
                      <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                      }`}>
                      {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full ${user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}>
                      {user.status === "active"
                        ? <><CheckCircleIcon className="mr-1 h-4 w-4" /> Đang hoạt động</>
                        : <><XCircleIcon className="mr-1 h-4 w-4" /> Không hoạt động</>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-1 rounded-full ${user.status === "active"
                          ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                          : "text-green-600 hover:text-green-900 hover:bg-green-50"
                          }`}
                        title={user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                      >
                        {user.status === "active" ? <XCircleIcon className="h-5 w-5" /> : <CheckCircleIcon className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Xóa"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <UserGroupIcon className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-base font-medium">Không tìm thấy người dùng nào</p>
                      <p className="text-gray-400 text-sm mt-1">Thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-auto p-8 max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none z-10"
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-center mb-6">
              {selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </h2>
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={(formData as UserFormData).name}
                  onChange={(e) => setFormData({ ...(formData as UserFormData), name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={(formData as UserFormData).email}
                  onChange={(e) => setFormData({ ...(formData as UserFormData), email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={(formData as UserFormData).phone}
                  onChange={(e) => setFormData({ ...(formData as UserFormData), phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select
                    name="role"
                    id="role"
                    value={(formData as UserFormData).role}
                    onChange={(e) => setFormData({ ...(formData as UserFormData), role: e.target.value as "admin" | "user" })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.role ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                  {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    name="status"
                    id="status"
                    value={(formData as UserFormData).status}
                    onChange={(e) => setFormData({ ...(formData as UserFormData), status: e.target.value as "active" | "inactive" })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.status ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                  {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                </div>
              </div>
              {!selectedUser && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={(formData as NewUserFormData).password}
                    onChange={(e) => setFormData({ ...(formData as NewUserFormData), password: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                {/* <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button> */}
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedUser ? "Lưu" : "Lưu"}
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