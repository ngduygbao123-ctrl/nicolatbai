import React, { useState } from "react";
import { 
  Globe, 
  Search, 
  CheckCircle, 
  ExternalLink, 
  X, 
  Copy, 
  Check, 
  MapPin, 
  Star, 
  Sparkles,
  Server,
  ShieldCheck
} from "lucide-react";
import { SHOP_INFO } from "../data/menu";

interface GoogleSeoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSeoModal: React.FC<GoogleSeoModalProps> = ({ isOpen, onClose }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"google_preview" | "domain_guide" | "google_console">("google_preview");

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-amber-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-300 shadow-inner">
              <Globe className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg sm:text-xl text-white">
                  Tên Miền .COM & Hiện Diện Trên Google.com
                </h3>
                <span className="text-xs bg-emerald-500/80 text-white font-semibold px-2 py-0.5 rounded-full">
                  SEO Chuẩn 100%
                </span>
              </div>
              <p className="text-xs text-blue-200/90">
                Hướng dẫn gắn tên miền riêng .com và đưa Trà Sữa NicoLatBai lên top tìm kiếm Google
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-2 text-sm">
          <button
            onClick={() => setActiveTab("google_preview")}
            className={`pb-2.5 px-3 font-semibold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "google_preview"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Search className="w-4 h-4" />
            Mô Phỏng Trên Google.com
          </button>
          <button
            onClick={() => setActiveTab("domain_guide")}
            className={`pb-2.5 px-3 font-semibold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "domain_guide"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            Cách Gắn Tên Miền .COM
          </button>
          <button
            onClick={() => setActiveTab("google_console")}
            className={`pb-2.5 px-3 font-semibold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "google_console"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Đưa Lên Google Search Console
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {activeTab === "google_preview" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Trang web của bạn đã được cấu hình trọn bộ thẻ SEO Google:</strong>
                  <p className="mt-1">
                    Bao gồm cấu trúc Schema.org <code>CafeOrRestaurant</code>, OpenGraph Facebook, thẻ meta tiêu đề, hotline <code>038.397.8888</code> và địa chỉ <code>Đường số 20, An Nhơn, Gò Vấp</code>. Dưới đây là hình ảnh thực tế khi khách hàng tìm kiếm trên Google:
                  </p>
                </div>
              </div>

              {/* Google Search Result Mockup */}
              <div className="border border-stone-200 rounded-2xl p-5 bg-white shadow-sm font-sans space-y-4">
                {/* Search Bar Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-1.5 font-bold text-xl text-stone-800 tracking-tighter">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-amber-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </div>
                  <div className="flex-1 bg-stone-100 rounded-full px-4 py-1.5 text-xs text-stone-700 flex items-center justify-between">
                    <span>trà sữa nicolatbai gò vấp freeship 3km</span>
                    <Search className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>

                {/* Organic Search Result */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <div className="w-4 h-4 rounded-full bg-amber-800 text-white flex items-center justify-center text-[9px] font-bold">
                      🧋
                    </div>
                    <span>https://trasuanicolatbai.com</span>
                    <span className="text-stone-300">›</span>
                    <span className="text-stone-500">thuc-don</span>
                  </div>

                  <h4 className="text-blue-800 hover:underline text-lg font-medium cursor-pointer">
                    Trà Sữa NicoLatBai - Freeship 3km Gò Vấp | Đặt Trực Tuyến & CSKH AI
                  </h4>

                  {/* Rich Snippet Stars */}
                  <div className="flex items-center gap-2 text-xs text-stone-600">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-stone-700">4.9</span>
                    <span>(348 đánh giá)</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">Đang mở cửa: 08:30 - 22:30</span>
                  </div>

                  <p className="text-sm text-stone-600 leading-normal">
                    Trà Sữa NicoLatBai tại Đường số 20, phường An Nhơn, Gò Vấp. Miễn phí giao hàng (Freeship) trong bán kính 3km. Trà sữa truyền thống đậm vị (22k), sữa tươi trân châu đường đen (25k), trà lài đác thơm và đồ ăn vặt. Trợ lý AI CSKH tư vấn 24/7!
                  </p>

                  {/* Sitelinks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 hover:bg-stone-100 transition cursor-pointer">
                      <div className="text-blue-700 font-medium text-xs">Thực Đơn Trà Sữa & Topping</div>
                      <div className="text-[11px] text-stone-500">Trà sữa truyền thống, trân châu hoàng kim, flan trứng...</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 hover:bg-stone-100 transition cursor-pointer">
                      <div className="text-blue-700 font-medium text-xs">Chính Sách Freeship 3km</div>
                      <div className="text-[11px] text-stone-500">Giao nhanh tận cửa từ Đường số 20, P. An Nhơn, Gò Vấp</div>
                    </div>
                  </div>
                </div>

                {/* Google Maps / Local Pack Preview */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 mt-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-stone-700 space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">Trà Sữa NicoLatBai (Google Doanh Nghiệp)</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Xác minh Maps
                      </span>
                    </div>
                    <p>Địa chỉ: Đường số 20, phường An Nhơn, Gò Vấp, TP.HCM</p>
                    <p>Hotline đặt món: <strong className="text-amber-900">{SHOP_INFO.hotline}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "domain_guide" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Bạn hoàn toàn có thể gắn tên miền .COM riêng (ví dụ: trasuanicolatbai.com)
                </h4>
                <p className="text-xs text-emerald-800">
                  Sau khi gắn tên miền, khách hàng chỉ cần gõ <code>trasuanicolatbai.com</code> là vào ngay website của quán!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">Bước 1: Mua tên miền .com</span>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                      Khoảng 200k - 280k/năm
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Bạn có thể mua tên miền <code>trasuanicolatbai.com</code> tại các nhà đăng ký uy tín như: Mắt Bão, PA Việt Nam, Namecheap, hoặc GoDaddy.
                  </p>
                </div>

                <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">Bước 2: Cấu hình bản ghi DNS (Domain Name Server)</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                      DNS Records
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Đăng nhập trang quản trị tên miền của bạn và thêm 2 bản ghi sau:
                  </p>
                  <div className="bg-stone-900 text-stone-200 p-3 rounded-xl text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Loại: <strong>CNAME</strong> | Tên: <strong>www</strong> | Giá trị: <strong>ghs.googlehosted.com</strong></span>
                      <button
                        onClick={() => copyToClipboard("ghs.googlehosted.com", "cname")}
                        className="text-stone-400 hover:text-white p-1"
                      >
                        {copiedText === "cname" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <span className="font-bold text-stone-900 text-sm">Bước 3: Tự động kích hoạt chứng chỉ bảo mật SSL (HTTPS)</span>
                  <p className="text-xs text-stone-600">
                    Hệ thống sẽ tự động cấp chứng chỉ bảo mật ổ khóa xanh <code>https://trasuanicolatbai.com</code> miễn phí trọn đời, đảm bảo an toàn tuyệt đối cho khách hàng khi đặt món.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "google_console" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Quy trình 3 bước để xuất hiện chính thức trên Google Search trong 24 giờ:
                </h4>
                <p className="text-xs text-amber-800">
                  Google cần được thông báo để cử bọ tìm kiếm (Googlebot) quét trang web và đưa vào cơ sở dữ liệu.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <span className="font-bold text-stone-900 text-sm">1. Truy cập Google Search Console</span>
                  <p className="text-xs text-stone-600">
                    Vào trang web chính thức của Google: <code>search.google.com/search-console</code> và đăng nhập bằng email Google của bạn (<code>{SHOP_INFO.name}</code>).
                  </p>
                </div>

                <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <span className="font-bold text-stone-900 text-sm">2. Khai báo sitemap.xml & Yêu cầu lập chỉ mục</span>
                  <p className="text-xs text-stone-600">
                    Nhập URL trang web của quán và bấm <strong>"Yêu cầu lập chỉ mục (Request Indexing)"</strong>. Google sẽ kiểm tra Schema quán ăn và hiển thị trên kết quả tìm kiếm.
                  </p>
                </div>

                <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-2xs space-y-2">
                  <span className="font-bold text-stone-900 text-sm">3. Đăng ký Google Doanh Nghiệp (Google Business Profile)</span>
                  <p className="text-xs text-stone-600">
                    Vào <code>business.google.com</code> để tạo hồ sơ quán "Trà Sữa NicoLatBai" ghim đúng tại <strong>Đường số 20, phường An Nhơn, Gò Vấp</strong>. Bất kỳ ai ở Gò Vấp tìm "trà sữa gần đây" sẽ thấy quán của bạn đầu tiên trên bản đồ!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Đã tích hợp sẵn Schema.org Restaurant & OpenGraph Card</span>
          </div>
          <button
            onClick={onClose}
            className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-xl font-medium transition cursor-pointer"
          >
            Đã hiểu, quay lại cửa hàng
          </button>
        </div>
      </div>
    </div>
  );
};
