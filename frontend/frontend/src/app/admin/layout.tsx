"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  CreditCardIcon,
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  Bars3Icon, 
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const navigation = [
    { name: "Tổng quan", href: "/admin", icon: HomeIcon },
    { name: "Quản lý chỗ ở", href: "/admin/villas", icon: BuildingOfficeIcon },
    { name: "Quản lý đặt phòng", href: "/admin/bookings", icon: CalendarIcon },
    { name: "Quản lý thanh toán", href: "/admin/payments", icon: CreditCardIcon },
    { name: "Quản lý người dùng", href: "/admin/users", icon: UserGroupIcon },
    { name: "Đánh giá & phản hồi", href: "/admin/reviews", icon: ChatBubbleLeftRightIcon },
  ];

  // Set document title based on current page
  const currentPage = navigation.find(item => item.href === pathname);
  const pageTitle = currentPage ? `${currentPage.name} - Admin` : 'Admin Panel';

  // Format date for header
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <html lang="vi">
      <head>
        <title>{pageTitle} - Villa Ngọc Xanh</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased admin-panel bg-gray-50`}>
        <div className="h-full min-h-screen bg-gray-50">
          {/* Mobile sidebar overlay */}
          <div className="lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80 z-40" aria-hidden="true" 
                 style={{ display: sidebarOpen ? "block" : "none" }} 
                 onClick={() => setSidebarOpen(false)} />

            {/* Mobile sidebar panel */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
              <div className="flex h-16 shrink-0 items-center justify-between px-6">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold mr-2">VA</div>
                  <div className="text-lg font-semibold text-gray-900">Villa Admin</div>
                </div>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="mt-4 px-3">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          pathname === item.href
                            ? "text-blue-700"
                            : "text-gray-400 group-hover:text-blue-600"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Tài khoản
                  </div>
                  <a
                    href="#"
                    className="group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Cog6ToothIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600" />
                    Cài đặt
                  </a>
                  <a
                    href="#"
                    className="group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600" />
                    Đăng xuất
                  </a>
                </div>
              </nav>
            </div>
          </div>

          {/* Desktop sidebar */}
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 overflow-y-auto border-r border-gray-200 bg-white lg:block">
            <div className="flex h-16 shrink-0 items-center justify-between px-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold mr-2">VA</div>
                <div className="text-lg font-semibold text-gray-900">Villa Admin</div>
              </div>
            </div>
            <nav className="mt-4 px-3">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        pathname === item.href
                          ? "text-blue-700"
                          : "text-gray-400 group-hover:text-blue-600"
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Tài khoản
                </div>
                <a
                  href="#"
                  className="group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <Cog6ToothIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600" />
                  Cài đặt
                </a>
                <a
                  href="#"
                  className="group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-blue-600" />
                  Đăng xuất
                </a>
              </div>
            </nav>
          </aside>

          {/* Main content area */}
          <div className="lg:pl-64">
            {/* Top navigation bar */}
            <header className="sticky top-0 z-10 bg-white shadow-sm">
              <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left side - Mobile menu button and breadcrumb */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="lg:hidden -ml-2 rounded-md p-2 text-gray-500 hover:bg-gray-100"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="hidden md:block text-sm text-gray-500">
                    {formatDate(currentTime)}
                  </div>
                </div>
                
                {/* Right side - user controls */}
                <div className="flex items-center gap-4">
                  <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 relative">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">A</div>
                    <div className="ml-2 hidden md:block">
                      <div className="text-sm font-medium text-gray-900">Admin</div>
                      <div className="text-xs text-gray-500">admin@example.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="min-h-screen py-6">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <div>© 2023 Villa Ngọc Xanh. All rights reserved.</div>
                <div className="mt-2 md:mt-0">Version 1.0.0</div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
} 