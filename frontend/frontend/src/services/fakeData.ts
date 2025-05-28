import { ExtendedVilla } from '@/app/(main)/villa/[slug]/VillaDetailContent';

// Define types from villa.service.ts
export interface Villa {
  _id: string;
  name: string;
  description: string;
  subDescription: string;
  images: string[];
  basePrice: number;
  size: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reviews?: {
    rating: number;
  }[];
  slug: string;
  discounts?: {
    _id: string;
    name: string;
    isActive: boolean;
    type: "percentage" | "fixed";
    value: number;
    startDate: string;
    endDate: string;
  }[];
}

export interface VillaResponse {
  villas: Villa[];
  total: number;
  pages: number;
}

// Define types from publicApi.ts
export interface PublicSlider {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
}

export interface PublicYoutubeVideo {
  _id: string;
  title: string;
  url: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface PublicPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  isVisible: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

// Fake Villas Data
export const fakeVillas: Villa[] = [
  {
    _id: '1',
    name: 'Villa Biển Xanh',
    description: 'Biệt thự sang trọng với tầm nhìn đẹp ra biển, thiết kế hiện đại và đầy đủ tiện nghi.',
    subDescription: 'Không gian nghỉ dưỡng lý tưởng cho gia đình',
    images: [
      '/images/villas/villa-01.jpg',
      '/images/villas/villa-01-2.jpg',
      '/images/villas/villa-01-3.jpg',
    ],
    basePrice: 8500000,
    size: 250,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    location: {
      latitude: 19.766453,
      longitude: 105.915643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 4.8 },
      { rating: 4.9 },
      { rating: 5.0 },
      { rating: 4.7 }
    ],
    slug: 'villa-bien-xanh',
    discounts: [
      {
        _id: '1d',
        name: 'Khuyến mãi Hè 2023',
        isActive: true,
        type: 'percentage',
        value: 15,
        startDate: '2023-06-01T00:00:00.000Z',
        endDate: '2023-08-31T23:59:59.999Z'
      }
    ]
  },
  {
    _id: '2',
    name: 'Villa Đồi Thông',
    description: 'Biệt thự nằm trên đồi cao với không gian thoáng đãng, view đẹp nhìn ra biển và đồi thông xanh.',
    subDescription: 'Không gian yên tĩnh, thư giãn tuyệt vời',
    images: [
      '/images/villas/villa-02.jpg',
      '/images/villas/villa-02-2.jpg',
      '/images/villas/villa-02-3.jpg',
    ],
    basePrice: 6800000,
    size: 220,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    location: {
      latitude: 19.767453,
      longitude: 105.916643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 4.6 },
      { rating: 4.8 },
      { rating: 4.7 }
    ],
    slug: 'villa-doi-thong',
    discounts: []
  },
  {
    _id: '3',
    name: 'Villa Hướng Dương',
    description: 'Biệt thự thiết kế hiện đại với ánh sáng tự nhiên tràn ngập, cảnh quan mở ra xung quanh.',
    subDescription: 'Không gian sống sang trọng giữa thiên nhiên',
    images: [
      '/images/villas/villa-03.jpg',
      '/images/villas/villa-03-2.jpg',
      '/images/villas/villa-03-3.jpg',
    ],
    basePrice: 12500000,
    size: 320,
    maxGuests: 10,
    bedrooms: 5,
    beds: 7,
    location: {
      latitude: 19.765453,
      longitude: 105.917643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 4.9 },
      { rating: 5.0 },
      { rating: 4.8 },
      { rating: 5.0 }
    ],
    slug: 'villa-huong-duong',
    discounts: [
      {
        _id: '2d',
        name: 'Ưu đãi mùa thu',
        isActive: true,
        type: 'fixed',
        value: 1500000,
        startDate: '2023-09-01T00:00:00.000Z',
        endDate: '2023-11-30T23:59:59.999Z'
      }
    ]
  },
  {
    _id: '4',
    name: 'Villa Ngọc Trai',
    description: 'Biệt thự cao cấp với thiết kế sang trọng, nội thất tinh tế và view đẹp ra biển.',
    subDescription: 'Trải nghiệm nghỉ dưỡng đẳng cấp 5 sao',
    images: [
      '/images/villas/villa-04.jpg',
      '/images/villas/villa-04-2.jpg',
      '/images/villas/villa-04-3.jpg',
    ],
    basePrice: 15000000,
    size: 350,
    maxGuests: 12,
    bedrooms: 6,
    beds: 8,
    location: {
      latitude: 19.764453,
      longitude: 105.914643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 5.0 },
      { rating: 4.9 },
      { rating: 5.0 },
      { rating: 4.8 },
      { rating: 4.9 }
    ],
    slug: 'villa-ngoc-trai',
    discounts: []
  },
  {
    _id: '5',
    name: 'Villa Hoàng Hôn',
    description: 'Biệt thự với vị trí đắc địa để ngắm hoàng hôn, thiết kế hiện đại kết hợp truyền thống.',
    subDescription: 'Không gian lý tưởng cho những buổi tối lãng mạn',
    images: [
      '/images/villas/villa-05.jpg',
      '/images/villas/villa-05-2.jpg',
      '/images/villas/villa-05-3.jpg',
    ],
    basePrice: 9200000,
    size: 270,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    location: {
      latitude: 19.763453,
      longitude: 105.913643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 4.7 },
      { rating: 4.8 },
      { rating: 4.6 }
    ],
    slug: 'villa-hoang-hon',
    discounts: [
      {
        _id: '3d',
        name: 'Khuyến mãi cuối tuần',
        isActive: true,
        type: 'percentage',
        value: 10,
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-12-31T23:59:59.999Z'
      }
    ]
  },
  {
    _id: '7',
    name: 'Villa Vọng Cảnh',
    description: 'Biệt thự có tầm nhìn 360 độ, thiết kế hiện đại với các không gian mở rộng.',
    subDescription: 'Cảm nhận không gian không giới hạn',
    images: [
      '/images/villas/villa-07.jpg',
      '/images/villas/villa-07-2.jpg',
      '/images/villas/villa-07-3.jpg',
    ],
    basePrice: 11000000,
    size: 300,
    maxGuests: 9,
    bedrooms: 5,
    beds: 6,
    location: {
      latitude: 19.761453,
      longitude: 105.911643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 4.9 },
      { rating: 4.8 },
      { rating: 5.0 },
      { rating: 4.7 }
    ],
    slug: 'villa-vong-canh',
    discounts: [
      {
        _id: '4d',
        name: 'Khuyến mãi đặc biệt',
        isActive: true,
        type: 'percentage',
        value: 20,
        startDate: '2023-07-01T00:00:00.000Z',
        endDate: '2023-07-31T23:59:59.999Z'
      }
    ]
  },
  {
    _id: '8',
    name: 'Villa Yên Bình',
    description: 'Biệt thự nhỏ xinh, ấm cúng với không gian riêng tư và yên tĩnh.',
    subDescription: 'Nơi lý tưởng để thư giãn và tĩnh tâm',
    images: [
      '/images/villas/villa-08.jpg',
      '/images/villas/villa-08-2.jpg',
      '/images/villas/villa-08-3.jpg',
    ],
    basePrice: 5500000,
    size: 180,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    location: {
      latitude: 19.760453,
      longitude: 105.910643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { rating: 4.6 },
      { rating: 4.7 },
      { rating: 4.5 }
    ],
    slug: 'villa-yen-binh',
    discounts: []
  }
];

