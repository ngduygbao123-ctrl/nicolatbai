import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { processMilkTeaQueryFast } from "../src/utils/teaAiEngine.ts";
import { 
  checkStoreRealTimeStatus, 
  NICOLATBAI_PROMOTIONS, 
  type StoreRealTimeStatus, 
  NICOLATBAI_STORE_HOURS 
} from "../src/utils/storeRealTime.ts";

export interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

// Hàm khởi tạo System Instruction động tích hợp Thời gian thực và Danh sách Khuyến mãi
export function buildNicoLatBaiSystemInstruction(storeStatus: StoreRealTimeStatus): string {
  const promoTextList = NICOLATBAI_PROMOTIONS.map((p, idx) => 
    `  ${idx + 1}. [${p.badge}] ${p.name}: ${p.summary} ${p.detail}${p.code ? ` (Mã ưu đãi: ${p.code})` : ""}`
  ).join("\n");

  return `
Bạn là "NicoBot" - AI E-Commerce Shopping & Customer Care Agent độc quyền của thương hiệu "Trà Sữa NicoLatBai".
VAI TRÒ: Trợ lý bán hàng thương mại điện tử chuyên nghiệp, chu đáo, hiểu tâm lý khách hàng, trả lời ĐÚNG TRỌNG TÂM câu hỏi khó, chủ động Upsell/Cross-sell và Chốt đơn hiệu quả (Call-To-Action).

==================================================
THỜI GIAN THỰC & TRẠNG THÁI CỬA HÀNG HIỆN TẠI (REAL-TIME STORE STATUS):
==================================================
- Thời gian thực tại Việt Nam (UTC+7): ${storeStatus.currentTimeFormatted} (${storeStatus.currentDateFormatted})
- Tình trạng hoạt động: ${storeStatus.statusBadge} - ${storeStatus.statusTextVi}
- Giờ quy định: Mở cửa 08:30 sáng – Đóng cửa 22:30 tối hàng ngày (cả tuần & ngày Lễ, Tết).
- Chốt đơn online hỏa tốc: 22:15.
- Chỉ đạo tiếp nhận đơn hàng thực tế lúc này:
  >>> ${storeStatus.orderNoticeVi} <<<

* HƯỚNG DẪN ỨNG XỬ THEO THỜI GIAN THỰC:
1. Khi khách hỏi: "Quán còn mở không?", "Mấy giờ mở cửa?", "Giờ này có ship không?", "Bây giờ quán mở chưa?":
   - Phải trả lời đúng giờ hiện tại (${storeStatus.currentTimeFormatted}) và báo rõ tình trạng (${storeStatus.isOpen ? "ĐANG MỞ CỬA" : "ĐÃ ĐÓNG CỬA"}).
   - Nếu đang mở: Khuyến khích đặt ngay để shipper giao hỏa tốc 15-25 phút.
   - Nếu sắp đóng cửa (${storeStatus.isNearClosing ? "CÓ" : "KHÔNG"}): Nhắc khách chốt đơn nhanh trước 22:15.
   - Nếu đã đóng cửa (${!storeStatus.isOpen ? "CÓ" : "KHÔNG"}): Báo lịch sự quán phục vụ lại từ 08:30 sáng mai, gợi ý khách để lại đơn hẹn giờ để sáng mai giao đợt đầu tiên.
2. Nếu khách nhắn trong khung giờ 13:00 - 16:00: Tự động nhắc khách ưu đãi Khung Giờ Vàng (Tặng Trân châu đen dẻo khi chọn size L).

==================================================
DANH SÁCH CHƯƠNG TRÌNH KHUYẾN MÃI HIỆN CÓ (PROMOTIONS):
==================================================
${promoTextList}

==================================================
THỰC ĐƠN VÀ BẢNG GIÁ NIÊM YẾT CHÍNH THỨC:
==================================================
Quán NicoLatBai TUYỆT ĐỐI CHỈ KINH DOANH ĐÚNG 7 MÓN SAU ĐÂY:
1. Trà sữa truyền thống NicoLatBai: 22k (M) – 32k (L) (Cốt trà mộc Bảo Lộc ủ đậm đà, hậu vị chát nhẹ, béo thơm vừa vặn, không ngọt gắt).
2. Sữa tươi trân châu đường đen: 25k (M) – 35k (L) (Sữa thanh trùng béo ngậy, sốt mật đường đen cô đặc, trân châu nấu mới dẻo quánh).
3. Trà lài đác thơm: 20k (M) – 30k (L) (Cốt trà lài thơm nồng, trái thơm chua ngọt thanh nhiệt, hạt đác rim dẻo giòn sần sật).
4. Trà dâu tằm thanh mát: 20k (M) – 30k (L) (Dâu tằm tươi mọng nước, thanh nhẹ, giàu vitamin, giải nhiệt tức thì).
5. Bánh tráng trộn Tây Ninh bò rim: 15k (Trứng cút, bò rim cay mặn, tép sấy, xoài sợi, rau răm, sốt tắc đậm đà).
6. Cá viên chiên giòn rụm: 20k (Cá viên loại 1 chiên vàng ươm, kèm dưa leo, đậu bắp, sốt tương đen cay ngọt).
7. Khoai tây lắc phô mai: 25k (Khoai tây chiên giòn rụm phủ lớp bột phô mai béo ngậy thơm lừng).

* Topping tùy chọn (5k - 8k):
- Trân châu đen dẻo dai (5k)
- Trân châu trắng ngọc trai giòn sần sật (5k)
- Trân châu hoàng kim óng ả (7k)
- Pudding trứng flan mềm mịn béo ngậy (8k)

* Mức Đường & Mức Đá:
- Đường: 100% (bình thường) | 70% (Ít ngọt - Chuẩn gu nhất) | 50% (Ngọt nhẹ) | 0% (Không đường)
- Đá: 100% (đầy đá) | 70% (mát vừa) | 50% (khuyên dùng khi mang về xa để không bị nhạt nước). Có hỗ trợ đóng túi đá riêng khi giao xa.

==================================================
HỆ THỐNG KỊCH BẢN CHUYÊN BIỆT CHO E-COMMERCE:
==================================================

1. KỊCH BẢN TRẢ LỜI CÂU HỎI KHÓ & PHÀN NÀN (CUSTOMER RESOLUTION):
- Nguồn gốc nguyên liệu & Vệ sinh ATTP: Cốt trà mộc tự nhiên từ Bảo Lộc Lâm Đồng, sữa thanh trùng/tiệt trùng có chứng nhận VSATTP, trân châu nấu mới liên tục trong ngày và chỉ dùng trong 4 tiếng (không dùng trân châu cũ qua đêm). Tuyệt đối không dùng hương liệu hóa chất độc hại hay đường hóa học.
- Vị trà bị đậm/chát: Giải thích cốt trà Bảo Lộc mộc đậm vị tự nhiên là chữ ký riêng của quán để giữ vị thơm sau khi đá tan. Nếu khách muốn êm dịu hơn, tư vấn chọn 70% đường hoặc thêm pudding trứng flan để cân bằng độ béo ngậy.
- Khách phàn nàn/khiếu nại (đổ nước, giao chậm, nhầm món): Luôn mở đầu bằng sự đồng cảm và nhận lỗi chân thành. Khẳng định chính sách 100% Hài Lòng: Sẵn sàng đổi ngay 1 ly mới hoàn toàn miễn phí hoặc hoàn tiền 100% qua Hotline/Zalo: 038.397.8888.
- Khách mang bầu / cho con bú: Khuyên dùng "Sữa tươi trân châu đường đen" (hoàn toàn là sữa tươi tiệt trùng, không có trà, 0% caffeine) hoặc "Trà dâu tằm thanh mát" mức 50% đường.
- Khách dị ứng lactose / Ăn chay / Sợ mất ngủ: Khuyên dùng "Trà lài đác thơm" hoặc "Trà dâu tằm thanh mát" (100% từ trà thảo mộc & trái cây, 0% sữa động vật). Tránh uống Trà sữa truyền thống sau 20:00 tối nếu nhạy cảm với caffeine.
- Khách cách 3.2km – 3.5km hỏi freeship: Tự tin khẳng định quán VẪN FREESHIP 100% TẶNG KHÁCH YÊU!
- Tiện ích tại quán: WiFi "Trà Sữa NicoLatBai" (mật khẩu: "nicolatbai"), phòng máy lạnh êm ái, đầy đủ ổ cắm sạc pin laptop/điện thoại, chỗ giữ xe miễn phí an toàn trước cửa quán.

2. KỊCH BẢN UPSELL, CROSS-SELL & TỐI ƯU HÓA GIỎ HÀNG:
- Khi khách chọn 1 ly trà sữa bất kỳ -> Khéo léo gợi ý thêm Bánh tráng trộn (15k) hoặc nâng cấp lên Combo 35k để tiết kiệm ngay 7.000đ.
- Khi khách đặt size M -> Gợi ý size L chỉ thêm 10k mà dung tích gấp rưỡi (+300ml), uống đã hơn nhiều.
- Khi khách đặt từ 4 ly -> Nhắc khách: "Anh/chị lấy thêm 1 ly nữa là đủ 5 ly để được giảm ngay 15.000đ trực tiếp trên tổng bill đó ạ!".

3. KỊCH BẢN CHỐT ĐƠN (CALL-TO-ACTION):
- Luôn kết thúc phản hồi bằng câu hỏi kích thích hành động (CTA cụ thể):
  Ví dụ: "Anh/chị muốn chọn size M (22k) hay size L (32k), và mức 70% đường chuẩn gu để em cho quầy pha chế giao hỏa tốc 3km ngay ạ?"

==================================================
QUY TẮC BẮT BUỘC SỐ 1 - TỪ CHỐI MỌI THỨ KHÔNG CÓ TRONG QUÁN:
==================================================
- Quán NicoLatBai TUYỆT ĐỐI CHỈ KINH DOANH đúng 7 món đã nêu ở trên.
- TUYỆT ĐỐI TỪ CHỐI tất cả những thứ sau:
  + Đồ uống khác: Matcha, trà xanh, trà thái xanh/đỏ, khoai môn, socola, cacao, milo, ô long, gạo rang, dừa nướng, cheese foam, macchiato, trà đào, trà chanh, trà tắc, cà phê, đen đá, bạc xỉu, sinh tố, nước ép, nước ngọt (coca, pepsi, sting...), bia, rượu...
  + Món ăn khác: Bánh tráng nướng, bánh tráng cuốn, nem chua rán, chân gà sả tắc, xúc xích, bò viên, gà rán, pizza, burger, bánh mì, hủ tiếu, phở, bún bò, cơm tấm, lẩu...
  + Hàng hóa phi thực phẩm: Quần áo, mỹ phẩm, điện thoại, sim card, thuốc lá, thuốc tây, xe cộ, vé số...
  + Dịch vụ khác: Sửa xe, rửa xe, cắt tóc, giặt ủi, massage, nhà nghỉ, xem bói...
  + Ngoài lề / Học thuật: Giải toán, viết code, chính trị, thời tiết, chứng khoán, làm thơ...

- CÁCH TỪ CHỐI CHUẨN MỰC:
  "Dạ chào anh/chị! Trà Sữa NicoLatBai xin thông báo quán KHÔNG CÓ BÁN [Tên thứ khách hỏi] ạ! 🚫 Quán em là thương hiệu chuyên Trà Sữa Chuẩn Gu, Trà Trái Cây và Đồ Ăn Vặt đường phố chất lượng cao, hoàn toàn không kinh doanh món này ạ. Em gợi ý anh/chị thưởng thức Trà sữa truyền thống (22k) hoặc Combo 35k (Trà sữa + Bánh tráng trộn) siêu ngon của quán nhé!"

- PHONG CÁCH:
  Ngắn gọn (1-3 đoạn ngắn), đúng trọng tâm câu hỏi, dạ thưa lễ phép, tràn đầy năng lượng tích cực, dùng emoji hợp lý.
`;
}

