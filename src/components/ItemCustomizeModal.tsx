import React, { useState } from "react";
import { X, Plus, Minus, Check, Sparkles, MessageCircleQuestion } from "lucide-react";
import { MenuItem, TOPPINGS, SUGAR_OPTIONS, ICE_OPTIONS, Topping, CartItem } from "../data/menu";

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
  onAskAiAboutItem: (item: MenuItem, sugar: string, ice: string) => void;
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
  onAskAiAboutItem
}) => {
  if (!isOpen || !item) return null;

  const [size, setSize] = useState<"M" | "L">("M");
  const [sugar, setSugar] = useState<string>("70%");
  const [ice, setIce] = useState<string>("50%");
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>("");

  const isSnack = item.category === "snacks";

  // Calculate pricing
  const basePrice = size === "M" ? item.priceM : (item.priceL ?? item.priceM);
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const singleItemPrice = basePrice + (isSnack ? 0 : toppingsPrice);
  const totalPrice = singleItemPrice * quantity;

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAdd = () => {
    const cartItem: CartItem = {
      cartId: `${item.id}-${Date.now()}`,
      item,
      size,
      sugar: isSnack ? "N/A" : sugar,
      ice: isSnack ? "N/A" : ice,
      toppings: isSnack ? [] : selectedToppings,
      quantity,
      note,
      itemTotalPrice: totalPrice
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] border border-amber-200 overflow-hidden">
        
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {item.badge && (
            <span className="absolute top-3 left-3 bg-amber-600/90 text-amber-100 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-amber-400/30 shadow-sm">
              {item.badge}
            </span>
          )}

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {item.name}
            </h3>
            <p className="text-xs text-amber-200 mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Size Choice */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
              1. Chọn Size:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSize("M")}
                className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                  size === "M"
                    ? "border-amber-600 bg-amber-50 text-amber-950 font-bold"
                    : "border-stone-200 bg-white text-stone-700 hover:border-amber-300"
                }`}
              >
                <div>
                  <div className="text-sm">Size M (Vừa vặn)</div>
                  <div className="text-xs text-amber-700 mt-0.5">
                    {item.priceM.toLocaleString("vi-VN")}đ
                  </div>
                </div>
                {size === "M" && <Check className="w-4 h-4 text-amber-600" />}
              </button>

              {item.priceL && (
                <button
                  type="button"
                  onClick={() => setSize("L")}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                    size === "L"
                      ? "border-amber-600 bg-amber-50 text-amber-950 font-bold"
                      : "border-stone-200 bg-white text-stone-700 hover:border-amber-300"
                  }`}
                >
                  <div>
                    <div className="text-sm">Size L (Đã Khát)</div>
                    <div className="text-xs text-amber-700 mt-0.5">
                      {item.priceL.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                  {size === "L" && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              )}
            </div>
          </div>

          {!isSnack && (
            <>
              {/* Sugar Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    2. Mức Đường (Theo chuẩn khẩu vị):
                  </label>
                  <span className="text-[11px] text-amber-700 font-medium">
                    AI khuyên dùng 70%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SUGAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSugar(opt.value)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        sugar === opt.value
                          ? "border-amber-600 bg-amber-100/70 text-amber-950 font-bold shadow-2xs"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5 truncate">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ice Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    3. Mức Đá (Chống nhạt khi mang về):
                  </label>
                  <span className="text-[11px] text-amber-700 font-medium">
                    Mang đi xa khuyên chọn 50% đá
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {ICE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setIce(opt.value)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        ice === opt.value
                          ? "border-amber-600 bg-amber-100/70 text-amber-950 font-bold shadow-2xs"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5 truncate">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings */}
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                  4. Topping Gọi Thêm (5.000đ – 10.000đ):
                </label>
                <div className="space-y-2">
                  {TOPPINGS.map((topping) => {
                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <div
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? "border-amber-600 bg-amber-50/80 text-amber-950"
                            : "border-stone-200 hover:border-amber-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                              isSelected
                                ? "bg-amber-600 border-amber-600 text-white"
                                : "border-stone-300 bg-stone-50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-800">{topping.name}</div>
                            <div className="text-[10px] text-stone-500">{topping.description}</div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-amber-800">
                          +{topping.price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Ghi chú */}
          <div>
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
              Ghi chú cho quán (Tùy chọn):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Để riêng đá, nhiều sốt béo, giao trước 12h..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          {/* Ask AI about this item */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="text-xs text-amber-900">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Chưa chắc về khẩu vị món này?
              </span>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Nhờ NicoBot AI phân tích độ béo, độ chát và tư vấn đường đá phù hợp.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskAiAboutItem(item, sugar, ice);
              }}
              className="shrink-0 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" />
              Hỏi AI
            </button>
          </div>
        </div>

        {/* Footer with quantity and Add to Cart */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-stone-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-bold py-3 px-5 rounded-2xl shadow-md transition flex items-center justify-between cursor-pointer"
          >
            <span className="text-sm">Thêm vào giỏ</span>
            <span className="text-sm font-extrabold text-amber-200">
              {totalPrice.toLocaleString("vi-VN")}đ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