// Fake Slider Data
export const fakeSliders: PublicSlider[] = [
  {
    _id: '1',
    title: 'Khu Nghỉ Dưỡng FLC Sầm Sơn',
    description: 'Thiên đường nghỉ dưỡng hàng đầu miền Bắc',
    imageUrl: '/images/slider/slider-1.jpg',
    order: 0,
    isActive: true
  },
  {
    _id: '2',
    title: 'Biệt Thự Biển FLC',
    description: 'Không gian sống đẳng cấp bên bờ biển',
    imageUrl: '/images/slider/slider-2.jpg',
    order: 1,
    isActive: true
  },
  {
    _id: '3',
    title: 'Villa Hồ Bơi Riêng',
    description: 'Trải nghiệm độc đáo với hồ bơi riêng tư',
    imageUrl: '/images/slider/slider-3.jpg',
    order: 2,
    isActive: true
  }
];

// Fake Posts Data
export const fakePosts: PublicPost[] = [
  {
    _id: '1',
    title: 'Top 10 Trải Nghiệm Không Thể Bỏ Lỡ Tại FLC Sầm Sơn',
    content: '<p>FLC Sầm Sơn không chỉ là nơi để nghỉ ngơi mà còn là điểm đến với nhiều hoạt động thú vị. Từ đánh golf trên sân golf tiêu chuẩn quốc tế đến thư giãn tại spa cao cấp, tắm biển với bãi cát trắng mịn và tham gia các hoạt động thể thao dưới nước...</p><p>Đặc biệt, du khách không nên bỏ lỡ cơ hội thưởng thức ẩm thực địa phương tại các nhà hàng sang trọng, tham quan các điểm du lịch lịch sử và văn hóa trong khu vực.</p>',
    thumbnail: '/images/posts/post-1.jpg',
    slug: 'top-10-trai-nghiem-khong-the-bo-lo-tai-flc-sam-son',
    isVisible: true,
    views: 1250,
    createdAt: '2023-06-15T10:30:00.000Z',
    updatedAt: '2023-06-15T10:30:00.000Z',
    seo: {
      title: 'Top 10 Trải Nghiệm Tại FLC Sầm Sơn',
      description: 'Khám phá những trải nghiệm tuyệt vời nhất tại khu nghỉ dưỡng FLC Sầm Sơn',
      keywords: 'FLC Sầm Sơn, trải nghiệm, du lịch, nghỉ dưỡng'
    }
  },
  {
    _id: '2',
    title: 'Lịch Sự Kiện Mùa Hè 2023 Tại FLC Sầm Sơn',
    content: '<p>Mùa hè này, FLC Sầm Sơn hứa hẹn sẽ là điểm đến sôi động với chuỗi sự kiện văn hóa, âm nhạc và thể thao đặc sắc. Từ các buổi hòa nhạc dưới ánh trăng trên bãi biển đến các giải đấu thể thao biển...</p><p>Đặc biệt, festival ẩm thực quốc tế sẽ mang đến cơ hội thưởng thức các món ăn đặc sắc từ nhiều nền văn hóa khác nhau. Ngoài ra, các hoạt động dành cho gia đình như workshop làm đồ thủ công, xem phim ngoài trời cũng sẽ được tổ chức thường xuyên.</p>',
    thumbnail: '/images/posts/post-2.jpg',
    slug: 'lich-su-kien-mua-he-2023-tai-flc-sam-son',
    isVisible: true,
    views: 876,
    createdAt: '2023-06-20T14:15:00.000Z',
    updatedAt: '2023-06-20T14:15:00.000Z',
    seo: {
      title: 'Sự Kiện Mùa Hè 2023 Tại FLC Sầm Sơn',
      description: 'Thông tin chi tiết về các sự kiện hấp dẫn diễn ra tại FLC Sầm Sơn mùa hè 2023',
      keywords: 'sự kiện, mùa hè, FLC Sầm Sơn, lịch trình'
    }
  },
  {
    _id: '3',
    title: 'Ưu Đãi Đặc Biệt Cho Đặt Phòng Sớm Mùa Thu 2023',
    content: '<p>Để chuẩn bị cho mùa du lịch thu 2023, FLC Sầm Sơn triển khai chương trình ưu đãi hấp dẫn cho khách hàng đặt phòng sớm. Với chính sách giảm giá lên đến 30% cho các đặt phòng trước 2 tháng...</p><p>Ngoài ra, khách hàng còn được tặng kèm nhiều dịch vụ giá trị như: trải nghiệm spa miễn phí, voucher ăn uống tại các nhà hàng trong khu nghỉ dưỡng và đặc biệt là tour tham quan các điểm du lịch nổi tiếng trong khu vực.</p>',
    thumbnail: '/images/posts/post-3.jpg',
    slug: 'uu-dai-dac-biet-cho-dat-phong-som-mua-thu-2023',
    isVisible: true,
    views: 543,
    createdAt: '2023-06-25T09:45:00.000Z',
    updatedAt: '2023-06-25T09:45:00.000Z',
    seo: {
      title: 'Ưu Đãi Đặt Phòng Sớm Mùa Thu 2023',
      description: 'Khám phá ưu đãi đặc biệt khi đặt phòng sớm tại FLC Sầm Sơn cho mùa thu 2023',
      keywords: 'ưu đãi, đặt phòng sớm, giảm giá, FLC Sầm Sơn, mùa thu'
    }
  },
  {
    _id: '4',
    title: 'Kinh Nghiệm Du Lịch FLC Sầm Sơn Dành Cho Gia Đình',
    content: '<p>FLC Sầm Sơn là điểm đến lý tưởng cho các gia đình muốn có kỳ nghỉ trọn vẹn. Bài viết này sẽ chia sẻ những kinh nghiệm hữu ích nhất khi đưa cả gia đình đến FLC Sầm Sơn, từ lựa chọn villa phù hợp đến các hoạt động phù hợp với mọi lứa tuổi...</p><p>Ngoài ra, chúng tôi còn gợi ý lịch trình chi tiết cho 3 ngày 2 đêm để gia đình bạn có thể tận hưởng trọn vẹn kỳ nghỉ mà không bỏ lỡ bất kỳ điểm tham quan nào.</p>',
    thumbnail: '/images/posts/post-4.jpg',
    slug: 'kinh-nghiem-du-lich-flc-sam-son-danh-cho-gia-dinh',
    isVisible: true,
    views: 985,
    createdAt: '2023-07-10T08:30:00.000Z',
    updatedAt: '2023-07-10T08:30:00.000Z',
    seo: {
      title: 'Kinh Nghiệm Du Lịch FLC Sầm Sơn Cho Gia Đình',
      description: 'Hướng dẫn chi tiết và kinh nghiệm du lịch FLC Sầm Sơn dành cho gia đình có trẻ nhỏ',
      keywords: 'du lịch gia đình, FLC Sầm Sơn, kinh nghiệm, trẻ em'
    }
  },
  {
    _id: '6',
    title: 'Hướng Dẫn Đặt Phòng Villa FLC Sầm Sơn Giá Tốt Nhất',
    content: '<p>Đặt phòng tại FLC Sầm Sơn có thể trở nên đơn giản và tiết kiệm hơn nếu bạn nắm vững một số bí quyết. Bài viết này sẽ hướng dẫn chi tiết cách đặt villa tại FLC Sầm Sơn với giá tốt nhất...</p><p>Chúng tôi chia sẻ thời điểm đặt phòng lý tưởng, các kênh đặt phòng uy tín, cách săn ưu đãi và những lưu ý quan trọng để chuyến đi của bạn trở nên hoàn hảo mà không tốn quá nhiều chi phí.</p>',
    thumbnail: '/images/posts/post-6.jpg',
    slug: 'huong-dan-dat-phong-villa-flc-sam-son-gia-tot-nhat',
    isVisible: true,
    views: 1320,
    createdAt: '2023-07-25T14:20:00.000Z',
    updatedAt: '2023-07-25T14:20:00.000Z',
    seo: {
      title: 'Hướng Dẫn Đặt Villa FLC Sầm Sơn Giá Tốt',
      description: 'Bí quyết đặt villa FLC Sầm Sơn với giá tốt nhất và những điều cần lưu ý',
      keywords: 'đặt phòng, villa, FLC Sầm Sơn, giá tốt, tiết kiệm'
    }
  }
];

