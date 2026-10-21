import React, { useState } from "react";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  MapPin, 
  PhoneCall, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { CartItem, SHOP_INFO } from "../data/menu";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onOpenAiWithCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenAiWithCart
}) => {
  const [address, setAddress] = useState<string>("Số 123 Đường số 20, P. An Nhơn, Gò Vấp");
  const [phone, setPhone] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [distanceKm, setDistanceKm] = useState<number>(1.8);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);

  if (!isOpen) return null;

  const itemsTotal = cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  // Freeship calculation based on 3km policy
  const isFreeship = distanceKm <= SHOP_INFO.freeshipKm;
  const shippingFee = isFreeship ? 0 : Math.round((distanceKm - 3) * 5000 + 15000);
  const grandTotal = itemsTotal + shippingFee;

  const handleCheckoutDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại để quán liên hệ giao hàng nha ạ!");
      return;
    }
    setIsOrdered(true);
  };

  const handleResetOrder = () => {
    setIsOrdered(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-amber-200 animate-slideLeft">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-200">
              <Truck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Giỏ Hàng Của Bạn</h3>
              <p className="text-xs text-amber-200">
                {cart.length === 0 ? "Chưa có món nào" : `${cart.length} món ngon đang chờ`}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {isOrdered ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-stone-900">
                Đặt Hàng Thành Công!
              </h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                Dạ, Trà Sữa NicoLatBai đã tiếp nhận đơn của anh/chị <strong>{customerName || "quý khách"}</strong>.
                Quán đang bắt đầu pha chế và giao ngay đến:
                <br />
                <span className="font-semibold text-amber-950">{address}</span> (SĐT: {phone}).
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 text-left space-y-2">
                <div className="flex justify-between">
                  <span>Khoảng cách:</span>
                  <span className="font-bold">{distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-emerald-700">
                    {isFreeship ? "FREESHIP 100% (<=3km)" : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-amber-200 pt-2 font-bold text-sm">
                  <span>Tổng thanh toán khi nhận hàng:</span>
                  <span className="text-amber-900">{grandTotal.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500">
                Nếu cần thay đổi gấp, quý khách vui lòng gọi ngay hotline:{" "}
                <strong className="text-amber-900">{SHOP_INFO.hotline}</strong>
              </p>
              <button
                onClick={handleResetOrder}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 rounded-xl transition cursor-pointer"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-5xl">🧋</div>
              <h4 className="font-bold text-stone-700">Giỏ hàng của bạn đang trống</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Hãy chọn món Trà sữa truyền thống, Sữa tươi trân châu đường đen hoặc đồ ăn vặt để thưởng thức nhé!
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Khám phá thực đơn
              </button>
            </div>
          ) : (
            <>
              {/* Shipping Policy Highlight Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs ${
                isFreeship 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                  : "bg-amber-50 border-amber-200 text-amber-950"
              }`}>
                <Truck className={`w-5 h-5 shrink-0 mt-0.5 ${isFreeship ? "text-emerald-600" : "text-amber-600"}`} />
                <div className="flex-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Chính sách Freeship Bán Kính 3km</span>
                    {isFreeship && (
                      <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                        ĐƯỢC FREESHIP
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-stone-600">
                    {isFreeship
                      ? `Khoảng cách hiện tại ~${distanceKm}km: Bạn được Miễn phí giao hàng hoàn toàn!`
                      : `Khoảng cách ${distanceKm}km (>3km): Áp dụng phụ phí ship ${shippingFee.toLocaleString("vi-VN")}đ.`}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 divide-y divide-stone-100">
                {cart.map((cartItem) => (
                  <div key={cartItem.cartId} className="pt-3 first:pt-0 flex gap-3">
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-stone-900 truncate">
                          {cartItem.item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.cartId)}
                          className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition"
                          title="Xóa món"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-amber-900">Size {cartItem.size}</span>
                          {cartItem.sugar !== "N/A" && <span>• {cartItem.sugar} đường</span>}
                          {cartItem.ice !== "N/A" && <span>• {cartItem.ice} đá</span>}
                        </div>
                        {cartItem.toppings.length > 0 && (
                          <div className="text-amber-800 text-[10px]">
                            + {cartItem.toppings.map(t => t.name).join(", ")}
                          </div>
                        )}
                        {cartItem.note && (
                          <div className="italic text-stone-400 text-[10px]">
                            Note: {cartItem.note}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartId, -1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-white rounded transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-stone-800">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartId, 1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-white rounded transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-amber-900">
                          {cartItem.itemTotalPrice.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Simulator / Distance Checker */}
              <div className="border border-stone-200 rounded-2xl p-3.5 bg-stone-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    Địa chỉ nhận hàng (Kiểm tra Freeship):
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Gốc: P. An Nhơn, Gò Vấp
                  </span>
                </div>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập số nhà, tên đường, phường..."
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-600">Khoảng cách ước tính:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={distanceKm}
                      onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                      className="w-24 accent-amber-700 cursor-pointer"
                    />
                    <span className="font-bold text-stone-900 font-mono w-14 text-right">
                      {distanceKm} km
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleCheckoutDirect} className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Họ và tên người nhận:
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Anh/Chị..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Số điện thoại (*):
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="090..."
                      required
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-hidden focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span>Tiền đồ uống & ăn vặt:</span>
                    <span className="font-medium">{itemsTotal.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span className={`font-semibold ${isFreeship ? "text-emerald-700 font-bold" : "text-stone-900"}`}>
                      {isFreeship ? "FREESHIP (Bán kính <=3km)" : `${shippingFee.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200 pt-2 font-bold text-sm text-stone-900">
                    <span>Tổng cộng:</span>
                    <span className="text-amber-900 text-base font-extrabold">
                      {grandTotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* AI Checkout Button */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAiWithCart();
                  }}
                  className="w-full bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-stone-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Bot className="w-4 h-4 text-amber-300" />
                  <span>Gửi Giỏ Hàng Qua NicoBot AI Để Chốt Nhanh</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Direct Checkout Button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đặt Giao Tận Nơi ({grandTotal.toLocaleString("vi-VN")}đ)</span>
                </button>

                {/* Hotline call option */}
                <a
                  href={`tel:${SHOP_INFO.hotline}`}
                  className="w-full border border-amber-300 text-amber-900 hover:bg-amber-50 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                  <span>Gọi Hotline Đặt Trực Tiếp: {SHOP_INFO.hotline}</span>
                </a>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
