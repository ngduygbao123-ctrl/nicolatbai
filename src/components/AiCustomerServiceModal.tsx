import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  ShieldAlert, 
  Sparkles, 
  PhoneCall, 
  MapPin, 
  Truck, 
  RotateCcw,
  CheckCircle2,
  Mic,
  MicOff,
  ShoppingBag,
  Plus,
  ArrowRight,
  Star,
  Check,
  Tag,
  Flame,
  CreditCard
} from "lucide-react";
import { SHOP_INFO, CartItem, MenuItem, TOPPINGS } from "../data/menu";
import { processMilkTeaQueryFast, QuickAction } from "../utils/teaAiEngine";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  isGuardrailWarning?: boolean;
  suggestedItems?: MenuItem[];
  addedCartItem?: CartItem;
  upsellItem?: MenuItem;
  upsellTip?: string;
  quickActions?: QuickAction[];
}

interface AiCustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onAddToCart?: (item: CartItem, shouldOpenCart?: boolean) => void;
  onOpenCart?: () => void;
}

const DEFAULT_WELCOME_MESSAGE: Message = {
  id: "welcome-1",
  sender: "bot",
  text: "Dạ, Trà Sữa NicoLatBai xin kính chào quý khách ạ! 🧋✨\n\nEm là **NicoBot - AI E-Commerce Shopping & CSKH Agent** của quán. Em được trang bị khả năng:\n• 🌟 **Tư vấn sản phẩm chuẩn gu:** Bestseller, gợi ý mức đường/đá, trà mộc Bảo Lộc an toàn 100%.\n• 🛒 **Tự động lên đơn & thêm vào giỏ hàng:** Chỉ cần nhắn món, size, đường/đá em sẽ tạo đơn ngay.\n• 🎁 **Tối ưu ưu đãi E-Commerce:** Freeship 3km, Combo 35k tiết kiệm 7k, Mua 5 giảm 15k.\n• 🚀 **Chốt đơn giao hỏa tốc** tận cửa trong 15-20 phút!\n\n*(Lưu ý: Em chỉ hỗ trợ chuyên biệt về Trà Sữa và dịch vụ quán NicoLatBai thôi ạ!)*\n\nAnh/chị muốn đặt món trà sữa hay ăn vặt nào hôm nay ạ?",
  time: "Vừa xong",
  quickActions: [
    { label: "🌟 Xem Bestseller bán chạy", action: "ask_query", payload: "Quán có món nào ngon tư vấn cho mình với?" },
    { label: "🎁 Xem Khuyến mãi & Combo 35k", action: "ask_query", payload: "Quán đang có khuyến mãi gì?" },
    { label: "🧋 Cho 1 Trà sữa truyền thống M", action: "ask_query", payload: "Cho 1 ly trà sữa truyền thống size M" },
    { label: "🛵 Freeship 3km ở đâu?", action: "ask_query", payload: "Quán ở đâu và freeship bán kính bao nhiêu?" }
  ]
};

const SUGGESTED_QUESTIONS = [
  {
    label: "🌟 Bestseller bán chạy",
    query: "Quán mình có món nào ngon tư vấn cho mình với?",
    category: "shopping"
  },
  {
    label: "🧋 Lấy 1 Trà sữa truyền thống M",
    query: "Cho 1 ly trà sữa truyền thống size M 70 đường 50 đá",
    category: "order"
  },
  {
    label: "🍯 Lấy 1 Sữa tươi đường đen",
    query: "Cho 1 ly sữa tươi trân châu đường đen size M",
    category: "order"
  },
  {
    label: "🎁 Combo 35k Tiết Kiệm (7k)",
    query: "Cho 1 combo trà sữa và bánh tráng trộn",
    category: "promo"
  },
  {
    label: "⏰ Giờ làm việc của quán",
    query: "Quán mấy giờ mở cửa và mấy giờ đóng cửa vậy?",
    category: "faq"
  },
  {
    label: "🛵 Freeship 3km Gò Vấp",
    query: "Mình ở gần đây có được freeship không? Quán ở đâu vậy?",
    category: "shipping"
  },
  {
    label: "🍃 Trà mộc hay bột? Sạch không?",
    query: "Trà sữa quán mình dùng trà gì, có an toàn sức khỏe và sạch không?",
    category: "tough"
  },
  {
    label: "🌙 Uống tối có mất ngủ không?",
    query: "Uống trà sữa của quán có bị mất ngủ không, người nhạy cảm thì nên uống gì?",
    category: "tough"
  },
  {
    label: "🍜 Thử hỏi món không bán (mì cay)",
    query: "cho tôi oder mì cay",
    category: "test"
  }
];