// Fake Videos Data
export const fakeVideos: PublicYoutubeVideo[] = [
  {
    _id: '1',
    title: 'Khám Phá FLC Sầm Sơn - Thiên Đường Nghỉ Dưỡng Miền Bắc',
    url: 'https://www.youtube.com/watch?v=1uJNpypUnko',
    isActive: true,
    order: 0
  },
  {
    _id: '2',
    title: 'Villa FLC Sầm Sơn - Không Gian Sống Đẳng Cấp',
    url: 'https://www.youtube.com/watch?v=B4JXO5xqLd8',
    isActive: true,
    order: 1
  }
];

// Extended fake villas for villa detail page
export const fakeExtendedVillas: ExtendedVilla[] = [
  {
    _id: '1',
    name: 'Villa Biển Xanh',
    description: 'Biệt thự sang trọng với tầm nhìn đẹp ra biển, thiết kế hiện đại và đầy đủ tiện nghi. Không gian rộng rãi với nội thất cao cấp, phù hợp cho gia đình lớn hoặc nhóm bạn. Villa có sân vườn riêng, hồ bơi và khu BBQ ngoài trời.',
    subDescription: 'Không gian nghỉ dưỡng lý tưởng cho gia đình',
    images: [
      '/images/villas/villa-01.jpg',
      '/images/villas/villa-01-2.jpg',
      '/images/villas/villa-01-3.jpg',
      '/images/villas/villa-01-4.jpg',
    ],
    basePrice: 8500000,
    size: 250,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    location: {
      latitude: 19.766453,
      longitude: 105.915643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { 
        userId: 'user1',
        userName: 'Nguyễn Văn A',
        rating: 4.8,
        comment: 'Villa rất tuyệt, view đẹp, không gian thoáng đãng. Sẽ quay lại lần sau.',
        createdAt: '2023-05-15T10:30:00.000Z'
      },
      { 
        userId: 'user2',
        userName: 'Trần Thị B',
        rating: 4.9,
        comment: 'Dịch vụ rất tốt, phòng sạch sẽ, tiện nghi đầy đủ.',
        createdAt: '2023-06-20T14:15:00.000Z'
      },
      { 
        userId: 'user3',
        userName: 'Lê Văn C',
        rating: 5.0,
        comment: 'Trải nghiệm tuyệt vời, nhân viên thân thiện, chắc chắn sẽ giới thiệu cho bạn bè.',
        createdAt: '2023-07-10T09:45:00.000Z'
      }
    ],
    slug: 'villa-bien-xanh',
    discounts: [
      {
        _id: '1d',
        name: 'Khuyến mãi Hè 2023',
        isActive: true,
        type: 'percentage',
        value: 15,
        startDate: '2023-06-01T00:00:00.000Z',
        endDate: '2023-08-31T23:59:59.999Z'
      }
    ],
    priceByDay: [
      { day: 'Thứ 2', price: '8.500.000' },
      { day: 'Thứ 3', price: '8.500.000' },
      { day: 'Thứ 4', price: '8.500.000' },
      { day: 'Thứ 5', price: '8.500.000' },
      { day: 'Thứ 6', price: '9.500.000' },
      { day: 'Thứ 7', price: '10.500.000' },
      { day: 'Chủ nhật', price: '9.500.000' },
    ],
    amenities: {
      general: [
        { name: 'Wi-Fi', available: true },
        { name: 'TV', available: true },
        { name: 'Điều hòa', available: true },
        { name: 'Bể bơi riêng', available: true },
        { name: 'Bãi đỗ xe', available: true },
        { name: 'Ban công', available: true },
        { name: 'Máy giặt', available: true },
        { name: 'Sân vườn', available: true },
      ],
      kitchen: [
        { name: 'Tủ lạnh', available: true },
        { name: 'Lò vi sóng', available: true },
        { name: 'Bếp nấu', available: true },
        { name: 'Ấm đun nước', available: true },
        { name: 'Đồ nấu ăn', available: true },
        { name: 'Bát đĩa', available: true },
      ],
      common: [
        { name: 'Phòng khách', available: true },
        { name: 'Phòng ăn', available: true },
        { name: 'Khu BBQ', available: true },
      ],
      room: [
        { name: 'Khăn trải giường', available: true },
        { name: 'Gối', available: true },
        { name: 'Tủ quần áo', available: true },
        { name: 'Giường cỡ lớn', available: true },
      ],
      bathroom: [
        { name: 'Khăn tắm', available: true },
        { name: 'Máy sấy tóc', available: true },
        { name: 'Đồ vệ sinh cá nhân', available: true },
        { name: 'Vòi sen', available: true },
      ],
    },
    serviceCharge: 10,
    timing: {
      checkIn: '14:00',
      checkOut: '12:00',
    },
    isAvailable: true,
  },
  {
    _id: '2',
    name: 'Villa Đồi Thông',
    description: 'Biệt thự nằm trên đồi cao với không gian thoáng đãng, view đẹp nhìn ra biển và đồi thông xanh. Thiết kế tinh tế kết hợp giữa hiện đại và mộc mạc, mang đến cảm giác bình yên.',
    subDescription: 'Không gian yên tĩnh, thư giãn tuyệt vời',
    images: [
      '/images/villas/villa-02.jpg',
      '/images/villas/villa-02-2.jpg',
      '/images/villas/villa-02-3.jpg',
    ],
    basePrice: 6800000,
    size: 220,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    location: {
      latitude: 19.767453,
      longitude: 105.916643,
      address: 'FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa'
    },
    reviews: [
      { 
        userId: 'user4',
        userName: 'Phạm Thị D',
        rating: 4.6,
        comment: 'View đẹp, không khí trong lành, rất phù hợp để nghỉ dưỡng.',
        createdAt: '2023-05-10T10:30:00.000Z'
      },
      { 
        userId: 'user5',
        userName: 'Ngô Văn E',
        rating: 4.8,
        comment: 'Phòng ốc sạch sẽ, thiết kế đẹp, nhân viên phục vụ nhiệt tình.',
        createdAt: '2023-06-15T14:15:00.000Z'
      }
    ],
    slug: 'villa-doi-thong',
    discounts: [],
    priceByDay: [
      { day: 'Thứ 2', price: '6.800.000' },
      { day: 'Thứ 3', price: '6.800.000' },
      { day: 'Thứ 4', price: '6.800.000' },
      { day: 'Thứ 5', price: '6.800.000' },
      { day: 'Thứ 6', price: '7.800.000' },
      { day: 'Thứ 7', price: '8.800.000' },
      { day: 'Chủ nhật', price: '7.800.000' },
    ],
    amenities: {
      general: [
        { name: 'Wi-Fi', available: true },
        { name: 'TV', available: true },
        { name: 'Điều hòa', available: true },
        { name: 'Bể bơi riêng', available: false },
        { name: 'Bãi đỗ xe', available: true },
        { name: 'Ban công', available: true },
        { name: 'Máy giặt', available: true },
        { name: 'Sân vườn', available: true },
      ],
      kitchen: [
        { name: 'Tủ lạnh', available: true },
        { name: 'Lò vi sóng', available: true },
        { name: 'Bếp nấu', available: true },
        { name: 'Ấm đun nước', available: true },
        { name: 'Đồ nấu ăn', available: false },
        { name: 'Bát đĩa', available: true },
      ],
      common: [
        { name: 'Phòng khách', available: true },
        { name: 'Phòng ăn', available: true },
        { name: 'Khu BBQ', available: false },
      ],
      room: [
        { name: 'Khăn trải giường', available: true },
        { name: 'Gối', available: true },
        { name: 'Tủ quần áo', available: true },
        { name: 'Giường cỡ lớn', available: true },
      ],
      bathroom: [
        { name: 'Khăn tắm', available: true },
        { name: 'Máy sấy tóc', available: true },
        { name: 'Đồ vệ sinh cá nhân', available: true },
        { name: 'Vòi sen', available: true },
      ],
    },
    serviceCharge: 10,
    timing: {
      checkIn: '14:00',
      checkOut: '12:00',
    },
    isAvailable: true,
  }
];

