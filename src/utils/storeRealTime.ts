// Logic tính toán thời gian thực theo múi giờ Việt Nam (Asia/Ho_Chi_Minh - UTC+7)
// và Danh sách chương trình Khuyến Mãi chính thức của Trà Sữa NicoLatBai

export interface StoreRealTimeStatus {
  isOpen: boolean;
  isNearClosing: boolean; // 22:00 - 22:30
  isNearOpening: boolean; // 08:00 - 08:30
  currentTimeFormatted: string; // VD: "14:35"
  currentDateFormatted: string; // VD: "Chủ Nhật, ngày 18/10/2026"
  currentHour: number;
  currentMinute: number;
  statusBadge: "OPEN" | "CLOSED" | "CLOSING_SOON" | "OPENING_SOON";
  statusTextVi: string;
  orderNoticeVi: string;
  directAnswerVi: string;
}

export interface StorePromotion {
  id: string;
  name: string;
  badge: string;
  summary: string;
  detail: string;
  code?: string;
  isAutoApplied: boolean;
  highlightText: string;
}

export const NICOLATBAI_STORE_HOURS = {
  openHour: 8,
  openMinute: 30, // 08:30
  closeHour: 22,
  closeMinute: 30, // 22:30
  lastOrderHour: 22,
  lastOrderMinute: 15, // 22:15 chốt đơn online hỏa tốc
  daysOpen: "Thứ 2 đến Chủ Nhật (Phục vụ xuyên suốt cả tuần & Lễ, Tết)"
};

// Danh sách chương trình khuyến mãi tích hợp vào Ngữ Cảnh AI
export const NICOLATBAI_PROMOTIONS: StorePromotion[] = [
  {
    id: "freeship_3km",
    name: "FREESHIP 100% Trong Bán Kính 3KM",
    badge: "Freeship Toàn Diện",
    summary: "Miễn phí 100% phí giao hàng cho mọi đơn trong bán kính 3km quanh quán tại An Nhơn, Gò Vấp.",
    detail: "Áp dụng cho mọi giá trị đơn (dù chỉ đặt 1 ly). Khách cách 3.2km – 3.5km quán vẫn vui vẻ Freeship 100%!",
    isAutoApplied: true,
    highlightText: "🛵 Freeship 100% trong 3km (3.5km vẫn freeship)"
  },
  {
    id: "combo_35k",
    name: "Combo Quốc Dân 35.000đ (Bestseller)",
    badge: "Tiết Kiệm 7k",
    summary: "1 Trà Sữa Truyền Thống size M (22k) + 1 Bánh Tráng Trộn Bò Rim (15k) => Giá chỉ 35.000đ.",
    detail: "Tiết kiệm ngay 7.000đ so với giá lẻ 42k. Combo ăn vặt trà sữa được yêu thích nhất của giới trẻ Gò Vấp.",
    code: "COMBO35K",
    isAutoApplied: true,
    highlightText: "🔥 Combo 35k: Trà sữa M + Bánh tráng trộn (tiết kiệm 7k)"
  },
  {
    id: "combo_65k_banthan",
    name: "Combo Bạn Thân 65.000đ",
    badge: "Tiết Kiệm 9k",
    summary: "2 Ly Trà Sữa Truyền Thống size M (44k) + 1 Đĩa Cá Viên Chiên Giòn Rụm (20k) => Giá chỉ 65.000đ.",
    detail: "Tiết kiệm 9.000đ. Thích hợp cho 2 bạn cùng nhâm nhi trà sữa và ăn vặt nóng hổi giòn rụm.",
    code: "COMBO65K",
    isAutoApplied: true,
    highlightText: "👫 Combo Bạn Thân 65k: 2 Trà sữa M + Cá viên chiên"
  },
  {
    id: "combo_55k_anvat",
    name: "Combo Ăn Vặt No Nê 55.000đ",
    badge: "Ăn Vặt Trọn Vị",
    summary: "1 Bánh Tráng Trộn (15k) + 1 Cá Viên Chiên (20k) + 1 Khoai Tây Lắc Phô Mai (25k) => Giá chỉ 55.000đ.",
    detail: "Tiết kiệm 5.000đ. Đủ cả 3 món ăn vặt signature thơm lừng của quán.",
    code: "COMBO55K",
    isAutoApplied: true,
    highlightText: "🍟 Combo 3 Món Ăn Vặt 55k: Bánh tráng + Cá viên + Khoai lắc"
  },
  {
    id: "group_5_drinks",
    name: "Ưu Đãi Đặt Nhóm (Từ 5 Ly)",
    badge: "Giảm Trực Tiếp 15k",
    summary: "Giảm ngay 15.000đ trực tiếp vào tổng hóa đơn khi đặt từ 5 ly trà sữa / trà trái cây bất kỳ.",
    detail: "Áp dụng tự động khi tổng số ly trong giỏ hàng đạt từ 5 ly trở lên.",
    code: "NHOM5LY",
    isAutoApplied: true,
    highlightText: "🏷️ Mua từ 5 ly: Giảm ngay 15.000đ trực tiếp"
  },
  {
    id: "group_10_drinks",
    name: "Ưu Đãi Văn Phòng / Tiệc Nhỏ (Từ 10 Ly)",
    badge: "Tặng 1 Ly M",
    summary: "TẶNG NGAY 1 ly Trà Sữa Truyền Thống size M (trị giá 22.000đ) khi đặt từ 10 ly trở lên.",
    detail: "Kèm theo Freeship 100% tận văn phòng/công ty. Quán hỗ trợ đóng túi đá riêng và ghi chú tên từng người.",
    code: "NHOM10LY",
    isAutoApplied: true,
    highlightText: "🎉 Mua từ 10 ly: TẶNG 1 ly Trà sữa M (22k) + Freeship"
  },
  {
    id: "happy_hour_topping",
    name: "Flash Sale Khung Giờ Vàng (13:00 – 16:00)",
    badge: "Tặng Topping",
    summary: "Tặng kèm 01 phần Topping Trân Châu Đen Dẻo (trị giá 5k) cho mọi ly trà sữa size L.",
    detail: "Áp dụng trong khung giờ trưa từ 13:00 đến 16:00 hàng ngày.",
    code: "GIOVANG",
    isAutoApplied: true,
    highlightText: "⏰ Giờ Vàng (13h-16h): Tặng Trân Châu Đen cho mọi ly size L"
  },
  {
    id: "website_welcome_voucher",
    name: "Mã Giảm Giá Khách Hàng Mới",
    badge: "Giảm 5k",
    summary: "Nhập mã 'NICOLATBAI5K' giảm ngay 5.000đ cho đơn hàng đầu tiên đặt qua website.",
    detail: "Áp dụng cho mọi đơn hàng mới trải nghiệm đặt món trực tuyến tại Trà Sữa NicoLatBai.",
    code: "NICOLATBAI5K",
    isAutoApplied: false,
    highlightText: "🎁 Nhập mã 'NICOLATBAI5K' giảm ngay 5.000đ đơn đầu tiên"
  }
];