export const AiCustomerServiceModal: React.FC<AiCustomerServiceModalProps> = ({
  isOpen,
  onClose,
  cart,
  cartTotal,
  onAddToCart,
  onOpenCart
}) => {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [addedSuccessNotice, setAddedSuccessNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleExecuteQuickAction = (qa: QuickAction) => {
    if (qa.action === "open_cart") {
      if (onOpenCart) {
        onOpenCart();
        onClose();
      }
      return;
    }

    if (qa.action === "ask_query" && typeof qa.payload === "string") {
      sendMessage(qa.payload);
      return;
    }

    if (qa.action === "add_item" && qa.payload) {
      const item = qa.payload as MenuItem;
      const defaultSugar = "70%";
      const defaultIce = "70%";
      const unitPrice = item.priceM;

      const newCartItem: CartItem = {
        cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        item,
        size: "M",
        sugar: defaultSugar,
        ice: defaultIce,
        toppings: [],
        quantity: 1,
        note: "Đặt nhanh qua AI E-Commerce Agent",
        itemTotalPrice: unitPrice
      };

      if (onAddToCart) {
        onAddToCart(newCartItem, false);
      }

      setAddedSuccessNotice(`Đã thêm ${item.name} vào giỏ hàng!`);
      setTimeout(() => setAddedSuccessNotice(null), 3000);

      // Add feedback message in chat
      const feedbackMsg: Message = {
        id: Date.now().toString(),
        sender: "bot",
        text: `✅ **Đã thêm 1x ${item.name} (${unitPrice.toLocaleString("vi-VN")}đ) vào giỏ hàng!**\n\n🛵 Quán đang áp dụng **Freeship trong bán kính 3km**. Anh/chị có thể tiếp tục chọn món hoặc bấm 'Xem giỏ hàng' để thanh toán ngay nhé!`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quickActions: [
          { label: "🛒 Mở giỏ hàng & Thanh toán", action: "open_cart" },
          { label: "🧋 Đặt thêm món nước khác", action: "ask_query", payload: "Xem thêm các món nước ngon khác" }
        ]
      };
      setMessages(prev => [...prev, feedbackMsg]);
    }
  };

  const handleQuickAddSuggestedItem = (item: MenuItem, size: "M" | "L" = "M") => {
    const unitPrice = size === "L" && item.priceL ? item.priceL : item.priceM;
    const newCartItem: CartItem = {
      cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      item,
      size,
      sugar: "70%",
      ice: "70%",
      toppings: [],
      quantity: 1,
      note: "Thêm từ gợi ý AI E-Commerce",
      itemTotalPrice: unitPrice
    };

    if (onAddToCart) {
      onAddToCart(newCartItem, false);
    }

    setAddedSuccessNotice(`Đã thêm ${item.name} (${size}) vào giỏ hàng!`);
    setTimeout(() => setAddedSuccessNotice(null), 3000);

    const confirmMsg: Message = {
      id: Date.now().toString(),
      sender: "bot",
      text: `🎉 Tuyệt vời! Em đã thêm **${item.name} (Size ${size} - ${unitPrice.toLocaleString("vi-VN")}đ)** vào giỏ hàng của anh/chị rồi ạ!\n\n💡 *Mẹo:* Đơn hàng được **FREESHIP 100% trong 3km**. Anh/chị muốn chốt đơn giao luôn hay chọn thêm món ăn vặt đi kèm không ạ?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      quickActions: [
        { label: "🛒 Mở giỏ hàng & Thanh toán", action: "open_cart" },
        { label: "🍟 Thêm Bánh tráng trộn (15k)", action: "ask_query", payload: "Lấy cho mình thêm 1 bánh tráng trộn" }
      ]
    };
    setMessages(prev => [...prev, confirmMsg]);
  };

  const sendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 1. Fast Intelligent E-Commerce Evaluation
      const fastResult = processMilkTeaQueryFast(userText);

      // Automatically dispatch Cart Item if customer asked to add/order
      if (fastResult.addedCartItem && onAddToCart) {
        onAddToCart(fastResult.addedCartItem, false);
        setAddedSuccessNotice(`Đã thêm ${fastResult.addedCartItem.item.name} vào giỏ hàng!`);
        setTimeout(() => setAddedSuccessNotice(null), 3000);
      }

      // Smooth realistic typing delay (120ms)
      await new Promise(resolve => setTimeout(resolve, 120));

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: fastResult.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isGuardrailWarning: fastResult.isRefusal,
        suggestedItems: fastResult.suggestedItems,
        addedCartItem: fastResult.addedCartItem,
        upsellItem: fastResult.upsellItem,
        upsellTip: fastResult.upsellTip,
        quickActions: fastResult.quickActions
      };

      setMessages(prev => [...prev, botMsg]);

      // Async background sync with API proxy if needed
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userText }]
        })
      }).catch(() => {});
    } catch (err) {
      console.error("Chat error:", err);
      const fastResult = processMilkTeaQueryFast(userText);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: fastResult.reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isGuardrailWarning: fastResult.isRefusal,
          suggestedItems: fastResult.suggestedItems,
          addedCartItem: fastResult.addedCartItem,
          upsellItem: fastResult.upsellItem,
          upsellTip: fastResult.upsellTip,
          quickActions: fastResult.quickActions
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSendCartSummary = () => {
    if (cart.length === 0) {
      sendMessage("Mình muốn xem lại thực đơn và các món bán chạy của quán");
      return;
    }

    const itemsSummary = cart.map(item => {
      const toppingsStr = item.toppings.length > 0 ? ` + Topping: ${item.toppings.map(t => t.name).join(", ")}` : "";
      return `• ${item.quantity}x ${item.item.name} (Size ${item.size}, ${item.sugar} đường, ${item.ice} đá${toppingsStr})`;
    }).join("\n");

    const prompt = `Dạ em muốn chốt đơn hàng sau:\n${itemsSummary}\nTổng cộng tạm tính: ${cartTotal.toLocaleString("vi-VN")}đ. Tư vấn giúp em về freeship và cách nhận hàng tại Gò Vấp với ạ!`;
    sendMessage(prompt);
  };

  // Voice speech-to-text integration
  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt chưa bật nhận diện giọng nói. Bạn gõ phím giúp em nhé!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-amber-50 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col h-[92vh] max-h-[780px] border border-amber-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border-2 border-amber-300 flex items-center justify-center text-amber-200 shadow-inner">
                <Bot className="w-6 h-6 text-amber-200 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-amber-900 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-amber-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-amber-100 tracking-wide flex items-center gap-1.5">
                  <span>NicoBot</span>
                  <span className="text-amber-400 text-xs font-normal">| AI E-Commerce Agent</span>
                </h3>
                <span className="text-[10px] uppercase font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full border border-emerald-400/40 shadow-xs">
                  Chốt Đơn 24/7
                </span>
              </div>
              <p className="text-xs text-amber-300/90 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                  <Truck className="w-3 h-3" /> Freeship 3km
                </span>
                <span>•</span>
                <span className="text-amber-200">Hotline: {SHOP_INFO.hotline}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Live Cart Button in Header */}
            {onOpenCart && (
              <button
                onClick={() => {
                  onOpenCart();
                  onClose();
                }}
                className="bg-amber-800/80 hover:bg-amber-700 text-amber-200 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-amber-700/60"
                title="Xem giỏ hàng"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>{cart.length} món</span>
                {cartTotal > 0 && (
                  <span className="bg-emerald-600 text-white px-1.5 py-0.2 rounded-md text-[10px]">
                    {cartTotal.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMessages([DEFAULT_WELCOME_MESSAGE])}
              title="Đặt lại đoạn chat"
              className="p-2 text-amber-300 hover:text-white hover:bg-amber-800/80 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Đóng cửa sổ"
              className="p-2 text-amber-300 hover:text-white hover:bg-amber-800/80 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* E-Commerce Banner: Freeship & Policy */}
        <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border-b border-amber-300/80 px-4 py-2 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <span className="bg-amber-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
              Agent E-Commerce
            </span>
            <p className="font-medium text-[11px] sm:text-xs">
              <strong>Tự động thêm vào giỏ & gợi ý combo:</strong> Nhắn tên món, đường đá hoặc yêu cầu tư vấn để AI lên đơn ngay!
            </p>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold shrink-0 border border-emerald-300">
            🛵 Freeship 100% (3km)
          </span>
        </div>

        {/* Added Success Alert Toast */}
        {addedSuccessNotice && (
          <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between animate-fadeIn transition">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>{addedSuccessNotice}</span>
            </div>
            {onOpenCart && (
              <button
                onClick={() => {
                  onOpenCart();
                  onClose();
                }}
                className="underline text-[11px] hover:text-emerald-100 cursor-pointer font-extrabold"
              >
                Mở giỏ hàng ngay &rarr;
              </button>
            )}
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
          {messages.map((m) => {
            const isBot = m.sender === "bot";
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 sm:gap-3 ${isBot ? "justify-start" : "justify-end"} animate-fadeIn`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center shrink-0 mt-1 shadow-sm font-bold text-xs border border-amber-600">
                    🧋
                  </div>
                )}
                <div
                  className={`max-w-[92%] sm:max-w-[82%] rounded-2xl px-3.5 sm:px-4 py-3 shadow-sm text-sm leading-relaxed ${
                    isBot
                      ? m.isGuardrailWarning
                        ? "bg-amber-100/90 text-amber-950 border border-amber-300 rounded-tl-sm"
                        : "bg-white text-stone-800 border border-amber-200/90 rounded-tl-sm"
                      : "bg-amber-800 text-white rounded-tr-sm font-medium"
                  }`}
                >
                  {m.isGuardrailWarning && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5 bg-amber-200/60 p-1.5 rounded-lg border border-amber-300">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>Thông báo: Từ chối yêu cầu ngoài phạm vi cửa hàng</span>
                    </div>
                  )}

                  {/* Main Message Text */}
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {/* E-Commerce Component: Added Cart Item Confirmation Card */}
                  {m.addedCartItem && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-300 shadow-2xs">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={m.addedCartItem.item.image}
                          alt={m.addedCartItem.item.name}
                          className="w-14 h-14 object-cover rounded-lg border border-emerald-200 shrink-0 shadow-2xs"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đã thêm vào giỏ hàng
                          </div>
                          <h4 className="font-bold text-xs text-stone-900 truncate mt-0.5">
                            {m.addedCartItem.item.name}
                          </h4>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            Size {m.addedCartItem.size} • {m.addedCartItem.sugar} đường • {m.addedCartItem.ice} đá
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-emerald-200/60">
                            <span className="text-xs font-bold text-emerald-700">
                              {m.addedCartItem.itemTotalPrice.toLocaleString("vi-VN")}đ
                            </span>
                            {onOpenCart && (
                              <button
                                onClick={() => {
                                  onOpenCart();
                                  onClose();
                                }}
                                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-0.5 cursor-pointer"
                              >
                                Xem giỏ hàng <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* E-Commerce Component: Upsell Suggestion Card */}
                  {m.upsellItem && (
                    <div className="mt-2.5 p-2.5 bg-gradient-to-r from-amber-100/90 to-orange-100/90 rounded-xl border border-amber-300 flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          <Flame className="w-4 h-4 text-amber-200" />
                        </div>
                        <div className="text-[11px] text-amber-950 leading-tight">
                          <strong className="text-amber-900 font-bold">Gợi ý tiết kiệm:</strong> {m.upsellTip || `Thêm ${m.upsellItem.name} chỉ ${m.upsellItem.priceM.toLocaleString("vi-VN")}đ!`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleExecuteQuickAction({ action: "add_item", payload: m.upsellItem, label: "Thêm" })}
                        className="bg-amber-800 hover:bg-amber-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer transition"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm ({m.upsellItem.priceM.toLocaleString("vi-VN")}đ)
                      </button>
                    </div>
                  )}

                  {/* E-Commerce Component: Suggested Product Shelf (Product Cards) */}
                  {m.suggestedItems && m.suggestedItems.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-amber-100 pt-2.5">
                      <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3 text-amber-600" />
                        Sản phẩm đề xuất cho bạn:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {m.suggestedItems.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-amber-50/70 hover:bg-amber-100/80 rounded-xl p-2.5 border border-amber-200 flex flex-col justify-between transition group shadow-2xs"
                          >
                            <div className="flex gap-2">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 object-cover rounded-lg border border-amber-200 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                {prod.badge && (
                                  <span className="text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded-md uppercase">
                                    {prod.badge}
                                  </span>
                                )}
                                <h5 className="font-bold text-xs text-stone-900 truncate mt-0.5">
                                  {prod.name}
                                </h5>
                                <div className="text-[11px] font-extrabold text-amber-800 mt-0.5">
                                  {prod.priceM.toLocaleString("vi-VN")}đ {prod.priceL ? `- ${prod.priceL.toLocaleString("vi-VN")}đ` : ""}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickAddSuggestedItem(prod, "M")}
                                className="flex-1 bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Thêm size M</span>
                              </button>
                              {prod.priceL && (
                                <button
                                  onClick={() => handleQuickAddSuggestedItem(prod, "L")}
                                  className="bg-white hover:bg-amber-200 text-amber-900 border border-amber-300 text-[10px] font-bold py-1 px-2 rounded-lg cursor-pointer transition"
                                >
                                  Size L
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* E-Commerce Component: Quick Actions Chips */}
                  {m.quickActions && m.quickActions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-amber-100/70 pt-2">
                      {m.quickActions.map((qa, qidx) => (
                        <button
                          key={qidx}
                          onClick={() => handleExecuteQuickAction(qa)}
                          className="bg-amber-100/90 hover:bg-amber-200 text-amber-900 font-semibold text-xs px-2.5 py-1 rounded-lg border border-amber-300/80 flex items-center gap-1 cursor-pointer transition shadow-2xs hover:scale-102"
                        >
                          <span>{qa.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isBot ? "text-stone-400" : "text-amber-200"
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start items-center text-amber-800">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center shrink-0 text-xs font-bold border border-amber-600">
                🧋
              </div>
              <div className="bg-white border border-amber-200 rounded-2xl px-4 py-3 shadow-sm rounded-tl-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-amber-800 font-medium ml-1">NicoBot AI đang xử lý đơn & tư vấn...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="bg-amber-50/95 border-t border-amber-200/90 px-3 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Kịch bản E-Commerce & Đặt món nhanh:
            </span>
            {cart.length > 0 && (
              <button
                onClick={handleSendCartSummary}
                className="text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-200 hover:bg-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition shadow-2xs"
              >
                <ShoppingBag className="w-3 h-3" />
                Hỏi AI chốt đơn ({cart.length} món)
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q.query)}
                className={`text-xs px-2.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer border shadow-2xs font-medium flex items-center gap-1 ${
                  q.category === "order"
                    ? "bg-amber-600 text-white border-amber-700 hover:bg-amber-700 font-bold"
                    : q.category === "promo"
                    ? "bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100 font-semibold"
                    : q.category === "test"
                    ? "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200"
                    : "bg-white hover:bg-amber-100 text-amber-900 border-amber-200"
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-2.5 sm:p-3.5 bg-white border-t border-amber-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            title={isListening ? "Đang lắng nghe... bấm để dừng" : "Nói bằng giọng nói"}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center shrink-0 ${
              isListening
                ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Đang lắng nghe bạn nói..." : "Ví dụ: 'Cho 1 ly trà sữa truyền thống size M 70 đường', 'Tư vấn món'..."}
            className="flex-1 bg-amber-50/60 border border-amber-300 focus:border-amber-600 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden transition shadow-inner"
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-amber-800 hover:bg-amber-900 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <span>Gửi</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Store Footer */}
        <div className="bg-amber-950 text-amber-200 px-4 py-1.5 text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-1 text-amber-300">
            <MapPin className="w-3 h-3 text-amber-400" />
            Đường số 20, An Nhơn, Gò Vấp (Freeship 3km)
          </span>
          <a
            href={`tel:${SHOP_INFO.hotline}`}
            className="flex items-center gap-1 font-bold text-amber-300 hover:underline"
          >
            <PhoneCall className="w-3 h-3" />
            Hotline: {SHOP_INFO.hotline}
          </a>
        </div>
      </div>
    </div>
  );
};
