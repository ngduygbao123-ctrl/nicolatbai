// Dedicated AI E-Commerce Shopping & Customer Care Engine for Trà Sữa NicoLatBai
// Chuyên viên tư vấn bán hàng thương mại điện tử: Báo giá, gợi ý sản phẩm trực quan, tự động thêm vào giỏ, gợi ý upsell & chốt đơn thông minh.
// BẢO VỆ NGHIÊM NGẶT: TỪ CHỐI MỌI THỨ KHÔNG CÓ TRONG QUÁN.

import { MENU_ITEMS, TOPPINGS } from "../data/menu.ts";
import type { MenuItem, CartItem, Topping } from "../data/menu.ts";
import { checkStoreRealTimeStatus, NICOLATBAI_PROMOTIONS } from "./storeRealTime.ts";

export const NICOLATBAI_INFO = {
  name: "Trà Sữa NicoLatBai",
  tagline: "Đậm Vị Trà - Thơm Vị Sữa - Trọn Vị Yêu Thương",
  address: "Đường số 20, phường An Nhơn, Quận Gò Vấp, TP. Hồ Chí Minh",
  hotline: "038.397.8888",
  hours: "08:30 – 22:30 hàng ngày (Cả tuần & Lễ Tết)",
  orderCutoff: "22:15",
  freeshipKm: 3
};

export interface QuickAction {
  label: string;
  action: "add_item" | "open_cart" | "ask_query" | "checkout";
  payload?: any;
}

export interface FastAnswerResult {
  reply: string;
  isRefusal: boolean;
  suggestedItems?: MenuItem[];
  addedCartItem?: CartItem;
  upsellItem?: MenuItem;
  upsellTip?: string;
  quickActions?: QuickAction[];
  promoNotice?: string;
  orderConfirmation?: {
    itemCount: number;
    subtotal: number;
    freeship: boolean;
  };
}

// Danh sách các hương vị đồ uống KHÔNG CÓ trong quán
const UNSUPPORTED_BEVERAGES = [
  "matcha", "trà xanh", "tra xanh", "thái xanh", "thai xanh", "thái đỏ", "thai do", "trà thái", "tra thai",
  "khoai môn", "khoai mon", "socola", "sô cô la", "chocolate", "cacao", "milo",
  "ô long", "o long", "olong", "gạo rang", "gao rang", "nướng", "hạt dẻ", "hat de", "dưa lưới", "dua luoi",
  "sương sáo", "suong sao", "bạc hà", "bac ha", "hoa đậu biếc", "đậu biếc", "hạt sen", "hat sen",
  "dừa nướng", "phô mai tươi", "cheese foam", "macchiato", "caramel", "sâm dứa", "sam dua",
  "trà đào", "tra dao", "đào cam sả", "dao cam sa", "trà chanh", "tra chanh", "trà tắc", "tra tac",
  "mãng cầu", "mang cau", "trà xoài", "tra xoai", "trà ổi", "tra oi", "ổi hồng", "oi hong",
  "trà vải", "tra vai", "trà sen", "tra sen", "trà nhãn", "tra nhan", "trà nho", "tra nho",
  "việt quất", "viet quat", "kiwi", "dưa hấu", "dua hau", "trà bưởi", "tra buoi", "thanh long",
  "hoa cúc", "hoa cuc", "atiso", "bí đao", "bi dao", "sâm bổ lượng",
  "nước mía", "nuoc mia", "nước dừa", "nuoc dua", "nước ép", "nuoc ep", "sinh tố", "sinh to",
  "sữa chua", "sua chua", "cà phê", "ca phe", "cafe", "bạc xỉu", "bac xiu", "đen đá", "den da",
  "cappuccino", "latte", "espresso", "americano", "cold brew",
  "nước suối", "nuoc suoi", "aquafina", "lavie", "dasani", "nước khoáng",
  "nước ngọt", "coca", "pepsi", "7up", "sprite", "mirinda", "sting", "redbull", "bò húc", "xá xị", "fanta", "revive",
  "bia", "beer", "heineken", "tiger", "saigon", "corona", "strongbow", "cider", "rượu", "ruou"
];

// Danh sách các món ăn KHÔNG CÓ trong quán
const UNSUPPORTED_FOODS = [
  "bánh tráng nướng", "banh trang nuong", "bánh tráng cuốn", "banh trang cuon", "bánh tráng bơ", "bánh tráng chấm", "bánh tráng xì ke", "bánh tráng phơi sương",
  "nem chua", "nem rán", "nem nướng", "chân gà", "chan ga", "chân gà sả tắc", "chân gà rút xương",
  "khô bò", "kho bo", "khô gà", "kho ga", "khô mực", "da heo", "cơm cháy",
  "khoai lang kén", "khoai lang lắc", "khoai lang", "bắp xào", "bap xao", "bắp nướng",
  "xúc xích đức", "xúc xích nướng", "lạp xưởng", "dồi sụn", "doi sun",
  "bò viên", "bo vien", "tôm viên", "tom vien", "chả cá", "cha ca", "hồ lô", "ho lo", "mực chiên", "thanh cua",
  "bánh gà", "chả giò", "há cảo", "ha cao", "sủi cảo", "sui cao",
  "gà rán", "ga ran", "kfc", "jollibee", "lotteria", "popcorn",
  "bánh mì", "banh mi", "bánh bao", "banh bao", "bánh giò", "bánh cuốn", "bánh xèo", "bánh khọt", "bánh crepe", "bánh ngọt", "bánh kem", "bánh su kem", "donut", "tiramisu",
  "kem", "kem tươi", "kem cuộn", "bingsu", "chè", "che", "chè thái", "chè bưởi", "khúc bạch", "tàu hũ", "tau hu", "xôi", "xoi",
  "mì cay", "mi cay", "mì tôm", "mi tom", "mì gói", "mi goi", "mì xào", "mi xao", "mì ý", "spaghetti", "miến",
  "hủ tiếu", "hu tieu", "phở", "pho", "bún bò", "bun bo", "bún đậu", "bun dau", "bún chả", "bun cha", "bún riêu", "bun rieu", "bún mắm", "bún thịt nướng", "bánh canh", "nui",
  "cơm tấm", "com tam", "cơm gà", "com ga", "cơm sườn", "com suon", "cơm chiên", "com chien", "cơm hộp", "cơm", "com",
  "pizza", "burger", "hamburger", "sandwich", "hotdog",
  "lẩu", "lau", "lẩu thái", "hải sản", "hai san", "ốc", "oc", "tôm nướng", "cua", "hàu",
  "sushi", "kimbap", "tokbokki", "bánh gạo"
];