// Hàm lấy thời gian chuẩn xác theo giờ Việt Nam (UTC+7)
export function getVietnamRealTime(date: Date = new Date()): {
  hour: number;
  minute: number;
  day: number;
  month: number;
  year: number;
  dayName: string;
  timeStr: string;
  dateStr: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });

    const parts = formatter.formatToParts(date);
    const getVal = (type: string) => parts.find(p => p.type === type)?.value || "";

    const hour = parseInt(getVal("hour"), 10) || 0;
    const minute = parseInt(getVal("minute"), 10) || 0;
    const day = parseInt(getVal("day"), 10) || 1;
    const month = parseInt(getVal("month"), 10) || 1;
    const year = parseInt(getVal("year"), 10) || 2026;
    const dayName = getVal("weekday") || "Hôm nay";
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const dateStr = `${dayName}, ngày ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;

    return { hour, minute, day, month, year, dayName, timeStr, dateStr };
  } catch {
    // Fallback nếu Intl không có timezone database
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const vnDate = new Date(utc + (7 * 3600000));
    const hour = vnDate.getHours();
    const minute = vnDate.getMinutes();
    const day = vnDate.getDate();
    const month = vnDate.getMonth() + 1;
    const year = vnDate.getFullYear();
    const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayName = dayNames[vnDate.getDay()];
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    const dateStr = `${dayName}, ngày ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    return { hour, minute, day, month, year, dayName, timeStr, dateStr };
  }
}