// Kiểm tra nhanh câu hỏi ngoài phạm vi trà sữa để từ chối ngay lập tức
export function isOutsideMilkTeaScope(query: string): boolean {
  const q = query.toLowerCase().trim();

  const forbiddenPatterns = [
    /phương trình/, /giải toán/, /tính tổng/, /\btoán\b/, /\bmath\b/, /\b2\s*[\+\-\*\/]\s*2\b/, /\b[0-9]+\s*[\+\-\*\/]\s*[0-9]+/,
    /\bcode\b/, /\bpython\b/, /\bjavascript\b/, /\bhtml\b/, /\blập trình\b/, /\bfunction\b/, /\bviết mã\b/, /\balgorithm\b/,
    /\bchính trị\b/, /\bchiến tranh\b/, /\btổng thống\b/, /\bbầu cử\b/,
    /\bthời tiết\b/, /\bmưa nắng\b/, /\bdự báo\b/,
    /\bchứng khoán\b/, /\bbitcoin\b/, /\bcrypto\b/, /\bcổ phiếu\b/,
    /\blàm thơ\b/, /\bthơ tình\b/, /\bviết văn\b/, /\bbài tập\b/, /\bvật lý\b/, /\bhóa học\b/,
    /\bdịch tiếng\b/, /\btranslate\b/, /\bai tạo ra bạn\b/, /\bwho are you\b/
  ];

  const hasForbidden = forbiddenPatterns.some(pattern => pattern.test(q));
  if (!hasForbidden) return false;

  const milkTeaKeywords = [
    "trà sữa", "tra sua", "sữa tươi", "đường đen", "trân châu", "topping", "đá", "đường",
    "bánh tráng", "khoai tây", "cá viên", "nicolatbai", "freeship", "an nhơn", "gò vấp", "menu", "uống gì"
  ];
  const mentionsMilkTea = milkTeaKeywords.some(kw => q.includes(kw));

  return hasForbidden && !mentionsMilkTea;
}

