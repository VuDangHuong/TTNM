"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <>

      <div className="bg-white">
        {/* Hero Banner Section */}
        <div className="relative h-[30vh] md:h-[40vh] lg:h-[50vh]">
          <Image
            src="/images/villa-ngoc-xanh.jpg"
            alt="FLC Sầm Sơn - Ngọc Xanh Villa"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12 lg:p-20">
            <div className="text-white">
              <p className="text-sm md:text-base font-light mb-2">
                Villa FLC Sầm Sơn - Căn Hộ Nghỉ Dưỡng
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Giới thiệu
              </h1>
            </div>
          </div>
        </div>

        {/* Breadcrumbs Navigation */}
        <div className="bg-gray-100 py-3">
          <div className="container mx-auto px-4">
            <nav className="text-sm">
              <ol className="flex flex-wrap items-center">
                <li className="flex items-center">
                  <Link href="/" className="text-gray-600 hover:text-blue-600">
                    Trang chủ
                  </Link>
                  <span className="mx-2 text-gray-400">/</span>
                </li>
                <li className="text-blue-600">Giới thiệu</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Content Section */}
            <div className="lg:w-2/3">
              {/* Tabs */}
              <div className="mb-8">
                <div className="flex flex-wrap">
                  <button
                    onClick={() => setActiveTab("tab1")}
                    className={`py-3 px-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                      activeTab === "tab1"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Giới thiệu Ngọc Xanh Villa
                  </button>
                  <button
                    onClick={() => setActiveTab("tab2")}
                    className={`py-3 px-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                      activeTab === "tab2"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Khu nghỉ dưỡng FLC Sầm Sơn
                  </button>
                  <button
                    onClick={() => setActiveTab("tab3")}
                    className={`py-3 px-4 font-medium text-sm md:text-base transition-colors duration-200 ${
                      activeTab === "tab3"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Tiện ích & Dịch vụ
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="prose max-w-none">
                {activeTab === "tab1" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Giới thiệu về Ngọc Xanh Villa
                    </h2>
                    <p>
                      Ngọc Xanh Villa là chuỗi biệt thự nghỉ dưỡng cao cấp nằm
                      trong Khu nghỉ dưỡng FLC Sầm Sơn. Hệ thống biệt thự này
                      bao gồm nhiều căn villa với thiết kế sang trọng, tiện nghi
                      hiện đại, mang đến trải nghiệm nghỉ dưỡng tuyệt vời cho du
                      khách. Trong đó, nổi bật nhất là các căn Ngọc Xanh 02 và
                      Ngọc Xanh 03 với quy mô 16 phòng ngủ, phù hợp cho các đoàn
                      khách lớn.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      Thông tin chi tiết về các căn nổi bật:
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-lg mb-6">
                      <h4 className="font-semibold mb-2">
                        Ngọc Xanh 02 & Ngọc Xanh 03:
                      </h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Số phòng: 16 phòng nghỉ rộng rãi, đầy đủ tiện nghi
                        </li>
                        <li>Bể bơi: Bể bơi chung 60m²</li>
                        <li>Khoảng cách tới biển: Cách bãi tắm riêng 500m</li>
                        <li>Vị trí: Nằm trong khu resort 5 sao FLC Sầm Sơn</li>
                        <li>
                          Phong cách thiết kế: Địa Trung Hải, hiện đại, sang
                          trọng
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      Tiện ích nổi bật:
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-none pl-0 mb-6">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>
                          Phòng khách rộng với thiết bị giải trí hiện đại
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>Phòng bếp đầy đủ dụng cụ nấu ăn</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>
                          Sân vườn thoáng mát, không gian BBQ ngoài trời
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>An ninh đảm bảo 24/7, có bãi đỗ xe rộng rãi</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>Dịch vụ dọn dẹp hàng ngày</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>Hỗ trợ tổ chức tiệc gia đình, sự kiện nhỏ</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>
                          Kết nối dễ dàng với các dịch vụ giải trí, mua sắm và
                          ẩm thực
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        <span>Mỗi phòng đều có ban công hoặc cửa sổ lớn</span>
                      </li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">
                      Dịch vụ kết nối hàng trăm villa tại FLC Sầm Sơn
                    </h3>
                    <p>
                      Ngoài Ngọc Xanh Villa, chúng tôi còn cung cấp và kết nối
                      hàng trăm villa tương đương với quy mô từ 4 đến 20 phòng
                      ngủ. Tất cả các villa đều có giá thuê chính chủ, đảm bảo
                      mức giá tốt nhất cho khách hàng. Các villa này có nhiều
                      phong cách thiết kế khác nhau, từ hiện đại, cổ điển đến
                      tối giản, phù hợp với từng nhu cầu của du khách.
                    </p>

                    <div className="bg-blue-50 p-5 rounded-lg mt-6">
                      <h4 className="font-semibold mb-2">
                        Lợi ích khi đặt villa qua hệ thống của chúng tôi:
                      </h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Đa dạng sự lựa chọn về diện tích, thiết kế và vị trí
                          trong Khu FLC Sầm Sơn
                        </li>
                        <li>
                          Tất cả các villa đều có tiện ích tương đương Ngọc Xanh
                          Villa
                        </li>
                        <li>
                          Đảm bảo giá thuê chính chủ, không qua trung gian
                        </li>
                        <li>
                          Hỗ trợ tư vấn và đặt villa nhanh chóng, chuyên nghiệp
                        </li>
                        <li>Dịch vụ hỗ trợ 24/7 trong suốt kỳ nghỉ</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "tab2" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Giới thiệu về Khu nghỉ dưỡng FLC Sầm Sơn
                    </h2>
                    <p>
                      FLC Sầm Sơn là khu nghỉ dưỡng 5 sao hàng đầu tại Thanh
                      Hóa, được biết đến với hệ thống tiện ích đa dạng, phù hợp
                      cho cả nghỉ dưỡng gia đình và hội nghị, sự kiện.
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">
                          Tiện ích tại FLC Sầm Sơn:
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Bãi biển riêng:
                              </span>{" "}
                              Được quản lý chuyên nghiệp, sạch đẹp, an toàn
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Sân golf 18 hố:
                              </span>{" "}
                              Đẳng cấp quốc tế, thiết kế bởi Nicklaus Design
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Trung tâm hội nghị quốc tế:
                              </span>{" "}
                              Sức chứa lên đến 1.300 khách
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Hệ thống khách sạn 5 sao:
                              </span>{" "}
                              FLC Grand Hotel, FLC Luxury Resort
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Bể bơi nước mặn:
                              </span>{" "}
                              Diện tích lên tới 5.100m², lớn nhất Việt Nam
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-lg">
                        <h3 className="text-xl font-semibold mb-3">
                          Dịch vụ & Giải trí:
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Spa & Wellness Center:
                              </span>{" "}
                              Dịch vụ chăm sóc sức khỏe, làm đẹp cao cấp
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Hệ thống nhà hàng, quán bar:
                              </span>{" "}
                              Đa dạng ẩm thực Á - Âu
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Khu vui chơi giải trí:
                              </span>{" "}
                              Công viên nước mini, khu vui chơi trẻ em, sân
                              tennis
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Dịch vụ buggy:
                              </span>{" "}
                              Xe điện di chuyển trong khuôn viên
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <div>
                              <span className="font-medium">
                                Các hoạt động giải trí khác:
                              </span>{" "}
                              Yoga, gym, lớp học nấu ăn, thể thao dưới nước
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-3">
                        Hệ thống an ninh:
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          Camera giám sát 24/7 trong toàn bộ khu nghỉ dưỡng
                        </li>
                        <li>
                          Nhân viên bảo vệ chuyên nghiệp tuần tra thường xuyên
                        </li>
                        <li>Hệ thống kiểm soát ra vào khu vực</li>
                        <li>Bãi đỗ xe rộng rãi với nhân viên trông giữ</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "tab3" && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Tiện ích Villa FLC
                    </h2>
                    <p>
                      Các villa trong khu FLC Sầm Sơn đều được hưởng trọn vẹn
                      tiện ích của khu nghỉ dưỡng, mang đến trải nghiệm nghỉ
                      dưỡng cao cấp và đầy đủ cho du khách.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Đặc tính tòa nhà:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Biệt thự đơn lập, không gian riêng tư</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Internet và truyền hình miễn phí</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Wi-Fi phủ sóng toàn bộ villa</span>
                          </li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">
                          Chỗ đậu xe:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Miễn phí, đỗ xe ngay tại cổng villa</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Có bảo vệ trông giữ 24/24</span>
                          </li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">
                          Dịch vụ giải trí & gia đình:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Karaoke</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Khu vui chơi trẻ em, công viên, chợ quê</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Khu vực picnic, bàn ghế ngoài trời</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Gần biển, khu vực bãi tắm riêng</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Hồ bơi riêng, tiện nghi BBQ</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-3">Nhà bếp:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Bếp từ, bếp gas công nghiệp, bếp nướng BBQ
                            </span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Lò vi sóng, tủ lạnh, dụng cụ nấu ăn đầy đủ
                            </span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Bàn ăn, cốc chén, ly rượu</span>
                          </li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">
                          Phòng ngủ:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Giường đệm, điều hòa, tivi, bàn trang điểm
                            </span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Tủ quần áo, bình nước siêu tốc</span>
                          </li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">
                          Phòng tắm:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Bồn tắm, vòi hoa sen, bồn rửa mặt</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Khăn tắm, dép, máy sấy tóc</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Xà phòng, dầu gội, bàn chải đánh răng</span>
                          </li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-6 mb-3">
                          Hoạt động giải trí:
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>Bãi biển miễn phí</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span>
                              Bể bơi nước mặn, sân tennis, sân golf (tính phí)
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-lg mt-8">
                      <h3 className="text-xl font-semibold mb-3">Lưu ý:</h3>
                      <p>
                        Villa FLC Sầm Sơn không có phòng gym và dịch vụ spa
                        riêng, nhưng khách có thể sử dụng các tiện ích này tại
                        khu khách sạn FLC Grand Hotel hoặc Luxury Resort.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-semibold mb-4">Đặt villa ngay</h3>
                <p className="text-gray-600 mb-6">
                  Liên hệ với chúng tôi để được tư vấn và đặt villa phù hợp nhất
                  với nhu cầu của bạn.
                </p>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium mb-2">Hotline đặt phòng</h4>
                    <a
                      href="tel:0908506631"
                      className="text-blue-600 font-bold text-lg"
                    >
                      0908.506.631
                    </a>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium mb-2">Email</h4>
                    <a
                      href="mailto:hqtuan43c@gmail.com"
                      className="text-blue-600"
                    >
                      hqtuan43c@gmail.com
                    </a>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium mb-2">Zalo</h4>
                    <p className="text-blue-600">0908.506.631</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/lien-he"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Gửi yêu cầu đặt phòng
                  </Link>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium mb-3">Chúng tôi chấp nhận</h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-white p-2 rounded-md">
                      <Image
                        src="/momo.svg"
                        alt="MoMo"
                        width={40}
                        height={25}
                      />
                    </div>
                    <div className="bg-white p-2 rounded-md">
                      <Image
                        src="/vnpay.svg"
                        alt="VNPay"
                        width={40}
                        height={25}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