// Helper function to convert regular Villa to ExtendedVilla
export const extendVilla = (villa: Villa): ExtendedVilla => {
  // Find the extended villa if it exists
  const existingExtended = fakeExtendedVillas.find(v => v._id === villa._id);
  
  // If we have pre-defined extended data, use it
  if (existingExtended) {
    return existingExtended;
  }
  
  // Create reviews in proper format if they exist
  const formattedReviews = villa.reviews?.map((r, index) => ({
    userId: `auto-${index}`,
    userName: `Khách hàng ${index + 1}`,
    rating: r.rating,
    comment: 'Dịch vụ tốt, villa sạch sẽ và tiện nghi.',
    createdAt: new Date(Date.now() - index * 86400000).toISOString() // Random dates
  })) || [];
  
  // Otherwise, create a new extended villa with default values
  return {
    ...villa,
    reviews: formattedReviews,
    priceByDay: [
      { day: 'Thứ 2', price: villa.basePrice.toLocaleString('vi-VN') },
      { day: 'Thứ 3', price: villa.basePrice.toLocaleString('vi-VN') },
      { day: 'Thứ 4', price: villa.basePrice.toLocaleString('vi-VN') },
      { day: 'Thứ 5', price: villa.basePrice.toLocaleString('vi-VN') },
      { day: 'Thứ 6', price: (villa.basePrice * 1.1).toLocaleString('vi-VN') },
      { day: 'Thứ 7', price: (villa.basePrice * 1.2).toLocaleString('vi-VN') },
      { day: 'Chủ nhật', price: (villa.basePrice * 1.1).toLocaleString('vi-VN') },
    ],
    amenities: {
      general: [
        { name: 'Wi-Fi', available: true },
        { name: 'TV', available: true },
        { name: 'Điều hòa', available: true },
        { name: 'Bể bơi riêng', available: villa.basePrice > 10000000 },
        { name: 'Bãi đỗ xe', available: true },
      ],
      kitchen: [
        { name: 'Tủ lạnh', available: true },
        { name: 'Lò vi sóng', available: true },
        { name: 'Bếp nấu', available: true },
      ],
      common: [
        { name: 'Phòng khách', available: true },
        { name: 'Phòng ăn', available: true },
      ],
      room: [
        { name: 'Khăn trải giường', available: true },
        { name: 'Gối', available: true },
        { name: 'Tủ quần áo', available: true },
      ],
      bathroom: [
        { name: 'Khăn tắm', available: true },
        { name: 'Đồ vệ sinh cá nhân', available: true },
      ],
    },
    serviceCharge: 10,
    timing: {
      checkIn: '14:00',
      checkOut: '12:00',
    },
    isAvailable: true,
  };
};