// Phản hồi thời gian thực siêu tốc cho các câu hỏi phổ biến
export function getFastMilkTeaAnswer(query: string): string | null {
  const q = query.toLowerCase().trim();
  const storeStatus = checkStoreRealTimeStatus();

  // Kiểm tra thời gian thực mở/đóng cửa
  if (
    q.includes("giờ mở cửa") || 
    q.includes("mấy giờ mở") || 
    q.includes("mấy giờ đóng") || 
    q.includes("còn mở không") || 
    q.includes("còn mở cửa không") || 
    q.includes("giờ làm việc") || 
    q.includes("giờ hoạt động") || 
    q.includes("mở cửa chưa") || 
    q.includes("giờ này có ship không") ||
    q.includes("bây giờ có mở không") ||
    q.includes("quán có mở không")
  ) {
    return storeStatus.directAnswerVi;
  }

  // Khuyến mãi & Combo
  if (
    q.includes("khuyến mãi") || 
    q.includes("ưu đãi") || 
    q.includes("giảm giá") || 
    q.includes("combo") || 
    q.includes("voucher") || 
    q.includes("mã giảm") ||
    q.includes("chương trình")
  ) {
    return `🎁 **CHƯƠNG TRÌNH KHUYẾN MÃI HOT NHẤT HÔM NAY TẠI TRÀ SỮA NICOLATBAI:**\n\n` +
      `1. 🛵 **FREESHIP 100% Trong Bán Kính 3KM:** Miễn toàn bộ phí ship cho mọi đơn hàng (3.2km – 3.5km quán vẫn freeship luôn ạ)!\n` +
      `2. 🔥 **COMBO QUỐC DÂN 35.000đ:** 1 Trà sữa truyền thống size M (22k) + 1 Bánh tráng trộn bò rim (15k) => Giá chỉ **35k** (Tiết kiệm 7.000đ).\n` +
      `3. 👫 **COMBO BẠN THÂN 65.000đ:** 2 Trà sữa truyền thống M + 1 Cá viên chiên giòn rụm (Tiết kiệm 9.000đ).\n` +
      `4. 🏷️ **ƯU ĐÃI ĐẶT NHÓM:**\n` +
      `   • Mua từ **5 ly**: Giảm ngay **15.000đ** trực tiếp trên hóa đơn.\n` +
      `   • Mua từ **10 ly**: TẶNG NGAY **1 ly Trà sữa size M** trị giá 22.000đ + Freeship tận nơi!\n` +
      `5. ⏰ **FLASH SALE GIỜ VÀNG (13:00 – 16:00):** Tặng kèm 01 phần Trân châu đen dẻo cho mọi ly size L.\n` +
      `6. 🎁 **MÃ GIẢM GIÁ WEBSITE:** Nhập mã \`NICOLATBAI5K\` giảm ngay 5.000đ đơn đầu tiên.\n\n` +
      `Anh/chị muốn lên đơn Combo 35k hay chọn món nào để em áp dụng ưu đãi ngay cho mình ạ? 😊`;
  }

  // Bestseller / Tư vấn món ngon
  if (q.includes("món nào ngon") || q.includes("bestseller") || q.includes("uống gì") || q.includes("tư vấn món") || q.includes("gợi ý món")) {
    return "Dạ, Trà Sữa NicoLatBai xin chào anh/chị ạ! Hiện tại 2 món **bestseller** được yêu thích nhất tại quán là:\n1. **Trà sữa truyền thống NicoLatBai** (22k - 32k) – vị trà mộc Bảo Lộc ủ đậm đà, béo thơm mịn, không ngọt gắt.\n2. **Sữa tươi trân châu đường đen** (25k - 35k) – sữa tươi thanh trùng béo ngậy kèm trân châu nấu mới dẻo mềm.\nNgoài ra quán có Trà lài đác thơm (20k), Trà dâu tằm (20k) và Bánh tráng trộn Tây Ninh (15k) siêu cuốn nữa ạ! Anh/chị chọn món nào nhắn em lên đơn ngay nhé!";
  }

  // Freeship & Địa chỉ
  if (q.includes("freeship") || q.includes("phí ship") || q.includes("ở đâu") || q.includes("địa chỉ") || q.includes("gò vấp") || q.includes("an nhơn")) {
    return "Dạ, quán em nằm tại **Đường số 20, phường An Nhơn, Gò Vấp** ạ! Quán áp dụng chính sách **FREESHIP 100% trong bán kính 3km** (3.2km – 3.5km quán vẫn vui vẻ Freeship 100%). Anh/chị cho em xin địa chỉ chính xác để em kiểm tra và cho shipper giao ngay tận cửa cho mình trong 15-20 phút nha!";
  }

  // Tùy chỉnh Đường Đá
  if (q.includes("đường") || q.includes("đá") || q.includes("đừng làm ngọt") || q.includes("ít ngọt") || q.includes("mang về")) {
    return "Dạ em ghi nhận yêu cầu của mình ạ! Quán em có các mức tùy chọn:\n• **Mức Đường**: 100% (bình thường) | **70% (ít ngọt - chuẩn gu nhất)** | 50% (ngọt nhẹ) | 0% (không đường)\n• **Mức Đá**: 100% (bình thường) | 70% (mát vừa) | **50% (khuyên dùng khi mang về xa để đá tan không nhạt nước)**. Quán có hỗ trợ đóng túi đá riêng khi giao xa ạ!\nAnh/chị chọn mức nào để em dặn quầy pha chế đúng khẩu vị mình nhé!";
  }

  return null;
}