// Danh sách hàng hóa phi thực phẩm & dịch vụ KHÔNG CÓ trong quán
const UNSUPPORTED_GOODS_AND_SERVICES = [
  "quần áo", "quan ao", "áo thun", "ao thun", "áo khoác", "quần jean", "váy", "đầm", "giày", "giay", "dép", "nón", "mũ", "túi xách", "ba lô", "balo", "ví",
  "mỹ phẩm", "my pham", "son môi", "son", "kem dưỡng", "sữa rửa mặt", "nước hoa",
  "điện thoại", "dien thoai", "iphone", "samsung", "oppo", "xiaomi", "ipad", "laptop", "máy tính", "may tinh", "macbook", "tai nghe", "airpods", "sạc", "sac", "cáp", "pin", "sim", "thẻ cào",
  "thuốc lá", "thuoc la", "vape", "pod", "hút thuốc", "thuốc tây", "thuoc tay", "panadol", "thuốc cảm", "khẩu trang", "bao cao su",
  "xăng", "xang", "nhớt", "xe máy", "xe may", "xe đạp", "xe hơi", "ô tô",
  "vé số", "ve so", "vé máy bay", "vé xem phim", "vé tàu", "vé xe",
  "sách", "sach", "truyện", "truyen", "vở", "bút", "bàn ghế", "tủ lạnh", "máy giặt", "tivi",
  "vàng", "bạc", "kim cương", "cho vay", "vay tiền", "cầm đồ", "đổi tiền",
  "chó", "mèo", "thú cưng", "pet",
  "sửa xe", "sua xe", "vá xe", "rửa xe", "cắt tóc", "cat toc", "gội đầu", "làm nail", "spa", "massage", "giặt ủi", "giat ui",
  "khách sạn", "khach san", "nhà nghỉ", "nha nghi", "karaoke", "bida", "gym", "xem bói", "boi toan"
];

// Danh sách câu hỏi học thuật / ngoài lề hoàn toàn
const OFF_TOPIC_TERMS = [
  "phương trình", "giải toán", "toán học", "tính tổng", "tích phân", "đạo hàm", "bài tập",
  "code", "python", "javascript", "react", "html", "css", "lập trình", "viết code", "viết hàm", "thuật toán", "sửa bug",
  "chính trị", "chiến tranh", "tổng thống", "bầu cử", "quốc hội",
  "thời tiết", "dự báo thời tiết", "trời mưa không", "nhiệt độ hôm nay",
  "chứng khoán", "cổ phiếu", "bitcoin", "crypto", "tiền ảo", "cá độ", "lô đề",
  "thơ tình", "làm thơ", "viết văn", "bài văn", "vật lý", "hóa học", "sinh học", "lịch sử", "địa lý",
  "dịch câu", "translate", "dịch tiếng anh", "who are you", "bạn là ai", "ai tạo ra bạn", "openai", "chatgpt"
];

// Helper: Tìm MenuItem theo từ khóa chuẩn trong menu
export function findMenuItemByKeyword(text: string): MenuItem | undefined {
  const q = text.toLowerCase();

  // Kiểm tra nếu có bất kỳ hương vị không hỗ trợ nào đi kèm -> KHÔNG match
  const hasUnsupportedBeverage = UNSUPPORTED_BEVERAGES.some(kw => q.includes(kw));
  if (hasUnsupportedBeverage) {
    return undefined;
  }

  // Sữa tươi trân châu đường đen
  if (q.includes("đường đen") || q.includes("duong den") || (q.includes("sữa tươi") && !q.includes("truyền thống"))) {
    return MENU_ITEMS.find(m => m.id === "sua_tuoi_duong_den");
  }

  // Trà lài đác thơm
  if (q.includes("lài") || q.includes("lai") || q.includes("đác thơm") || q.includes("dac thom") || q.includes("hạt đác")) {
    return MENU_ITEMS.find(m => m.id === "tra_lai_dac_thom");
  }

  // Trà dâu tằm thanh mát
  if (q.includes("dâu tằm") || q.includes("dau tam") || (q.includes("dâu") && !q.includes("lài"))) {
    return MENU_ITEMS.find(m => m.id === "tra_dau_tam");
  }

  // Bánh tráng trộn Tây Ninh
  if (q.includes("bánh tráng trộn") || q.includes("banh trang tron") || (q.includes("bánh tráng") && !q.includes("nướng") && !q.includes("cuốn") && !q.includes("bơ"))) {
    return MENU_ITEMS.find(m => m.id === "banh_trang_tron");
  }

  // Cá viên chiên giòn rụm
  if (q.includes("cá viên chiên") || q.includes("ca vien chien") || q.includes("cá viên") || q.includes("ca vien")) {
    return MENU_ITEMS.find(m => m.id === "ca_vien_chien");
  }

  // Khoai tây lắc phô mai
  if (q.includes("khoai tây lắc") || q.includes("khoai tay lac") || q.includes("lắc phô mai") || q.includes("khoai tây chiên")) {
    return MENU_ITEMS.find(m => m.id === "khoai_tay_lac");
  }

  // Trà sữa truyền thống NicoLatBai: CHỈ match khi có từ truyền thống, nicolatbai, hoặc trà sữa mộc chuẩn
  if (q.includes("truyền thống") || q.includes("truyen thong") || q.includes("nicolatbai") || q.includes("tra sua truyen thong") || q === "trà sữa" || q === "tra sua" || q.includes("ly trà sữa") || q.includes("cốc trà sữa")) {
    return MENU_ITEMS.find(m => m.id === "ts_truyen_thong");
  }

  return undefined;
}