// Hàm kiểm tra thời gian thực cửa hàng mở/đóng cửa
export function checkStoreRealTimeStatus(date: Date = new Date()): StoreRealTimeStatus {
  const { hour, minute, timeStr, dateStr } = getVietnamRealTime(date);
  const totalMinutes = hour * 60 + minute;
  const openMinutes = 8 * 60 + 30;   // 08:30 (510 phút)
  const closeMinutes = 22 * 60 + 30; // 22:30 (1350 phút)
  const lastOrderMinutes = 22 * 60 + 15; // 22:15 (1335 phút)

  const isOpen = totalMinutes >= openMinutes && totalMinutes < closeMinutes;
  const isNearClosing = isOpen && totalMinutes >= (closeMinutes - 30); // 22:00 - 22:30
  const isNearOpening = !isOpen && totalMinutes >= (openMinutes - 30) && totalMinutes < openMinutes; // 08:00 - 08:30

  let statusBadge: "OPEN" | "CLOSED" | "CLOSING_SOON" | "OPENING_SOON" = "OPEN";
  let statusTextVi = "";
  let orderNoticeVi = "";
  let directAnswerVi = "";

  if (isOpen) {
    if (isNearClosing) {
      statusBadge = "CLOSING_SOON";
      statusTextVi = "ĐANG MỞ CỬA (Sắp đóng cửa lúc 22:30, chốt nhận đơn trước 22:15)";
      orderNoticeVi = `Bây giờ là ${timeStr} tại Việt Nam. Quán sắp đến giờ đóng cửa (22:30). Hãy khuyến khích khách hàng chốt đơn ngay bây giờ để quán kịp pha chế và shipper kịp giao trước giờ nghỉ!`;
      directAnswerVi = `⏰ **THÔNG BÁO GIỜ HOẠT ĐỘNG THỜI GIAN THỰC:**\n\n• Hiện tại là **${timeStr} (${dateStr})**.\n• Quán Trà Sữa NicoLatBai **ĐANG MỞ CỬA**, nhưng **SẮP ĐẾN GIỜ NGHỈ NGƠI** (Giờ mở cửa: 08:30 – 22:30 hàng ngày, chốt đơn hỏa tốc trước 22:15).\n• Anh/chị hãy chốt món nhanh ngay bây giờ để quầy pha chế kịp làm và shipper phóng xe giao liền tận cửa cho mình nhé! 🛵💨`;
    } else {
      statusBadge = "OPEN";
      statusTextVi = "ĐANG MỞ CỬA PHỤC VỤ (08:30 – 22:30 hàng ngày, cả Lễ Tết)";
      orderNoticeVi = `Bây giờ là ${timeStr} tại Việt Nam. Quán đang mở cửa hoạt động bình thường, quầy pha chế sẵn sàng tiếp nhận đơn và freeship hỏa tốc trong 15-25 phút.`;
      directAnswerVi = `⏰ **THÔNG BÁO GIỜ HOẠT ĐỘNG THỜI GIAN THỰC:**\n\n• Hiện tại là **${timeStr} (${dateStr})**.\n• Quán Trà Sữa NicoLatBai **ĐANG MỞ CỬA HOẠT ĐỘNG BÌNH THƯỜNG**!\n• **Giờ phục vụ:** 08:30 sáng – 22:30 tối mỗi ngày (Cả tuần từ Thứ 2 đến Chủ Nhật, kể cả ngày Lễ, Tết).\n• **Chính sách giao hàng:** **FREESHIP 100% trong bán kính 3km** tại An Nhơn, Gò Vấp (giao hỏa tốc 15–25 phút).\n\nAnh/chị muốn thưởng thức món Trà sữa truyền thống (22k) hay Sữa tươi trân châu đường đen (25k) để em lên đơn ngay ạ? 😊`;
    }
  } else {
    if (isNearOpening) {
      statusBadge = "OPENING_SOON";
      statusTextVi = "CHUẨN BỊ MỞ CỬA (Mở lúc 08:30 sáng, chỉ còn ít phút nữa)";
      orderNoticeVi = `Bây giờ là ${timeStr} tại Việt Nam. Quán sắp mở cửa lúc 08:30 sáng. Hãy tiếp nhận đơn đặt trước hẹn giờ giao sớm nhất cho khách khi quán mở cửa.`;
      directAnswerVi = `⏰ **THÔNG BÁO GIỜ HOẠT ĐỘNG THỜI GIAN THỰC:**\n\n• Hiện tại là **${timeStr} (${dateStr})**.\n• Quán Trà Sữa NicoLatBai **SẮP MỞ CỬA PHỤC VỤ** lúc **08:30 sáng** (chỉ còn ít phút nữa)!\n• Anh/chị có thể lên đơn đặt trước ngay từ bây giờ, quầy pha chế sẽ ưu tiên làm mẻ trà thơm nóng đầu tiên và cho shipper giao sớm nhất khi quán mở cửa nhé ạ! 🥰`;
    } else {
      statusBadge = "CLOSED";
      statusTextVi = "ĐÃ ĐÓNG CỬA NGHỈ NGƠI (Giờ phục vụ: 08:30 – 22:30 hàng ngày)";
      orderNoticeVi = `Bây giờ là ${timeStr} (ngoài giờ phục vụ) tại Việt Nam. Quán đã đóng cửa nghỉ ngơi. Hãy thông báo rõ giờ mở cửa trở lại là 08:30 sáng mai, và mời khách để lại thông tin đặt trước để quán giao đợt đầu tiên.`;
      directAnswerVi = `⏰ **THÔNG BÁO GIỜ HOẠT ĐỘNG THỜI GIAN THỰC:**\n\n• Hiện tại là **${timeStr} (${dateStr})**.\n• Quán Trà Sữa NicoLatBai **HIỆN ĐÃ HẾT GIỜ PHỤC VỤ TRỰC TIẾP TRONG NGÀY** ạ! 🌙\n• **Giờ hoạt động chính thức:** 08:30 sáng – 22:30 tối hàng ngày (cả Lễ, Tết).\n• Anh/chị cứ yên tâm để lại món muốn đặt kèm địa chỉ và số điện thoại, sáng mai từ **08:30** quán mở cửa sẽ liên hệ xác nhận và ưu tiên giao chuyến đầu tiên trong ngày cho mình ngay nhé! Cảm ơn anh/chị rất nhiều ạ! ❤️`;
    }
  }

  return {
    isOpen,
    isNearClosing,
    isNearOpening,
    currentTimeFormatted: timeStr,
    currentDateFormatted: dateStr,
    currentHour: hour,
    currentMinute: minute,
    statusBadge,
    statusTextVi,
    orderNoticeVi,
    directAnswerVi
  };
}