// Fake Data Service to replace API calls
export const fakeDataService = {
  // Get all villas with pagination
  async getVillas(): Promise<VillaResponse> {
    return {
      villas: fakeVillas,
      total: fakeVillas.length,
      pages: 1
    };
  },

  // Get villa by slug
  async getVillaBySlug(slug: string): Promise<Villa> {
    const villa = fakeVillas.find(v => v.slug === slug);
    if (!villa) {
      throw new Error(`Villa with slug ${slug} not found`);
    }
    return villa;
  },

  // Get villa by ID
  async getVillaById(id: string): Promise<Villa> {
    const villa = fakeVillas.find(v => v._id === id);
    if (!villa) {
      throw new Error(`Villa with ID ${id} not found`);
    }
    return villa;
  },

  // Search villas
  async searchVillas(params: any = {}): Promise<Villa[]> {
    let filteredVillas = [...fakeVillas];
    
    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredVillas = filteredVillas.filter(v => 
        v.name.toLowerCase().includes(query) || 
        v.description.toLowerCase().includes(query) ||
        (v.location?.address && v.location.address.toLowerCase().includes(query))
      );
    }
    
    if (params.minPrice !== undefined) {
      filteredVillas = filteredVillas.filter(v => v.basePrice >= params.minPrice);
    }
    
    if (params.maxPrice !== undefined) {
      filteredVillas = filteredVillas.filter(v => v.basePrice <= params.maxPrice);
    }
    
    if (params.minGuests !== undefined) {
      filteredVillas = filteredVillas.filter(v => v.maxGuests >= params.minGuests);
    }
    
    if (params.bedrooms !== undefined) {
      filteredVillas = filteredVillas.filter(v => v.bedrooms >= params.bedrooms);
    }
    
    return filteredVillas;
  },

  // Get similar villas by slug
  async getSimilarVillas(slug: string): Promise<Villa[]> {
    const currentVilla = fakeVillas.find(v => v.slug === slug);
    if (!currentVilla) {
      return [];
    }
    
    // Return villas with same number of bedrooms or similar price range
    return fakeVillas
      .filter(v => v._id !== currentVilla._id && 
        (v.bedrooms === currentVilla.bedrooms || 
         Math.abs(v.basePrice - currentVilla.basePrice) < 2000000))
      .slice(0, 3);
  },

  // Get public sliders
  async getPublicSliders(): Promise<PublicSlider[]> {
    return fakeSliders;
  },

  // Get latest posts
  async getLatestPosts(limit = 3): Promise<PublicPost[]> {
    return fakePosts.slice(0, limit);
  },

  // Get public videos
  async getPublicYoutubeVideos(limit = 10): Promise<PublicYoutubeVideo[]> {
    return fakeVideos.slice(0, limit);
  },
  
  // Get public posts with pagination
  async getPublicPosts(page = 1, limit = 12): Promise<{
    posts: PublicPost[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = fakePosts.slice(start, end);
    const total = fakePosts.length;
    const pages = Math.ceil(total / limit);

    return {
      posts,
      total,
      pages,
      currentPage: page
    };
  },
  
  // Get post by slug
  async getPostBySlug(slug: string): Promise<PublicPost> {
    const post = fakePosts.find(p => p.slug === slug);
    if (!post) {
      throw new Error(`Post with slug ${slug} not found`);
    }
    return post;
  },
  
  // Get related posts
  async getRelatedPosts(slug: string, limit = 3): Promise<PublicPost[]> {
    // Filter out the current post and return random posts
    const otherPosts = fakePosts.filter(p => p.slug !== slug);
    // Shuffle array and take requested number of posts
    return otherPosts
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  },

  // Admin APIs
  async getAdminUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakeUsers);
      }, 500);
    });
  },

  async getAdminBookings(): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakeBookings);
      }, 500);
    });
  },

  async getAdminPayments(): Promise<Payment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakePayments);
      }, 500);
    });
  },

  async getAdminReviews(): Promise<AdminReview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateAdminReviews());
      }, 500);
    });
  }
};

