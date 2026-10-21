import React, { useState } from "react";
import { 
  Bot, 
  ShoppingBag, 
  PhoneCall, 
  MapPin, 
  Truck, 
  Sparkles, 
  Star, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Search, 
  ChevronRight, 
  Heart, 
  Plus, 
  MessageCircle, 
  CheckCircle2, 
  Flame, 
  Award, 
  Share2,
  Info
} from "lucide-react";

import { 
  MENU_ITEMS, 
  TOPPINGS, 
  SUGAR_OPTIONS, 
  ICE_OPTIONS, 
  SHOP_INFO, 
  MenuItem, 
  CartItem 
} from "./data/menu";

import { AiCustomerServiceModal } from "./components/AiCustomerServiceModal";
import { GoogleSeoModal } from "./components/GoogleSeoModal";
import { ItemCustomizeModal } from "./components/ItemCustomizeModal";
import { CartDrawer } from "./components/CartDrawer";
import heroImg from "./assets/images/regenerated_image_1792340425515.jpg";
import { ITEM_IMAGE_MAP } from "./data/menuImages";

const APP_MENU_ITEMS: MenuItem[] = MENU_ITEMS.map(item => ({
  ...item,
  image: ITEM_IMAGE_MAP[item.id] || item.image
}));

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItemForCustomize, setSelectedItemForCustomize] = useState<MenuItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter items
  const filteredItems = activeCategory === "all" 
    ? APP_MENU_ITEMS 
    : APP_MENU_ITEMS.filter(item => item.category === activeCategory);

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return null;
        const singlePrice = item.itemTotalPrice / item.quantity;
        return {
          ...item,
          quantity: newQty,
          itemTotalPrice: singlePrice * newQty
        };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveItem = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Ask AI about a specific item
  const handleAskAiAboutItem = (item: MenuItem, sugar: string, ice: string) => {
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-200 text-xs py-2 px-4 shadow-sm border-b border-amber-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              Ưu Đãi Đặc Biệt
            </span>
            <span className="flex items-center gap-1 text-white">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <strong>FREESHIP 100%</strong> trong phạm vi bán kính <strong>3km</strong> từ Đường số 20, An Nhơn, Gò Vấp!
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsSeoModalOpen(true)}
              className="hover:text-white flex items-center gap-1 font-semibold text-amber-300 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Tên miền: <u>trasuanicolatbai.com</u> (Google.com)
            </button>
            <span className="text-amber-700 hidden sm:inline">•</span>
            <a
              href={`tel:${SHOP_INFO.hotline}`}
              className="hover:text-white flex items-center gap-1 font-bold text-amber-300"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Hotline: {SHOP_INFO.hotline}
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-2xl shadow-md border border-amber-700/50">
              🧋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-950">
                  NicoLatBai
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                  Gò Vấp
                </span>
              </div>
              <p className="text-xs text-amber-800 font-medium">
                Trà Sữa Đậm Vị & Ăn Vặt Giòn Cay
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-700">
            <a href="#menu" className="hover:text-amber-800 transition">Thực Đơn</a>
            <a href="#policy" className="hover:text-amber-800 transition">Freeship 3km</a>
            <a href="#standards" className="hover:text-amber-800 transition">Quy Chuẩn Đường Đá</a>
            <a href="#location" className="hover:text-amber-800 transition">Vị Trí Quán</a>
            <button
              onClick={() => setIsSeoModalOpen(true)}
              className="hover:text-blue-700 transition flex items-center gap-1 text-blue-900 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              Tên Miền .COM
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer border border-amber-600/40"
            >
              <div className="relative">
                <Bot className="w-4 h-4 text-amber-200 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
              </div>
              <span className="hidden sm:inline">AI CSKH NicoBot</span>
              <span className="sm:hidden">NicoBot</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-amber-100 hover:bg-amber-200/80 text-amber-950 p-2.5 rounded-2xl transition cursor-pointer border border-amber-300/60"
              title="Xem giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 text-amber-900" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scaleUp">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-amber-50/40 py-12 sm:py-20 border-b border-amber-100">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-300 blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-orange-200 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Thương Hiệu Trà Sữa Chuẩn Gu Giới Trẻ Gò Vấp</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-950 tracking-tight leading-[1.15]">
                Đậm Vị Trà – Thơm Vị Sữa
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900">
                  Freeship 3km Tận Cửa
                </span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Chào mừng bạn đến với <strong>Trà Sữa NicoLatBai</strong> tại Đường số 20, P. An Nhơn, Gò Vấp. Thưởng thức Trà sữa truyền thống đậm đà, Sữa tươi trân châu đường đen dẻo quánh, cùng trợ lý <strong>AI CSKH NicoBot</strong> túc trực 24/7 tư vấn chuẩn khẩu vị và chốt đơn hỏa tốc!
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <a
                  href="#menu"
                  className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-7 py-3.5 rounded-2xl text-base shadow-lg hover:shadow-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-300" />
                  <span>Xem Thực Đơn & Đặt Ngay</span>
                </a>

                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-300 font-bold px-6 py-3.5 rounded-2xl text-base shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <Bot className="w-5 h-5 text-amber-700" />
                  <span>Trò Chuyện Cùng AI CSKH</span>
                </button>
              </div>

              {/* Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-amber-200/80">
                <div className="bg-white p-3 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <div className="text-xs text-stone-500">Chính sách</div>
                  <div className="font-extrabold text-amber-900 text-sm mt-0.5">Freeship 3km</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <div className="text-xs text-stone-500">Đánh giá khách</div>
                  <div className="font-extrabold text-amber-900 text-sm mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> 4.9/5 (500+)
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <div className="text-xs text-stone-500">Thời gian pha</div>
                  <div className="font-extrabold text-amber-900 text-sm mt-0.5">5 - 10 Phút</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-amber-100 shadow-2xs text-center">
                  <div className="text-xs text-stone-500">Hỗ trợ khách</div>
                  <div className="font-extrabold text-emerald-700 text-sm mt-0.5">AI 24/7</div>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Image Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-amber-950 aspect-[4/5]">
                  <img
                    src={heroImg}
                    alt="Trà Sữa NicoLatBai"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  
                  {/* Floating AI badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-amber-200 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center">
                      <Bot className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-stone-900">AI NicoBot Trực Tuyến</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Sẵn sàng chốt đơn 24/7</div>
                    </div>
                  </div>

                  {/* Bottom Text Card */}
                  <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                    <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Signature Món Hot
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      Trà Sữa Truyền Thống NicoLatBai
                    </h3>
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      Cốt trà ủ mộc đậm đà kết hợp sữa béo ngậy vừa vặn, không ngọt gắt.
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-lg font-black text-amber-300">
                        22.000đ – 32.000đ
                      </div>
                      <button
                        onClick={() => setSelectedItemForCustomize(MENU_ITEMS[0])}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Thêm Ly Này
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub Floating Card (Sữa tươi trân châu đường đen) */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-amber-200 flex items-center gap-3 hidden sm:flex max-w-xs animate-bounce" style={{ animationDuration: "6s" }}>
                  <img
                    src="https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=200&q=80"
                    alt="Sữa tươi trân châu đường đen"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Sữa Tươi TC Đường Đen</div>
                    <div className="text-[11px] text-amber-700 font-bold">25.000đ - 35.000đ</div>
                    <div className="text-[10px] text-stone-500">Mật đường đặc quánh thơm nức</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3.5. WORKING HOURS & PROMOTIONS SHOWCASE */}
      <section className="py-10 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Working Hours Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    Giờ Làm Việc Của Quán
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Đang Mở Cửa
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-amber-950">
                  08:30 – 22:30 Hàng Ngày
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Quán mở cửa phục vụ xuyên suốt từ <strong>Thứ Hai đến Chủ Nhật</strong>, kể cả các ngày Lễ & Tết tại <strong>Đường số 20, phường An Nhơn, Gò Vấp</strong>.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-100 flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Trân châu nóng dẻo ra lò:</span>
                    <span className="font-bold text-amber-900">09:00 & 15:00</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-100 flex items-center justify-between">
                    <span className="font-semibold text-stone-700">Chốt đơn giao hàng online:</span>
                    <span className="font-bold text-amber-900">22:15 tối</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                <span className="text-stone-500">Hotline đặt bàn & ship:</span>
                <a href={`tel:${SHOP_INFO.hotline}`} className="font-black text-amber-800 hover:underline">
                  {SHOP_INFO.hotline}
                </a>
              </div>
            </div>

            {/* Promotions Banner */}
            <div className="lg:col-span-7 bg-gradient-to-br from-amber-900 via-amber-950 to-stone-900 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Chương Trình Khuyến Mãi Hot
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    Áp dụng hôm nay
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Ưu Đãi Bùng Nổ – Uống Thả Ga Không Lo Về Giá
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      Freeship 100% Bán Kính 3km
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Mọi đơn hàng từ Đường số 20, An Nhơn, Gò Vấp đều miễn phí giao tận cửa!
                    </p>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Combo Siêu Tiết Kiệm 35K
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Trà Sữa Truyền Thống + Bánh Tráng Trộn chỉ 35.000đ (Tiết kiệm 7k)!
                    </p>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-purple-400" />
                      Mua Nhiều Giảm Sâu
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Mua 5 ly giảm 15k • Mua 10 ly TẶNG 1 ly Trà sữa truyền thống Size M!
                    </p>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl border border-white/10 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      Happy Hour (13h – 16h)
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Tặng thêm 1 phần Trân Châu Trắng giòn sần sật cho mọi đơn hàng!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/15">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span>Hỏi AI NicoBot Về Khuyến Mãi</span>
                </button>
                <a
                  href="#menu"
                  className="text-xs text-amber-200 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Xem menu & chọn combo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. AI CSKH SCENARIOS BANNER & GUARD-RAIL SHOWCASE */}
      <section className="py-12 bg-amber-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Trí Tuệ Nhân Tạo Chuyên Nghiệp</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Trợ Lý AI CSKH Thông Minh – Thiết Kế Riêng Cho Quán
              </h2>
              <p className="text-amber-200/90 text-xs sm:text-sm mt-1 max-w-2xl">
                NicoBot được huấn luyện 4 kịch bản chuẩn: Tư vấn Best-seller, Báo Freeship 3km, Chỉnh đường đá và Chốt đơn hỏa tốc.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-5 py-3 rounded-2xl text-sm transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Trải Nghiệm Chat Cùng AI Ngay</span>
              </button>
            </div>
          </div>

          {/* 4 Core Scenarios Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Scenario 1 */}
            <div className="bg-amber-950/70 border border-amber-700/60 rounded-2xl p-4 space-y-2 hover:border-amber-400 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="font-bold text-sm text-amber-100">
                Tư Vấn Món Bán Chạy
              </h4>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Tự động giới thiệu <em>Trà sữa truyền thống đậm vị (22k)</em> và <em>Sữa tươi trân châu đường đen (25k)</em> cùng đồ ăn vặt.
              </p>
            </div>

            {/* Scenario 2 */}
            <div className="bg-amber-950/70 border border-amber-700/60 rounded-2xl p-4 space-y-2 hover:border-amber-400 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="font-bold text-sm text-amber-100">
                Freeship 3km & Vị Trí Quán
              </h4>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Nắm rõ vị trí tại <em>Đường số 20, An Nhơn, Gò Vấp</em>, kiểm tra bán kính 3km để miễn phí ship hoàn toàn cho khách.
              </p>
            </div>

            {/* Scenario 3 */}
            <div className="bg-amber-950/70 border border-amber-700/60 rounded-2xl p-4 space-y-2 hover:border-amber-400 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="font-bold text-sm text-amber-100">
                Tư Vấn Đường & Đá Mang Về
              </h4>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Chủ động gợi ý mức <em>50% - 70% đường</em> và <em>50% đá</em> để khi mang về nhà đá tan không bị nhạt nước.
              </p>
            </div>

            {/* Scenario 4 */}
            <div className="bg-amber-950/70 border border-amber-700/60 rounded-2xl p-4 space-y-2 hover:border-amber-400 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h4 className="font-bold text-sm text-amber-100">
                Chốt Đơn Hàng Chuẩn Xác
              </h4>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Tổng hợp món, size, khẩu vị, địa chỉ, SĐT, xác nhận Freeship và cung cấp hotline <strong>038.397.8888</strong> hỗ trợ tức thì.
              </p>
            </div>

          </div>

          {/* Strict Guardrail Rule Feature Highlight */}
          <div className="mt-6 bg-amber-950/90 border border-amber-600/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-xs text-amber-200">
                <strong className="text-white text-sm block">Đặc Quyền Bảo Mật Chủ Đề Trà Sữa:</strong>
                AI chỉ trả lời về trà sữa, menu, khẩu vị và dịch vụ quán. Mọi câu hỏi ngoài lề (toán học, lập trình, thời sự...) đều được từ chối và xin lỗi lịch sự!
              </div>
            </div>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="shrink-0 text-xs font-bold bg-amber-800 hover:bg-amber-700 text-amber-100 px-4 py-2 rounded-xl border border-amber-500/40 cursor-pointer transition"
            >
              Thử nghiệm bảo mật AI ngay
            </button>
          </div>
        </div>
      </section>

      {/* 5. MENU SECTION */}
      <section id="menu" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Thực Đơn Đầy Đủ & Bảng Giá
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-amber-950">
            Hương Vị Trà Thật – Trân Châu Nấu Mới
          </h2>
          <p className="text-stone-600 text-sm">
            Tất cả đồ uống đều được pha chế từ nguyên liệu sạch, cốt trà ủ mỗi ngày và topping dẻo dai giòn sần sật.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {[
            { id: "all", label: "Tất cả món" },
            { id: "signature", label: "🧋 Trà sữa Signature" },
            { id: "trending", label: "✨ Sữa tươi xu hướng" },
            { id: "fruit_tea", label: "🍓 Trà Trái Cây giải nhiệt" },
            { id: "snacks", label: "🍟 Món ăn vặt đi kèm" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-amber-800 text-white shadow-md"
                  : "bg-white text-stone-700 hover:bg-amber-100/70 border border-stone-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-amber-600/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                    {item.badge}
                  </span>
                )}

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-full px-2 py-0.5 text-xs font-bold text-amber-900 flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{item.rating}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider block">
                    {item.categoryName}
                  </span>
                  <h3 className="text-lg font-bold truncate text-white">
                    {item.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                      Giá chỉ từ:
                    </span>
                    <div className="text-base font-extrabold text-amber-900">
                      {item.priceM.toLocaleString("vi-VN")}đ
                      {item.priceL && (
                        <span className="text-xs text-stone-500 font-normal ml-1">
                          – {item.priceL.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAskAiAboutItem(item, "70%", "50%")}
                      title="Hỏi AI về món này"
                      className="p-2.5 rounded-xl border border-amber-300 text-amber-900 hover:bg-amber-50 transition cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedItemForCustomize(item)}
                      className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Chọn Món</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FLAVOR STANDARDS & TOPPINGS SECTION */}
      <section id="standards" className="py-16 bg-amber-50/70 border-y border-amber-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Khẩu Vị Theo Ý Bạn
            </span>
            <h2 className="text-3xl font-black text-amber-950">
              Quy Chuẩn Tùy Chọn Mức Đường & Đá
            </h2>
            <p className="text-stone-600 text-sm">
              Mỗi khách hàng đều có một gu thưởng thức riêng. AI và nhân viên NicoLatBai luôn chủ động ghi nhận để ly trà sữa trọn vị nhất!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Sugar Levels */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  🍬
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">Mức Độ Đường (Độ Ngọt)</h3>
                  <p className="text-xs text-stone-500">Tùy biến theo sở thích ngọt thanh hay ngọt đậm</p>
                </div>
              </div>

              <div className="space-y-3">
                {SUGAR_OPTIONS.map((opt) => (
                  <div key={opt.value} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-amber-950">{opt.label}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                    </div>
                    {opt.recommended && (
                      <span className="bg-amber-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                        Được chuộng nhất
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ice Levels */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
                  🧊
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">Mức Độ Đá (Độ Mát Lạnh)</h3>
                  <p className="text-xs text-stone-500">Giữ ly trà sữa luôn đậm đà, không bị nhạt nước</p>
                </div>
              </div>

              <div className="space-y-3">
                {ICE_OPTIONS.map((opt) => (
                  <div key={opt.value} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-stone-950">{opt.label}</span>
                      <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                    </div>
                    {opt.recommended && (
                      <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                        Khuyên dùng mang về
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Toppings Showcase */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-black text-xl text-amber-950">
                  Topping Gọi Thêm (Mức Giá 5.000đ – 10.000đ)
                </h3>
                <p className="text-xs text-stone-600">
                  Nấu mới mỗi ngày, bảo quản tiêu chuẩn giữ trọn vị dẻo dai bùi béo.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full self-start">
                Tự làm thủ công
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {TOPPINGS.map((top) => (
                <div
                  key={top.id}
                  className="p-4 rounded-2xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-950">{top.name}</span>
                    <span className="text-xs font-black text-amber-800">
                      +{top.price.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    {top.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 7. SHIPPING POLICY & STORE LOCATION */}
      <section id="policy" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-amber-900 via-amber-950 to-stone-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
                <Truck className="w-4 h-4 text-emerald-300" />
                <span>Chính Sách Giao Hàng Độc Quyền</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Miễn Phí Giao Hàng Bán Kính 3km
              </h2>

              <p className="text-sm sm:text-base text-amber-200/90 leading-relaxed">
                Quán Trà Sữa NicoLatBai tọa lạc tại <strong>Đường số 20, phường An Nhơn, Gò Vấp</strong>. Quán hỗ trợ giao tận bàn làm việc, phòng trọ, căn hộ, trường học hoàn toàn <strong>FREESHIP</strong> trong phạm vi 3km!
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <strong>Phạm vi ưu đãi:</strong> Miễn phí ship 100% trong bán kính 3km từ quán.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <strong>Khu vực xa hơn:</strong> Tính phí ship theo khoảng cách thực tế cực rẻ (AI xin địa chỉ cụ thể để báo giá chính xác).
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl text-sm transition cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Kiểm Tra Freeship Địa Chỉ Bạn</span>
                </button>

                <a
                  href={`tel:${SHOP_INFO.hotline}`}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-5 py-3 rounded-2xl text-sm transition flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Hotline: {SHOP_INFO.hotline}</span>
                </a>
              </div>
            </div>

            {/* Store Information Box */}
            <div id="location" className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-4">
              <h3 className="font-bold text-lg text-amber-200 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                Thông Tin Trà Sữa NicoLatBai
              </h3>

              <div className="space-y-3 text-xs text-amber-100">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-amber-300 font-semibold block">Địa chỉ quán:</span>
                  <p className="mt-0.5 text-white font-medium">{SHOP_INFO.address}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-amber-300 font-semibold block">Giờ mở cửa:</span>
                  <p className="mt-0.5 text-white font-medium">{SHOP_INFO.openingHours}</p>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-amber-300 font-semibold block">Hotline đặt hàng & phản ánh:</span>
                  <p className="mt-0.5 text-white font-black text-sm text-amber-300">{SHOP_INFO.hotline}</p>
                </div>

                <button
                  onClick={() => setIsSeoModalOpen(true)}
                  className="w-full bg-blue-600/80 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4" />
                  <span>Khai báo Tên Miền .COM & Google Maps</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. GOOGLE SEARCH & DOMAIN .COM CALLOUT */}
      <section className="py-12 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Tên Miền .COM Độc Quyền & Hiện Diện Trên Google.com</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                Sẵn Sàng Cho Tên Miền Riêng (trasuanicolatbai.com) & Top 1 Google
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Trang web đã được nhúng đầy đủ dữ liệu có cấu trúc Google Schema.org CafeOrRestaurant, thẻ OpenGraph và tối ưu công cụ tìm kiếm để người dùng gõ tìm <em>"trà sữa nicolatbai gò vấp"</em> là thấy ngay!
              </p>
            </div>

            <button
              onClick={() => setIsSeoModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Xem Mô Phỏng Kết Quả Google</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🧋</span>
                <span className="text-xl font-black text-white">Trà Sữa NicoLatBai</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Đậm vị trà – Thơm vị sữa – Trọn vị yêu thương. Điểm hẹn quen thuộc của các tín đồ trà sữa tại Gò Vấp.
              </p>
              <div className="text-xs text-amber-400 font-medium">
                Hotline hỗ trợ: {SHOP_INFO.hotline}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                Địa Chỉ & Giờ Mở Cửa
              </h4>
              <p className="text-stone-400">
                • {SHOP_INFO.address}
              </p>
              <p className="text-stone-400">
                • Giờ hoạt động: {SHOP_INFO.openingHours}
              </p>
              <p className="text-emerald-400 font-semibold">
                • Chính sách: Freeship hoàn toàn bán kính 3km
              </p>
            </div>

            {/* AI & Domain Info */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                Hỗ Trợ Khách Hàng AI
              </h4>
              <p className="text-stone-400">
                Trợ lý NicoBot AI túc trực 24/7 chỉ chuyên hỗ trợ về trà sữa và thực đơn quán.
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setIsSeoModalOpen(true)}
                  className="text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                >
                  Xem hướng dẫn cấu hình DNS tên miền .COM
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <div>
              © 2026 Trà Sữa NicoLatBai. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Đường số 20, P. An Nhơn, Gò Vấp</span>
              <span>•</span>
              <span>Hotline: 038.397.8888</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 10. FLOATING ACTION WIDGETS */}
      
      {/* Floating AI Button with Tooltip */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <div className="bg-amber-950 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-amber-700/60 flex items-center gap-2 animate-pulse cursor-pointer"
             onClick={() => setIsAiModalOpen(true)}>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>AI E-Commerce Agent: Tư vấn & chốt đơn ngay! 🧋</span>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-800 to-amber-950 hover:from-amber-900 hover:to-black text-white flex items-center justify-center shadow-2xl border-2 border-amber-300 transition-transform hover:scale-105 cursor-pointer relative"
          title="Mở Trợ Lý AI E-Commerce Shopping Agent NicoBot"
        >
          <Bot className="w-7 h-7 text-amber-200" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      </div>

      {/* Floating Cart Button (when items present) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-5 left-5 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs sm:text-sm cursor-pointer transition-transform hover:scale-105 border border-emerald-400"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Giỏ hàng ({cartItemsCount})</span>
            <span className="bg-emerald-800 px-2 py-0.5 rounded-lg text-emerald-100">
              {cartTotal.toLocaleString("vi-VN")}đ
            </span>
          </button>
        </div>
      )}

      {/* 11. MODALS & DRAWERS */}
      <AiCustomerServiceModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        onAddToCart={(item, shouldOpenCart) => {
          setCart(prev => [...prev, item]);
          if (shouldOpenCart) {
            setIsAiModalOpen(false);
            setIsCartOpen(true);
          }
        }}
        onOpenCart={() => {
          setIsAiModalOpen(false);
          setIsCartOpen(true);
        }}
      />

      <GoogleSeoModal
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
      />

      <ItemCustomizeModal
        item={selectedItemForCustomize}
        isOpen={!!selectedItemForCustomize}
        onClose={() => setSelectedItemForCustomize(null)}
        onAddToCart={handleAddToCart}
        onAskAiAboutItem={handleAskAiAboutItem}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenAiWithCart={() => setIsAiModalOpen(true)}
      />

    </div>
  );
}
