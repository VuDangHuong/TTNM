"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Close menu when pathname changes (navigation occurs)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Add scroll event listener to detect when to apply sticky styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top bar with contact info - only visible when not scrolled */}
      <div
        className={`w-full bg-gray-50 py-1 transition-all duration-300 ${
          isScrolled ? "hidden" : "block"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center text-sm text-gray-600">
          <div className="hidden md:block">
            <span>Welcome to Villa Ngoc Xanh FLC Sam Son</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 mr-1" />
              <a
                href="tel:0908506631"
                className="hover:text-blue-600 transition"
              >
                0908 506 631
              </a>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              <a
                href="mailto:hqtuan43c@gmail.com"
                className="hover:text-blue-600 transition"
              >
                hqtuan43c@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation - sticky */}
      <div
        className={`w-full bg-white z-50 transition-all duration-300 ${
          isScrolled ? "fixed top-0 left-0 right-0 shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block relative">
              <Image
                src="/images/logo-flc.png"
                alt="Villa FLC Logo"
                width={120}
                height={50}
                className="h-auto w-auto max-h-[50px]"
                priority
              />
            </Link>
          </div>

          {/* Navigation links - desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="/">TRANG CHỦ</NavLink>
            <NavDropdown title="VILLA FLC" />
            {/* <NavDropdown title="KHÁCH SẠN" /> */}
            <NavLink href="/gioi-thieu">GIỚI THIỆU</NavLink>
            <NavLink href="/bai-viet">BÀI VIẾT</NavLink>
            <NavLink href="/lien-he">LIÊN HỆ</NavLink>
          </nav>

          {/* Book online button */}
          <div className="hidden lg:block">
            <Link
              href="/tim-kiem"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              ĐẶT NGAY
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-2">
              <div className="flex flex-col space-y-3">
                <MobileNavLink href="/" onClick={() => setIsMenuOpen(false)}>
                  TRANG CHỦ
                </MobileNavLink>
                <MobileNavLink
                  href="/tim-kiem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  VILLA FLC
                </MobileNavLink>
                {/* <MobileNavLink href="/khach-san" onClick={() => setIsMenuOpen(false)}>KHÁCH SẠN</MobileNavLink> */}
                <MobileNavLink
                  href="/gioi-thieu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  GIỚI THIỆU
                </MobileNavLink>
                <MobileNavLink
                  href="/bai-viet"
                  onClick={() => setIsMenuOpen(false)}
                >
                  BÀI VIẾT
                </MobileNavLink>
                <MobileNavLink
                  href="/lien-he"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LIÊN HỆ
                </MobileNavLink>
                <Link
                  href="/tim-kiem"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ĐẶT NGAY
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adjusted spacer height to match the increased logo size */}
      {isScrolled && <div className="h-[106px]"></div>}
    </header>
  );
};

// Desktop navigation link component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`font-bold text-sm ${
        isActive
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-700 hover:text-blue-600"
      } transition duration-300 py-2`}
    >
      {children}
    </Link>
  );
};

// Desktop dropdown navigation component
interface NavDropdownProps {
  title: string;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center font-bold text-sm text-gray-700 hover:text-blue-600 transition duration-300 py-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDownIcon className="ml-1 h-4 w-4" />
      </button>

      {/* Invisible bridge to prevent hover gap issue */}
      <div className="absolute left-0 h-2 w-full"></div>

      {/* Dropdown menu */}
      <div
        className={`absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1"
        }`}
      >
        <div className="py-2">
          <Link
            href="/tim-kiem"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          >
            Tổng hợp villa
          </Link>
        </div>
      </div>
    </div>
  );
};

// Mobile navigation link component
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  href,
  children,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-2 px-4 text-sm font-bold ${
        isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
      } border-l-4 ${isActive ? "border-blue-600" : "border-transparent"}`}
    >
      {children}
    </Link>
  );
};

export default Header;