// Admin Data Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  createdAt: string;
  status: "active" | "inactive";
  lastLogin?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  villaId: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  paymentStatus: "pending" | "paid" | "refunded";
}

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  amount: number;
  method: "credit_card" | "bank_transfer" | "cash";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  createdAt: string;
  villaId: string;
  villaName: string;
}

export interface AdminReview {
  id: string;
  userId: string;
  userName: string;
  villaId: string;
  villaName: string;
  bookingId: string;
  rating: number;
  comment: string;
  response?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Fake Admin Data
export const fakeUsers: User[] = [
  {
    id: "u1",
    name: "Nguyễn Văn Quản Trị",
    email: "admin@example.com",
    phone: "0901234567",
    role: "admin",
    createdAt: "2023-01-15T08:30:00.000Z",
    status: "active",
    lastLogin: "2023-07-28T14:22:10.000Z"
  },
  {
    id: "u2",
    name: "Trần Thị Khách",
    email: "tran.thi.khach@example.com",
    phone: "0912345678",
    role: "user",
    createdAt: "2023-02-20T10:15:00.000Z",
    status: "active",
    lastLogin: "2023-07-25T09:45:22.000Z"
  },
  {
    id: "u3",
    name: "Lê Văn Người Dùng",
    email: "le.van.nguoidung@example.com",
    phone: "0923456789",
    role: "user",
    createdAt: "2023-03-10T15:45:00.000Z",
    status: "active",
    lastLogin: "2023-07-26T18:30:15.000Z"
  },
  {
    id: "u4",
    name: "Phạm Thị Hạnh",
    email: "pham.thi.hanh@example.com",
    phone: "0934567890",
    role: "user",
    createdAt: "2023-04-05T09:20:00.000Z",
    status: "inactive",
    lastLogin: "2023-06-15T11:20:45.000Z"
  },
  {
    id: "u5",
    name: "Hoàng Minh Tâm",
    email: "hoang.minh.tam@example.com",
    phone: "0945678901",
    role: "user",
    createdAt: "2023-05-12T11:10:00.000Z",
    status: "active",
    lastLogin: "2023-07-27T16:40:30.000Z"
  }
];

export const fakeBookings: Booking[] = [
  {
    id: "b1",
    userId: "u2",
    userName: "Trần Thị Khách",
    villaId: "1",
    villaName: "Villa Biển Xanh",
    checkIn: "2023-08-05T14:00:00.000Z",
    checkOut: "2023-08-08T12:00:00.000Z",
    guests: 4,
    totalPrice: 25500000, // 3 đêm x 8.5tr (giảm 15%)
    status: "confirmed",
    createdAt: "2023-07-20T08:15:00.000Z",
    paymentStatus: "paid"
  },
  {
    id: "b2",
    userId: "u3",
    userName: "Lê Văn Người Dùng",
    villaId: "2",
    villaName: "Villa Đồi Thông",
    checkIn: "2023-08-10T14:00:00.000Z",
    checkOut: "2023-08-12T12:00:00.000Z",
    guests: 3,
    totalPrice: 13600000, // 2 đêm x 6.8tr
    status: "pending",
    createdAt: "2023-07-22T10:30:00.000Z",
    paymentStatus: "pending"
  },
  {
    id: "b3",
    userId: "u5",
    userName: "Hoàng Minh Tâm",
    villaId: "3",
    villaName: "Villa Hướng Dương",
    checkIn: "2023-07-28T14:00:00.000Z",
    checkOut: "2023-07-30T12:00:00.000Z",
    guests: 8,
    totalPrice: 25000000, // 2 đêm x 12.5tr
    status: "completed",
    createdAt: "2023-07-15T14:20:00.000Z",
    paymentStatus: "paid"
  },
  {
    id: "b4",
    userId: "u4",
    userName: "Phạm Thị Hạnh",
    villaId: "4",
    villaName: "Villa Ngọc Trai",
    checkIn: "2023-08-15T14:00:00.000Z",
    checkOut: "2023-08-18T12:00:00.000Z",
    guests: 10,
    totalPrice: 45000000, // 3 đêm x 15tr
    status: "cancelled",
    createdAt: "2023-07-10T09:45:00.000Z",
    paymentStatus: "refunded"
  },
  {
    id: "b5",
    userId: "u2",
    userName: "Trần Thị Khách",
    villaId: "5",
    villaName: "Villa Hoàng Hôn",
    checkIn: "2023-09-01T14:00:00.000Z",
    checkOut: "2023-09-04T12:00:00.000Z",
    guests: 6,
    totalPrice: 30000000, // 3 đêm x 10tr
    status: "pending",
    createdAt: "2023-07-12T11:30:00.000Z",
    paymentStatus: "pending"
  }
];

// Fake payments data
export const fakePayments: Payment[] = [
  {
    id: "p1",
    bookingId: "b1",
    userId: "u2",
    userName: "Trần Thị Khách",
    amount: 25500000,
    method: "credit_card",
    status: "completed",
    transactionId: "tx_23893247",
    createdAt: "2023-07-20T09:30:00.000Z",
    villaId: "1",
    villaName: "Villa Biển Xanh"
  },
  {
    id: "p2",
    bookingId: "b2",
    userId: "u3",
    userName: "Lê Văn Người Dùng",
    amount: 13600000,
    method: "bank_transfer",
    status: "pending",
    transactionId: "tx_23893248",
    createdAt: "2023-07-22T11:15:00.000Z",
    villaId: "2",
    villaName: "Villa Đồi Thông"
  },
  {
    id: "p3",
    bookingId: "b3",
    userId: "u5",
    userName: "Hoàng Minh Tâm",
    amount: 25000000,
    method: "credit_card",
    status: "completed",
    transactionId: "tx_23893249",
    createdAt: "2023-07-15T15:45:00.000Z",
    villaId: "3",
    villaName: "Villa Hướng Dương"
  },
  {
    id: "p4",
    bookingId: "b4",
    userId: "u4",
    userName: "Phạm Thị Hạnh",
    amount: 45000000,
    method: "bank_transfer",
    status: "refunded",
    transactionId: "tx_23893250",
    createdAt: "2023-07-10T10:20:00.000Z",
    villaId: "4",
    villaName: "Villa Ngọc Trai"
  },
  {
    id: "p5",
    bookingId: "b5",
    userId: "u2",
    userName: "Trần Thị Khách",
    amount: 30000000,
    method: "bank_transfer",
    status: "pending",
    transactionId: "tx_23893251",
    createdAt: "2023-07-12T12:10:00.000Z",
    villaId: "5",
    villaName: "Villa Hoàng Hôn"
  }
];

// Helper function to generate admin reviews data
const generateAdminReviews = (): AdminReview[] => {
  const statuses: ("pending" | "approved" | "rejected")[] = ["pending", "approved", "rejected"];
  const reviews = [];
  
  // Tên người dùng Việt Nam
  const vietnameseNames = [
    "Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Châu", "Phạm Quốc Dũng", 
    "Hoàng Thị Giang", "Vũ Đình Hải", "Đinh Thị Hương", "Đặng Văn Khoa",
    "Bùi Thị Lan", "Ngô Văn Minh", "Đỗ Thị Ngọc", "Hồ Trọng Phú",
    "Trương Văn Quang", "Lý Thị Trang", "Mai Xuân Tùng", "Phan Thị Uyên"
  ];
  
  const villaNames = [
    "Biệt thự Hải Âu", "Villa Phượng Hoàng", "Biệt thự Đại Dương", 
    "Nhà Vườn Hoàng Gia", "Sky Villa", "Biệt thự Xanh", 
    "Villa Thiên Đường", "Biệt thự Panorama"
  ];
  
  const reviewComments = [
    "Chúng tôi rất hài lòng với kỳ nghỉ tại đây. Dịch vụ tuyệt vời, không gian sạch sẽ và đẹp đẽ. Chắc chắn sẽ quay lại!",
    "Biệt thự rất đẹp, view nhìn ra biển tuyệt vời. Tuy nhiên dịch vụ hơi chậm, đặc biệt là khi gọi nhân viên sửa chữa.",
    "Tuyệt vời! Không còn gì để chê. Nhân viên thân thiện, không gian rộng rãi và thoáng mát. Rất phù hợp cho gia đình có trẻ nhỏ.",
    "Kỳ nghỉ tuyệt vời, nhưng giá hơi cao so với dịch vụ. Nhà bếp thiếu một số dụng cụ nấu ăn cơ bản.",
    "Đặt phòng dễ dàng, nhận phòng nhanh chóng. Vị trí tuyệt vời, gần biển và các điểm ăn uống. Sẽ giới thiệu cho bạn bè.",
    "Biệt thự rất đẹp nhưng hơi xa trung tâm. Cần có phương tiện đi lại. Internet không ổn định là điểm trừ lớn nhất.",
    "Chúng tôi kỷ niệm 5 năm ngày cưới tại đây và đó là một lựa chọn hoàn hảo! Nhân viên chuẩn bị bánh kem và hoa rất đẹp.",
    "Phòng rộng rãi, sạch sẽ. Hồ bơi tuyệt vời. Tuy nhiên, âm thanh cách âm giữa các phòng chưa tốt lắm.",
    "Ngôi nhà đẹp như trong mơ! Chúng tôi đã có kỳ nghỉ gia đình tuyệt vời. Nhất định sẽ quay lại năm sau.",
    "Giá tốt cho chất lượng nhận được. Không gian yên tĩnh, thích hợp cho làm việc kết hợp nghỉ dưỡng.",
    "Chủ nhà rất thân thiện và giúp đỡ. Tuy nhiên, máy lạnh hoạt động không tốt khiến chúng tôi khó ngủ vào ban đêm.",
    "Đặt phòng và thanh toán dễ dàng. Nhà sạch sẽ, đầy đủ tiện nghi. Wifi mạnh, phù hợp cho cả gia đình."
  ];
  
  const responseComments = [
    "Cảm ơn quý khách đã đánh giá tích cực! Chúng tôi rất vui khi biết bạn đã có kỳ nghỉ tuyệt vời. Rất mong được đón tiếp quý khách trong tương lai!",
    "Xin chân thành cảm ơn phản hồi của quý khách. Chúng tôi rất tiếc về vấn đề bạn đã gặp phải và sẽ cải thiện dịch vụ trong thời gian tới.",
    "Chúng tôi xin ghi nhận ý kiến đóng góp và sẽ khắc phục ngay lập tức. Mong được đón tiếp quý khách trong lần tiếp theo với dịch vụ tốt hơn!",
    "Xin cảm ơn quý khách đã dành thời gian đánh giá. Ý kiến của bạn giúp chúng tôi ngày càng hoàn thiện dịch vụ tốt hơn.",
    "Chúng tôi rất vui khi biết bạn đã có kỳ nghỉ tuyệt vời! Nhân viên của chúng tôi luôn cố gắng mang đến trải nghiệm tốt nhất cho khách hàng."
  ];

  for (let i = 0; i < 20; i++) {
    const userName = vietnameseNames[Math.floor(Math.random() * vietnameseNames.length)];
    const villaName = villaNames[Math.floor(Math.random() * villaNames.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const rating = Math.floor(Math.random() * 5) + 1; // 1-5 rating
    const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
    
    // Random date within the last 3 months
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 3));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    
    const review: AdminReview = {
      id: `review-${i + 1}`,
      userId: `user-${Math.floor(Math.random() * 50) + 1}`,
      userName,
      villaId: `villa-${Math.floor(Math.random() * 8) + 1}`,
      villaName,
      bookingId: `booking-${Math.floor(Math.random() * 100) + 1}`,
      rating,
      comment,
      status,
      createdAt: date.toISOString(),
    };
    
    // Add response to some approved reviews
    if (status === "approved" && Math.random() > 0.4) {
      review.response = responseComments[Math.floor(Math.random() * responseComments.length)];
    }
    
    reviews.push(review);
  }
  
  return reviews;
};

// Admin interfaces
export interface AdminVilla {
  id: string;
  name: string;
  location: string;
  price: number;
  status: "available" | "booked" | "maintenance";
  rating: number;
  reviewCount: number;
  imageUrl: string;
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  villaId: string;
  villaName: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "canceled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  guestCount: number;
  specialRequests?: string;
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  bookingId: string;
  villaName: string;
  userName: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  method: "credit_card" | "bank_transfer" | "paypal" | "momo";
  transactionId: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "manager";
  status: "active" | "inactive" | "banned";
  verified: boolean;
  bookingsCount: number;
  joinedDate: string;
  lastLogin: string;
  phoneNumber?: string;
  avatarUrl?: string;
} 