// Helper: Trích xuất tùy chọn đơn hàng (size, đường, đá, số lượng)
export function parseOrderOptions(text: string, item: MenuItem): {
  size: "M" | "L";
  sugar: string;
  ice: string;
  quantity: number;
  toppings: Topping[];
} {
  const q = text.toLowerCase();

  // Size
  let size: "M" | "L" = "M";
  if (q.includes("size l") || q.includes("ly lớn") || q.includes("cỡ lớn") || q.includes("ly to") || q.includes("size to")) {
    size = "L";
  } else if (q.includes("size m") || q.includes("ly vừa") || q.includes("cỡ vừa")) {
    size = "M";
  }

  // Sugar
  let sugar = "70%"; // Mặc định chuẩn gu
  if (q.includes("100% đường") || q.includes("100 đường") || q.includes("ngọt bình thường")) {
    sugar = "100%";
  } else if (q.includes("50% đường") || q.includes("50 đường") || q.includes("ít ngọt") || q.includes("ngọt nhẹ") || q.includes("ít đường")) {
    sugar = "50%";
  } else if (q.includes("không đường") || q.includes("0% đường")) {
    sugar = "50%";
  }

  // Ice
  let ice = "70%"; // Mặc định mát vừa
  if (q.includes("100% đá") || q.includes("100 đá") || q.includes("đầy đá") || q.includes("nhiều đá")) {
    ice = "100%";
  } else if (q.includes("50% đá") || q.includes("50 đá") || q.includes("ít đá") || q.includes("mang về") || q.includes("mang đi")) {
    ice = "50%";
  }

  // Quantity
  let quantity = 1;
  const matchQty = q.match(/(\d+)\s*(ly|phần|bịch|hộp|suất|cốc)/);
  if (matchQty && parseInt(matchQty[1], 10) > 0) {
    quantity = Math.min(20, parseInt(matchQty[1], 10));
  } else if (q.includes("cho 2") || q.includes("lấy 2") || q.includes("đặt 2") || q.includes("mua 2")) {
    quantity = 2;
  } else if (q.includes("cho 3") || q.includes("lấy 3") || q.includes("đặt 3") || q.includes("mua 3")) {
    quantity = 3;
  }

  // Toppings
  const toppings: Topping[] = [];
  if (q.includes("trân châu hoàng kim") || q.includes("hoàng kim") || q.includes("hoang kim")) {
    const t = TOPPINGS.find(top => top.id === "golden_pearl");
    if (t) toppings.push(t);
  }
  if (q.includes("trân châu trắng") || q.includes("trắng") || q.includes("trang")) {
    const t = TOPPINGS.find(top => top.id === "white_pearl");
    if (t) toppings.push(t);
  }
  if (q.includes("pudding") || q.includes("flan")) {
    const t = TOPPINGS.find(top => top.id === "egg_pudding");
    if (t) toppings.push(t);
  }
  if (q.includes("trân châu đen") || (q.includes("thêm trân châu") && toppings.length === 0)) {
    const t = TOPPINGS.find(top => top.id === "black_pearl");
    if (t) toppings.push(t);
  }

  return { size, sugar, ice, quantity, toppings };
}

// Hàm chuẩn tạo phản hồi từ chối món/thứ không có trong quán
function buildRefusalResponse(unsupportedName: string): FastAnswerResult {
  const bestsellers = MENU_ITEMS.filter(m => m.isPopular).slice(0, 3);
  const cleanName = unsupportedName.trim().toUpperCase();

  return {
    reply: `Dạ chào anh/chị! Trà Sữa NicoLatBai xin thông báo quán **KHÔNG CÓ BÁN ${cleanName}** ạ! 🚫\n\nQuán em là thương hiệu chuyên **Trà Sữa Chuẩn Gu, Trà Trái Cây và Đồ Ăn Vặt đường phố chất lượng cao**. Quán hoàn toàn **không kinh doanh món này**.\n\n👉 Em gợi ý anh/chị thưởng thức **Trà sữa truyền thống NicoLatBai (22k - 32k)** đậm đà hoặc **Combo 35k (Trà sữa + Bánh tráng trộn)** siêu tiết kiệm và bán chạy nhất của quán dưới đây nhé! 👇`,
    isRefusal: true,
    suggestedItems: bestsellers,
    quickActions: [
      { label: "🧋 Xem Menu Trà Sữa Chuẩn Gu", action: "ask_query", payload: "Xem menu và bảng giá của quán" },
      { label: "🌟 Thử Bestseller Trà Sữa (22k)", action: "add_item", payload: MENU_ITEMS[0] },
      { label: "🎁 Xem Khuyến Mãi & Combo 35k", action: "ask_query", payload: "Quán đang có khuyến mãi gì?" }
    ]
  };
}

