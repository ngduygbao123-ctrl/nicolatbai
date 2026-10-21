export interface MenuItem {
  id: string;
  name: string;
  category: "signature" | "trending" | "fruit_tea" | "snacks";
  categoryName: string;
  priceM: number;
  priceL?: number;
  description: string;
  badge?: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const TOPPINGS: Topping[] = [
  { id: "black_pearl", name: "Trân châu đen dẻo", price: 5000, description: "Nấu mới mỗi 3 tiếng, dẻo dai đậm vị đường nâu" },
  { id: "white_pearl", name: "Trân châu trắng giòn", price: 5000, description: "Giòn sần sật mát lạnh nhai cực đã" },
  { id: "golden_pearl", name: "Trân châu hoàng kim", price: 7000, description: "Ngọt thanh tự nhiên, óng ánh đẹp mắt" },
  { id: "egg_pudding", name: "Pudding trứng flan mềm mịn", price: 8000, description: "Pudding béo ngậy tan ngay trong miệng, tự làm thủ công" },
  { id: "fruit_jelly", name: "Thạch trái cây giòn dai", price: 5000, description: "Thơm mùi trái cây nhiệt đới tươi mát" },
];

export const SUGAR_OPTIONS = [
  { value: "100%", label: "100% Đường", desc: "Ngọt bình thường, đậm vị truyền thống" },
  { value: "70%", label: "70% Đường", desc: "Ít ngọt vừa phải (Gu được yêu thích nhất)", recommended: true },
  { value: "50%", label: "50% Đường", desc: "Ngọt nhẹ thanh khiết, giữ trọn vị trà" },
];

export const ICE_OPTIONS = [
  { value: "100%", label: "100% Đá", desc: "Đá đầy mát lạnh uống ngay tại chỗ" },
  { value: "70%", label: "70% Đá", desc: "Ít đá, đậm đà mát dịu" },
  { value: "50%", label: "50% Đá", desc: "Khuyên dùng khi mang đi xa (đá tan không nhạt)", recommended: true },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "ts_truyen_thong",
    name: "Trà sữa truyền thống NicoLatBai",
    category: "signature",
    categoryName: "Trà sữa Signature",
    priceM: 22000,
    priceL: 32000,
    description: "Vị trà đậm đà, hậu vị chát nhẹ hòa quyện với bột béo vừa phải, không ngọt gắt. Công thức độc quyền NicoLatBai gây thương nhớ.",
    badge: "Bestseller Signature",
    image: "/src/assets/images/regenerated_image_1792340426163.png",
    rating: 4.9,
    reviewsCount: 348,
    isPopular: true
  },
  {
    id: "sua_tuoi_duong_den",
    name: "Sữa tươi trân châu đường đen",
    category: "trending",
    categoryName: "Sữa tươi xu hướng",
    priceM: 25000,
    priceL: 35000,
    description: "Sữa tươi thanh trùng béo ngậy kết hợp với sốt mật đường đen đậm đặc, trân châu nấu mới dẻo mềm óng ả.",
    badge: "Bestseller Xu Hướng",
    image: "/src/assets/images/regenerated_image_1792340427944.jpg",
    rating: 5.0,
    reviewsCount: 412,
    isPopular: true
  },
  {
    id: "tra_lai_dac_thom",
    name: "Trà lài đác thơm",
    category: "fruit_tea",
    categoryName: "Trà Trái Cây giải nhiệt",
    priceM: 20000,
    priceL: 30000,
    description: "Vị chua ngọt tự nhiên từ trái cây, cốt trà lài thơm ngát kết hợp cùng hạt đác rim dẻo giòn giải nhiệt ngày hè cực đã.",
    badge: "Giải Nhiệt Bật Tông",
    image: "/src/assets/images/regenerated_image_1792340428730.jpg",
    rating: 4.8,
    reviewsCount: 195,
    isPopular: true
  },
  {
    id: "tra_dau_tam",
    name: "Trà dâu tằm thanh mát",
    category: "fruit_tea",
    categoryName: "Trà Trái Cây giải nhiệt",
    priceM: 20000,
    priceL: 30000,
    description: "Vị thanh nhẹ, chua chua ngọt ngọt mọng nước từ dâu tằm tươi chọn lọc, dễ uống và cực kỳ tốt cho làn da.",
    badge: "Thanh Mát Tự Nhiên",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 168
  },
  {
    id: "banh_trang_tron",
    name: "Bánh tráng trộn NicoLatBai",
    category: "snacks",
    categoryName: "Món ăn vặt đi kèm",
    priceM: 15000,
    priceL: 25000,
    description: "Bánh tráng Tây Ninh dẻo mềm, bò khô rim, trứng cút bùi, xoài chua thái sợi, đậu phộng rang giòn cùng sốt bò me cay ngất ngây.",
    badge: "Ăn Vặt Nghiền Liền",
    image: "/src/assets/images/regenerated_image_1792340429347.png",
    rating: 4.9,
    reviewsCount: 280,
    isPopular: true
  },
  {
    id: "ca_vien_chien",
    name: "Cá viên chiên giòn rụm",
    category: "snacks",
    categoryName: "Món ăn vặt đi kèm",
    priceM: 15000,
    priceL: 25000,
    description: "Cá viên, bò viên, tôm viên, xúc xích chiên vàng ươm thơm nức mũi, xóc sốt cay chua ngọt hoặc tương đen đặc chế kèm dưa chua.",
    badge: "Nóng Hổi Vừa Thổi Vừa Ăn",
    image: "/src/assets/images/regenerated_image_1792340432871.jpg",
    rating: 4.7,
    reviewsCount: 220
  },
  {
    id: "khoai_tay_lac",
    name: "Khoai tây lắc phô mai giòn tan",
    category: "snacks",
    categoryName: "Món ăn vặt đi kèm",
    priceM: 15000,
    priceL: 25000,
    description: "Từng cọng khoai tây chiên giòn tan rụm, lắc ngập tràn bột phô mai béo mặn ngọt thơm lừng ai cũng thích mê.",
    badge: "Giòn Rụm Lắc Đẫm Phô Mai",
    image: "/src/assets/images/regenerated_image_1792340434808.webp",
    rating: 4.9,
    reviewsCount: 265
  }
];

export interface CartItem {
  cartId: string;
  item: MenuItem;
  size: "M" | "L";
  sugar: string;
  ice: string;
  toppings: Topping[];
  quantity: number;
  note: string;
  itemTotalPrice: number;
}

export const SHOP_INFO = {
  name: "Trà Sữa NicoLatBai",
  tagline: "Đậm Vị Trà - Thơm Vị Sữa - Trọn Vị Yêu Thương",
  address: "Đường số 20, phường An Nhơn, Quận Gò Vấp, TP. Hồ Chí Minh",
  hotline: "038.397.8888",
  zalo: "038.397.8888",
  openingHours: "08:30 - 22:30 (Mở cửa cả tuần)",
  freeshipKm: 3,
  domain: "trasuanicolatbai.com",
};