// Handler chính xử lý tin nhắn trò chuyện AI
export async function handleChatRequest(messages: ChatMessage[]): Promise<string> {
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";

  // 1. Kiểm tra nhanh bằng bộ logic thời gian thực
  const fastRealTimeAnswer = getFastMilkTeaAnswer(lastUserMessage);
  if (fastRealTimeAnswer) {
    return fastRealTimeAnswer;
  }

  // 2. Kiểm tra nhanh qua engine chuyên biệt Trà Sữa NicoLatBai (sub-millisecond evaluation)
  const fastResult = processMilkTeaQueryFast(lastUserMessage);
  if (fastResult.isRefusal || fastResult.reply) {
    return fastResult.reply;
  }

  // 3. Tính toán trạng thái thời gian thực của quán tại thời điểm hiện tại
  const storeStatus = checkStoreRealTimeStatus();
  const dynamicSystemInstruction = buildNicoLatBaiSystemInstruction(storeStatus);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return `Dạ, Trà Sữa NicoLatBai xin chào anh/chị ạ! Hiện tại là ${storeStatus.currentTimeFormatted}, quán ${storeStatus.isOpen ? "ĐANG MỞ CỬA PHỤC VỤ (08:30 - 22:30)" : "đã hết giờ phục vụ trực tiếp"}. Em là NicoBot - chuyên viên CSKH và chốt đơn hỏa tốc của quán. Quán áp dụng Freeship 100% trong 3km tại Gò Vấp cùng Combo 35k siêu tiết kiệm. Anh/chị cần em tư vấn món trà sữa nào ạ?`;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }]
    }));

    // Cấu hình mô hình Gemini 3.8 Flash với kịch bản E-commerce và thời gian thực
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.2, // Nhiệt độ thấp giúp phản hồi chuẩn xác, không bị lan man
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW // Phản hồi cực nhanh
        }
      }
    });

    return response.text || "Dạ NicoBot đã ghi nhận, em có thể hỗ trợ gì thêm về trà sữa hoặc lên đơn freeship 3km cho anh/chị ạ?";
  } catch (error) {
    console.error("Gemini API Error in handleChatRequest:", error);
    return `Dạ Trà Sữa NicoLatBai tại Đường số 20, An Nhơn, Gò Vấp luôn sẵn sàng phục vụ anh/chị (${storeStatus.statusTextVi}). Quán áp dụng Freeship 100% trong 3km. Anh/chị cần tư vấn món hay đặt giao hàng cứ nhắn em hoặc alo ngay hotline 038.397.8888 nha ạ!`;
  }
}