export function processMilkTeaQueryFast(userText: string): FastAnswerResult {
  const q = userText.toLowerCase().trim();

  // ==========================================
  // 1. TỪ CHỐI CÁC ĐỒ UỐNG KHÔNG CÓ TRONG QUÁN
  // ==========================================
  for (const bev of UNSUPPORTED_BEVERAGES) {
    if (q.includes(bev)) {
      return buildRefusalResponse(bev);
    }
  }

  // ==========================================
  // 2. TỪ CHỐI CÁC MÓN ĂN KHÔNG CÓ TRONG QUÁN
  // ==========================================
  for (const food of UNSUPPORTED_FOODS) {
    if (q.includes(food)) {
      return buildRefusalResponse(food);
    }
  }

  // ==========================================
  // 3. TỪ CHỐI HÀNG HÓA & DỊCH VỤ NGOÀI QUÁN
  // ==========================================
  for (const good of UNSUPPORTED_GOODS_AND_SERVICES) {
    if (q.includes(good)) {
      return buildRefusalResponse(good);
    }
  }

  // ==========================================
  // 4. TỪ CHỐI CHỦ ĐỀ HỌC THUẬT, CODE, CHÍNH TRỊ, NGOÀI LỀ
  // ==========================================
  const hasOffTopic = OFF_TOPIC_TERMS.some(term => q.includes(term));
  const milkTeaKeywords = [
    "trà sữa", "tra sua", "sữa tươi", "đường đen", "trân châu", "topping", "đá", "đường",
    "bánh tráng", "khoai tây", "cá viên", "nicolatbai", "freeship", "an nhơn", "gò vấp", "menu", "thực đơn", "giá", "uống", "ly", "món", "ship"
  ];
  const hasMilkTeaKeyword = milkTeaKeywords.some(kw => q.includes(kw));

  if (hasOffTopic && !hasMilkTeaKeyword) {
    return {
      reply: `Dạ em là **NicoBot - AI E-Commerce Shopping Agent** của Trà Sữa NicoLatBai ạ! 🧋\n\nEm được thiết kế chuyên biệt để hỗ trợ khách hàng đặt trà sữa, đồ ăn vặt, áp dụng mã Freeship 3km và lên đơn giao hàng tận nơi. Em **không hỗ trợ các chủ đề ngoài quán** như giải toán, lập trình, chính trị, thời tiết hay tin tức ạ.\n\nAnh/chị có muốn thử 1 ly Trà sữa truyền thống đậm đà hay món ăn vặt giòn ngon nào của quán em không ạ? 😊`,
      isRefusal: true,
      suggestedItems: MENU_ITEMS.slice(0, 2),
      quickActions: [
        { label: "🧋 Xem Bestseller Quán", action: "ask_query", payload: "Quán có món nào ngon tư vấn cho mình với?" },
        { label: "🎉 Xem Ưu Đãi & Khuyến Mãi", action: "ask_query", payload: "Quán đang có khuyến mãi gì?" }
      ]
    };
  }

  // ==========================================
  // 5. NHẬN DIỆN CÂU HỎI "QUÁN CÓ BÁN [X] KHÔNG?" TỔNG QUÁT
  // Nếu khách hỏi bất cứ thứ gì mà quán không có, từ chối ngay lập tức
  // ==========================================
  const inquiryPatterns = [
    /quán\s+có\s+bán\s+([^?.,!]+)\s*(không|k|ko|\?|$)/i,
    /ở\s+đây\s+có\s+bán\s+([^?.,!]+)\s*(không|k|ko|\?|$)/i,
    /quán\s+có\s+([^?.,!]+)\s*(không|k|ko|\?|$)/i,
    /ở\s+đây\s+có\s+([^?.,!]+)\s*(không|k|ko|\?|$)/i,
    /có\s+bán\s+([^?.,!]+)\s*(không|k|ko|\?|$)/i,
    /bán\s+cho\s+(?:mình|em|anh|chị|tôi)?\s*([^?.,!]+)/i,
    /cho\s+(?:mình|em|anh|chị|tôi)?\s*mua\s+([^?.,!]+)/i
  ];

  for (const pattern of inquiryPatterns) {
    const match = q.match(pattern);
    if (match && match[1]) {
      const askedItem = match[1].trim();
      // Bỏ qua các từ khóa tra cứu thông tin hợp lệ của quán
      const validInquiries = [
        "món gì", "món nào", "gì", "nào", "bestseller", "menu", "thực đơn", "giá",
        "freeship", "ship", "đường", "đá", "wifi", "giờ", "giờ mở cửa", "ổ cắm", "chỗ ngồi", "gửi xe", "khuyến mãi", "combo"
      ];
      const isValidInquiry = validInquiries.some(v => askedItem === v || askedItem.startsWith(v));
      const matchedShopItem = findMenuItemByKeyword(askedItem);

      if (!isValidInquiry && !matchedShopItem) {
        return buildRefusalResponse(askedItem);
      }
    }
  }

  // ==========================================
  // 6. TIỆN ÍCH TẠI QUÁN (WIFI, CHỖ NGỒI, GỬI XE)
  // ==========================================
  if (q.includes("wifi") || q.includes("mật khẩu wifi") || q.includes("pass wifi")) {
    return {
      reply: `📶 **WIFI MIỄN PHÍ TẠI TRÀ SỮA NICOLATBAI:**\n\n• Tên WiFi: **Trà Sữa NicoLatBai** (hoặc NicoLatBai_Guest)\n• Mật khẩu: **nicolatbai** (viết liền không dấu)\n\nWiFi tốc độ cao cực mạnh phục vụ quý khách ngồi thưởng thức trà sữa, làm việc, lướt web hoặc học tập thoải mái ạ! 😊`,
      isRefusal: false,
      quickActions: [
        { label: "🧋 Xem Menu & Gọi Nước", action: "ask_query", payload: "Xem menu và bảng giá của quán" }
      ]
    };
  }

  if (q.includes("ổ cắm") || q.includes("sạc pin") || q.includes("chỗ ngồi") || q.includes("ngồi lại") || q.includes("không gian") || q.includes("máy lạnh")) {
    return {
      reply: `🪑 **KHÔNG GIAN TRẢI NGHIỆM TẠI QUÁN:**\n\n• Quán có khu vực ngồi máy lạnh mát mẻ, bàn ghế êm ái.\n• Trang bị đầy đủ **ổ cắm điện** tại từng bàn cho anh/chị sạc laptop, điện thoại làm việc và học tập.\n• Địa chỉ: **Đường số 20, phường An Nhơn, Gò Vấp**.\n\nMời anh/chị ghé quán trải nghiệm không gian và thưởng thức ly trà sữa chuẩn gu nhé ạ!`,
      isRefusal: false,
      suggestedItems: MENU_ITEMS.slice(0, 2)
    };
  }

  if (q.includes("gửi xe") || q.includes("giữ xe") || q.includes("đỗ xe") || q.includes("bãi xe") || q.includes("chỗ để xe")) {
    return {
      reply: `🛵 **CHỖ ĐỂ XE TẠI NICOLATBAI:**\n\n• Quán có **chỗ để xe máy rộng rãi, an toàn và hoàn toàn MIỄN PHÍ** ngay trước cửa quán.\n• Có nhân viên và camera an ninh quan sát chu đáo.\n\nAnh/chị yên tâm ghé quán thưởng thức trà sữa nhé ạ!`,
      isRefusal: false
    };
  }

  // ==========================================
  // 7. E-COMMERCE ACTION: ĐẶT MÓN / THÊM VÀO GIỎ HÀNG THỰC TẾ
  // ==========================================
  const orderPatterns = [
    "oder", "order", "cho 1", "cho 2", "cho 3", "cho mình", "lấy cho", "bán cho",
    "đặt 1", "đặt 2", "mua 1", "mua 2", "thêm vào giỏ", "lấy 1", "lấy 2", "lấy một", "cho một", "cho em", "lấy em"
  ];
  const isOrderIntent = orderPatterns.some(p => q.includes(p));

  if (isOrderIntent) {
    const matchedItem = findMenuItemByKeyword(q);

    // Nếu khách muốn đặt món nhưng món đó KHÔNG CÓ TRONG QUÁN
    if (!matchedItem) {
      return {
        reply: `Dạ món anh/chị vừa gọi **quán em không có bán** ạ! 🚫\n\nQuán em chỉ kinh doanh đúng 7 món chính thức chất lượng cao:\n• **Trà Sữa & Trà Trái Cây (20k - 35k):** Trà sữa truyền thống, Sữa tươi trân châu đường đen, Trà lài đác thơm, Trà dâu tằm.\n• **Đồ Ăn Vặt (15k - 25k):** Bánh tráng trộn Tây Ninh bò rim, Cá viên chiên giòn rụm, Khoai tây lắc phô mai.\n\nAnh/chị chọn món nào dưới đây để em lên đơn và freeship 3km ngay nhé! 👇`,
        isRefusal: true,
        suggestedItems: MENU_ITEMS.slice(0, 4),
        quickActions: [
          { label: "🧋 Lấy 1 Trà Sữa Truyền Thống M (22k)", action: "add_item", payload: MENU_ITEMS[0] },
          { label: "🍯 Lấy 1 Sữa Tươi Đường Đen M (25k)", action: "add_item", payload: MENU_ITEMS[1] },
          { label: "🍟 Thêm Bánh Tráng Trộn (15k)", action: "add_item", payload: MENU_ITEMS[4] }
        ]
      };
    }

    const { size, sugar, ice, quantity, toppings } = parseOrderOptions(q, matchedItem);
    const unitPrice = size === "L" && matchedItem.priceL ? matchedItem.priceL : matchedItem.priceM;
    const toppingsPrice = toppings.reduce((sum, t) => sum + t.price, 0);
    const totalItemPrice = (unitPrice + toppingsPrice) * quantity;

    const newCartItem: CartItem = {
      cartId: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      item: matchedItem,
      size,
      sugar,
      ice,
      toppings,
      quantity,
      note: "Đặt qua AI E-Commerce Agent",
      itemTotalPrice: totalItemPrice
    };

    const snackUpsell = MENU_ITEMS.find(m => m.id === "banh_trang_tron");

    return {
      reply: `🎉 **ĐÃ THÊM VÀO GIỎ HÀNG THÀNH CÔNG!** 🛒\n\n• **Món:** ${matchedItem.name}\n• **Quy cách:** Size ${size} | ${sugar} Đường | ${ice} Đá${toppings.length > 0 ? ` | Topping: ${toppings.map(t => t.name).join(", ")}` : ""}\n• **Số lượng:** ${quantity} phần\n• **Tạm tính:** **${totalItemPrice.toLocaleString("vi-VN")}đ**\n\n🛵 **Freeship 100% trong bán kính 3km** từ Đường số 20, An Nhơn, Gò Vấp!\n\n💡 **Gợi ý Combo 35k Tiết Kiệm:** Thêm ngay **Bánh tráng trộn NicoLatBai (15k)** để tiết kiệm 7.000đ khi đi kèm Trà sữa ạ!`,
      isRefusal: false,
      addedCartItem: newCartItem,
      upsellItem: snackUpsell,
      upsellTip: "Thêm Bánh tráng trộn (15k) để tạo Combo 35k tiết kiệm 7.000đ!",
      quickActions: [
        { label: "🛒 Mở giỏ hàng & Thanh toán", action: "open_cart" },
        { label: "➕ Thêm Bánh Tráng Trộn (15k)", action: "add_item", payload: snackUpsell },
        { label: "🧋 Đặt thêm món nước khác", action: "ask_query", payload: "Xem thêm các món nước ngon khác của quán" }
      ]
    };
  }

  // ==========================================
  // 8. E-COMMERCE: BÁN CHẠY (BESTSELLER) & TƯ VẤN SẢN PHẨM
  // ==========================================
  if (q.includes("món nào ngon") || q.includes("bestseller") || q.includes("uống gì") || q.includes("tư vấn") || q.includes("gợi ý") || q.includes("bán chạy") || q.includes("signature")) {
    const bestsellers = MENU_ITEMS.filter(m => m.isPopular);
    return {
      reply: `Dạ em là AI CSKH & Bán Hàng của **Trà Sữa NicoLatBai**! Đây là **Top Sản Phẩm Bán Chạy Nhất** đang được khách hàng Gò Vấp order liên tục hôm nay:\n\n1. 🧋 **Trà sữa truyền thống NicoLatBai** (22k - 32k): Vị trà mộc Bảo Lộc ủ đậm đà, béo ngậy vừa vặn, không ngọt gắt (Đánh giá ⭐ 4.9/5).\n2. 🍯 **Sữa tươi trân châu đường đen** (25k - 35k): Sữa thanh trùng béo ngậy sốt đường đen đậm đặc, trân châu nấu mới dẻo quánh (⭐ 5.0/5).\n3. 🍍 **Trà lài đác thơm** (20k - 30k): Chua ngọt giải nhiệt, hạt đác rim dẻo giòn cực đã.\n4. 🍟 **Bánh tráng trộn Tây Ninh** (15k - 25k): Bò rim, trứng cút, sốt tắc bò me cay cuốn hút!\n\n👇 **Anh/chị bấm nút bên dưới để chọn món hoặc bấm 'Thêm vào giỏ' ngay nhé:**`,
      isRefusal: false,
      suggestedItems: bestsellers,
      quickActions: [
        { label: "🧋 Lấy 1 Trà sữa truyền thống", action: "ask_query", payload: "Cho 1 ly trà sữa truyền thống size M" },
        { label: "🍯 Lấy 1 Sữa tươi đường đen", action: "ask_query", payload: "Cho 1 ly sữa tươi trân châu đường đen" },
        { label: "🎁 Xem Combo 35k Tiết Kiệm", action: "ask_query", payload: "Quán đang có khuyến mãi gì?" }
      ]
    };
  }

  // ==========================================
  // 9. E-COMMERCE: KHUYẾN MÃI, COMBO & TIẾT KIỆM (CONVERSION OPTIMIZATION)
  // ==========================================
  if (q.includes("khuyến mãi") || q.includes("ưu đãi") || q.includes("giảm giá") || q.includes("voucher") || q.includes("combo") || q.includes("quà tặng") || q.includes("chương trình") || q.includes("mã giảm")) {
    const promoItems = [MENU_ITEMS[0], MENU_ITEMS[4]]; // Trà sữa + Bánh tráng
    return {
      reply: `🎁 **CHƯƠNG TRÌNH KHUYẾN MÃI HOT NHẤT HÔM NAY TẠI TRÀ SỮA NICOLATBAI:**\n\n` +
        `1. 🛵 **FREESHIP 100% TRONG 3KM:** Miễn toàn bộ phí ship cho mọi đơn hàng (3.2km – 3.5km quán vẫn vui vẻ Freeship 100%)!\n` +
        `2. 🔥 **COMBO QUỐC DÂN 35.000đ:** 1 Trà sữa truyền thống (M) + 1 Bánh tráng trộn bò rim (tiết kiệm ngay 7.000đ so với giá gốc 42k).\n` +
        `3. 👫 **COMBO BẠN THÂN 65.000đ:** 2 Trà sữa truyền thống size M + 1 Đĩa Cá viên chiên giòn rụm (tiết kiệm 9.000đ).\n` +
        `4. 🍟 **COMBO ĂN VẶT NO NÊ 55.000đ:** 1 Bánh tráng trộn + 1 Cá viên chiên + 1 Khoai tây lắc phô mai (tiết kiệm 5.000đ).\n` +
        `5. 🏷️ **ƯU ĐÃI ĐẶT NHÓM:**\n` +
        `   • Mua từ **5 ly**: Giảm ngay **15.000đ** trực tiếp trên tổng bill.\n` +
        `   • Mua từ **10 ly**: TẶNG NGAY **1 ly Trà sữa size M** trị giá 22.000đ + Freeship tận nơi!\n` +
        `6. ⏰ **FLASH SALE GIỜ VÀNG (13:00 – 16:00):** Tặng kèm 01 phần Topping Trân châu đen dẻo cho mọi ly size L.\n` +
        `7. 🎁 **MÃ GIẢM GIÁ WEBSITE:** Nhập mã \`NICOLATBAI5K\` giảm ngay 5.000đ cho đơn hàng đầu tiên.\n\n` +
        `Anh/chị muốn lên đơn Combo 35k hay đặt món nào để em áp dụng ưu đãi ngay cho mình ạ? 👇`,
      isRefusal: false,
      suggestedItems: promoItems,
      promoNotice: "Áp dụng Freeship 3km + Combo 35k tự động khi thanh toán!",
      quickActions: [
        { label: "🎁 Lên đơn Combo 35k", action: "ask_query", payload: "Cho 1 trà sữa truyền thống và 1 bánh tráng trộn" },
        { label: "🛵 Kiểm tra phí ship địa chỉ mình", action: "ask_query", payload: "Địa chỉ của mình có được freeship không?" },
        { label: "👫 Thử Combo Bạn Thân 65k", action: "ask_query", payload: "Cho 2 trà sữa truyền thống và 1 cá viên chiên" }
      ]
    };
  }

  // ==========================================
  // 10. E-COMMERCE: GIỎ HÀNG, ĐỊA CHỈ & FREESHIP 3KM
  // ==========================================
  if (q.includes("freeship") || q.includes("phí ship") || q.includes("ship") || q.includes("ở đâu") || q.includes("địa chỉ") || q.includes("gò vấp") || q.includes("an nhơn")) {
    return {
      reply: `🛵 **CHÍNH SÁCH VẬN CHUYỂN TRÀ SỮA NICOLATBAI:**\n\n• **Địa chỉ quán:** Đường số 20, phường An Nhơn, Quận Gò Vấp, TP.HCM.\n• **Hotline đặt nhanh:** **${NICOLATBAI_INFO.hotline}**.\n• **ƯU ĐÃI VÀNG:** **FREESHIP 100% bán kính 3km** quanh quán (Dù chỉ đặt 1 ly vẫn freeship tận cửa)!\n• **Khu vực xa hơn 3km:** Quán hỗ trợ gọi shipper hỏa tốc với mức cước rẻ nhất thị trường.\n• *(Đặc biệt: Khách cách 3.2km – 3.5km quán vẫn vui vẻ Freeship luôn ạ!)*\n\nAnh/chị gửi em địa chỉ cụ thể để em lên đơn điều phối shipper giao ngay trong 20 phút nhé ạ!`,
      isRefusal: false,
      quickActions: [
        { label: "🛒 Mở giỏ hàng kiểm tra cước", action: "open_cart" },
        { label: "🧋 Xem thực đơn đặt ngay", action: "ask_query", payload: "Xem menu và bảng giá của quán" }
      ]
    };
  }

  // ==========================================
  // 11. BỘ CÂU HỎI KHÓ VÀ PHÀN NÀN (CUSTOMER RESOLUTION & RETENTION)
  // ==========================================
  // Khó 1: Khách phàn nàn vị trà bị chát / đắng / ngọt / ít trân châu
  if (q.includes("chát quá") || q.includes("đắng quá") || q.includes("ngọt quá") || q.includes("nhạt quá") || q.includes("ít trân châu") || q.includes("không ngon") || q.includes("dở")) {
    return {
      reply: `Dạ NicoLatBai vô cùng xin lỗi anh/chị vì trải nghiệm chưa trọn vẹn ạ! 🙇\n\nVới cam kết **100% Hài Lòng Khách Hàng**, quán em sẵn sàng **pha lại 1 ly mới hoàn toàn miễn phí** hoặc hoàn tiền ngay lập tức theo yêu cầu của mình. Anh/chị vui lòng alo gấp hotline **${NICOLATBAI_INFO.hotline}** để quản lý đổi ly mới giao hỏa tốc đến tận tay mình nhé ạ!`,
      isRefusal: false,
      quickActions: [
        { label: "📞 Gọi Hotline 038.397.8888", action: "ask_query", payload: "Cho mình số điện thoại hotline hỗ trợ" }
      ]
    };
  }

  // Khó 2: Khách giục đơn / phàn nàn giao trễ
  if (q.includes("chưa thấy giao") || q.includes("sao lâu thế") || q.includes("đặt lâu quá") || q.includes("chờ cả tiếng") || q.includes("giao trễ") || q.includes("đang ở đâu rồi")) {
    return {
      reply: `Dạ em xin lỗi vì để anh/chị phải sốt ruột chờ đợi ạ! Em đang kết nối hệ thống điều phối giao vận, anh/chị cho em xin **Số điện thoại nhận hàng** hoặc bấm gọi hotline **${NICOLATBAI_INFO.hotline}** để nhân viên hối thúc tài xế phóng nhanh giao tới cửa cho mình ngay nhé ạ!`,
      isRefusal: false
    };
  }

  // Khó 3: Ly nước bị đổ, bể, rách màng ép khi giao đến
  if (q.includes("bị đổ") || q.includes("bể ly") || q.includes("rách màng") || q.includes("chảy nước") || q.includes("bị tràn")) {
    return {
      reply: `Dạ NicoLatBai xin chịu trách nhiệm 100% nếu có sự cố rủi ro trong lúc shipper vận chuyển ạ! Quán cam kết **giao bù ly mới nguyên vẹn 100% miễn phí** hoặc hoàn tiền ngay. Anh/chị gọi nhanh hotline **${NICOLATBAI_INFO.hotline}** để quán bù đơn ngay lập tức ạ!`,
      isRefusal: false
    };
  }

  // Khó 4: 3.2km - 3.5km có freeship không?
  if (q.includes("3.2km") || q.includes("3.5km") || q.includes("hơn 3km xíu") || q.includes("gần 3km") || q.includes("xa hơn 3km một chút")) {
    return {
      reply: `Dạ tuyệt vời ạ! Với khoảng cách chỉ nhỉnh hơn 3km một xíu (3.2km – 3.5km), quán em **hỗ trợ FREESHIP 100%** tặng anh/chị luôn ạ! 🎉 Anh/chị nhắn địa chỉ và món muốn uống để em cho shipper lên đường ngay nhé!`,
      isRefusal: false,
      suggestedItems: MENU_ITEMS.slice(0, 2)
    };
  }

  // Khó 5: Công thức bí mật
  if (q.includes("công thức") || q.includes("cách làm") || q.includes("bí quyết") || q.includes("ủ trà mấy phút") || q.includes("dạy pha")) {
    return {
      reply: `Dạ công thức ủ trà mộc Bảo Lộc và bí quyết nấu trân châu dẻo óng ả là độc quyền gia truyền của NicoLatBai ạ! Cách thưởng thức chuẩn vị nhất là anh/chị cứ lên đơn, bên em freeship 3km giao tận bàn phục vụ mình trong tích tắc ạ! 😊`,
      isRefusal: false,
      suggestedItems: [MENU_ITEMS[0]]
    };
  }

  // Khó 6: So sánh thương hiệu (Phúc Long, Phê La, Koi...)
  if (q.includes("phúc long") || q.includes("phê la") || q.includes("koi") || q.includes("gong cha") || q.includes("tocotoco") || q.includes("so với")) {
    return {
      reply: `Dạ mỗi thương hiệu đều có nét hay riêng, còn **NicoLatBai** tự tin định vị dòng trà sữa truyền thống: **Cốt trà ủ mộc thơm nồng, hậu vị đậm đà, sữa thanh béo mịn** và trân châu nấu mới mỗi 3 tiếng. Đặc biệt mức giá cực kỳ dễ chịu (chỉ 22k–35k) mà nguyên liệu đạt chuẩn ATTP 100%, bảo đảm uống là ghiền ạ!`,
      isRefusal: false,
      suggestedItems: [MENU_ITEMS[0], MENU_ITEMS[1]]
    };
  }

  // Khó 7: Ăn chay / Dị ứng lactose / Mẹ bầu / Mất ngủ
  if (q.includes("ăn chay") || q.includes("thuần chay") || q.includes("lactose") || q.includes("dị ứng") || q.includes("mẹ bầu") || q.includes("mang thai") || q.includes("mất ngủ") || q.includes("say trà")) {
    const fruitDrinks = MENU_ITEMS.filter(m => m.category === "fruit_tea" || m.id === "sua_tuoi_duong_den");
    return {
      reply: `🌿 **TƯ VẤN SỨC KHỎE TỪ CHUYÊN VIÊN E-COMMERCE:**\n\n• **Dị ứng lactose / Thuần chay:** Chọn ngay **Trà lài đác thơm** hoặc **Trà dâu tằm thanh mát** (100% trái cây tự nhiên, không sữa).\n• **Mẹ bầu / Trẻ nhỏ / Sợ mất ngủ buổi tối:** Chọn **Sữa tươi trân châu đường đen** (không chứa trà/caffeine) hoặc Trà dâu tằm mức 50% đường rất an toàn, thanh nhiệt.\n• **Ăn kiêng:** Mức 50% đường kèm Topping Trân châu trắng giòn siêu ít calo!\n\n👇 **Các món phù hợp nhất dành cho anh/chị:**`,
      isRefusal: false,
      suggestedItems: fruitDrinks,
      quickActions: [
        { label: "🍍 Thêm Trà lài đác thơm (20k)", action: "add_item", payload: MENU_ITEMS[2] },
        { label: "🍓 Thêm Trà dâu tằm (20k)", action: "add_item", payload: MENU_ITEMS[3] }
      ]
    };
  }

  // Khó 8: Bảo quản tủ lạnh
  if (q.includes("bảo quản") || q.includes("để qua đêm") || q.includes("tủ lạnh") || q.includes("trân châu bị cứng") || q.includes("lại gạo") || q.includes("mấy ngày")) {
    return {
      reply: `🧊 **HƯỚNG DẪN BẢO QUẢN CHUẨN VỊ:**\n• Trà sữa đậy kín để ngăn mát tủ lạnh (4-8°C) ngon nhất trong vòng 24–48h.\n• **Lưu ý trân châu:** Gặp lạnh trân châu sẽ cứng lại. Anh/chị dặn quán để riêng trân châu; nếu lỡ để tủ lạnh, chỉ cần quay lò vi sóng 20–30 giây là dẻo dai thơm lừng như mới nấu ạ!`,
      isRefusal: false
    };
  }

  // Khó 9: Giờ mở cửa / Giờ làm việc (Kiểm tra thời gian thực)
  if (
    q.includes("giờ làm việc") || 
    q.includes("mấy giờ mở") || 
    q.includes("mấy giờ đóng") || 
    q.includes("giờ mở cửa") || 
    q.includes("mở cửa lúc mấy giờ") || 
    q.includes("còn mở cửa không") || 
    q.includes("còn mở không") || 
    q.includes("giờ hoạt động") ||
    q.includes("mở cửa chưa") ||
    q.includes("giờ này có ship không") ||
    q.includes("bây giờ quán có mở không") ||
    q.includes("quán có mở không")
  ) {
    const storeStatus = checkStoreRealTimeStatus();
    return {
      reply: storeStatus.directAnswerVi,
      isRefusal: false,
      quickActions: [
        { label: "🧋 Xem Menu & Đặt Ngay", action: "ask_query", payload: "Xem menu và bảng giá của quán" },
        { label: "🎉 Xem Khuyến Mãi Hot", action: "ask_query", payload: "Quán đang có khuyến mãi gì?" }
      ]
    };
  }

  // Khó 10: Tùy chỉnh Đường Đá
  if (q.includes("đường") || q.includes("đá") || q.includes("ngọt") || q.includes("mang về") || q.includes("mang đi")) {
    return {
      reply: `🧊 **QUY CHUẨN TÙY BIẾN ĐƯỜNG & ĐÁ TẠI NICOLATBAI:**\n\n• **Đường:** 100% (bình thường) | **70% (Ít ngọt - Chuẩn gu nhất)** | 50% (ngọt nhẹ thanh khiết).\n• **Đá:** 100% (đầy đá mát lạnh) | 70% (mát vừa) | **50% (Khuyên dùng khi mang về xa để đá tan ra không bị nhạt nước)**.\n• Topping giòn dẻo (5k–8k): Trân châu đen, trắng giòn, hoàng kim, pudding flan trứng béo mịn.\n\nAnh/chị muốn chỉnh ly nước theo mức nào để em báo quầy pha chế chính xác 100% nhé!`,
      isRefusal: false,
      quickActions: [
        { label: "🧋 Đặt Trà Sữa 70% Đường 50% Đá", action: "ask_query", payload: "Cho 1 ly trà sữa truyền thống 70 đường 50 đá" }
      ]
    };
  }

  // ==========================================
  // 12. BẢNG GIÁ & MENU TỔNG HỢP
  // ==========================================
  if (q.includes("menu") || q.includes("thực đơn") || q.includes("giá") || q.includes("bảng giá") || q.includes("bao nhiêu")) {
    return {
      reply: `📜 **BẢNG GIÁ NIÊM YẾT CHÍNH THỨC TẠI TRÀ SỮA NICOLATBAI:**\n\n• **Trà sữa truyền thống NicoLatBai:** 22.000đ (M) – 32.000đ (L)\n• **Sữa tươi trân châu đường đen:** 25.000đ (M) – 35.000đ (L)\n• **Trà lài đác thơm:** 20.000đ (M) – 30.000đ (L)\n• **Trà dâu tằm thanh mát:** 20.000đ (M) – 30.000đ (L)\n• **Ăn vặt (Bánh tráng trộn / Cá viên chiên / Khoai tây lắc):** 15.000đ – 25.000đ\n• **Topping thêm (5k - 8k):** Trân châu đen, trắng, hoàng kim, pudding trứng.\n\n🛵 **Freeship 100% trong bán kính 3km.** Anh/chị chọn món bên dưới để em thêm vào giỏ nhé! 👇`,
      isRefusal: false,
      suggestedItems: MENU_ITEMS,
      quickActions: [
        { label: "🧋 Đặt Trà Sữa Truyền Thống", action: "add_item", payload: MENU_ITEMS[0] },
        { label: "🍯 Đặt Sữa Tươi Đường Đen", action: "add_item", payload: MENU_ITEMS[1] },
        { label: "🍟 Đặt Bánh Tráng Trộn", action: "add_item", payload: MENU_ITEMS[4] }
      ]
    };
  }

  // ==========================================
  // 13. CHỐT ĐƠN HỎA TỐC (CHECKOUT / XÁC NHẬN)
  // ==========================================
  if (q.includes("chốt đơn") || q.includes("thanh toán") || q.includes("giao đến") || /\b0[35789][0-9]{8}\b/.test(q)) {
    return {
      reply: `🚀 **XÁC NHẬN ĐƠN HÀNG HỎA TỐC NICOLATBAI!**\n\nEm đã tiếp nhận thông tin đơn hàng và chuyển ngay cho quầy pha chế. Shipper sẽ liên hệ giao hàng tận cửa cho anh/chị trong 15-20 phút nữa ạ!\n\n• **Phí giao hàng:** **FREESHIP 100%** (trong 3km Gò Vấp).\n• **Hotline hỗ trợ gấp:** **${NICOLATBAI_INFO.hotline}**.\n\nAnh/chị có thể bấm nút **'Mở giỏ hàng & Thanh toán'** bên dưới để kiểm tra lại toàn bộ chi tiết đơn nhé ạ! Cảm ơn anh/chị nhiều! ❤️`,
      isRefusal: false,
      quickActions: [
        { label: "🛒 Xem Chi Tiết Giỏ Hàng", action: "open_cart" }
      ]
    };
  }

  // ==========================================
  // 14. CHÀO HỎI & ONBOARDING MẶC ĐỊNH
  // ==========================================
  return {
    reply: `Dạ Trà Sữa NicoLatBai xin kính chào anh/chị ạ! 🧋✨\n\nEm là **NicoBot - AI E-Commerce Shopping Agent** của quán. Em có thể giúp anh/chị:\n• 🌟 **Gợi ý món bestseller chuẩn gu** theo sở thích\n• 🛒 **Thêm món & tự động tính giá** vào giỏ hàng\n• 🎁 **Áp dụng Freeship 3km & Combo 35k** tiết kiệm\n• ⏰ **Báo giờ làm việc (08:30 – 22:30)** & giải đáp mọi thắc mắc\n\n*(Lưu ý: Quán em chỉ kinh doanh trà sữa và đồ ăn vặt có trong menu thôi ạ!)*\n\nAnh/chị muốn thưởng thức món trà sữa hay ăn vặt nào hôm nay ạ? 👇`,
    isRefusal: false,
    suggestedItems: MENU_ITEMS.slice(0, 3),
    quickActions: [
      { label: "🌟 Xem Bestseller", action: "ask_query", payload: "Quán có món nào ngon tư vấn cho mình với?" },
      { label: "🎁 Xem Khuyến Mãi Hot", action: "ask_query", payload: "Quán đang có khuyến mãi gì?" },
      { label: "🛵 Kiểm Tra Freeship 3km", action: "ask_query", payload: "Quán ở đâu và có freeship không?" }
    ]
  };
}
