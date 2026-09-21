export interface GhnStatusInfo {
  label: string;
  badgeClass: string;
}

export const ghnStatusMap: Record<string, GhnStatusInfo> = {
  ready_to_pick: { label: "Sẵn sàng lấy hàng (GHN)", badgeClass: "text-yellow bg-yellow-light-4" },
  picking: { label: "Đang lấy hàng (GHN)", badgeClass: "text-blue bg-blue-light-6" },
  money_collect_picking: { label: "Đang thu tiền người gửi (GHN)", badgeClass: "text-blue bg-blue-light-6" },
  picked: { label: "Đã lấy hàng (GHN)", badgeClass: "text-purple bg-purple-light-6" },
  storing: { label: "Hàng đang ở kho (GHN)", badgeClass: "text-purple bg-purple-light-6" },
  transporting: { label: "Đang luân chuyển (GHN)", badgeClass: "text-purple bg-purple-light-6" },
  sorting: { label: "Đang phân loại (GHN)", badgeClass: "text-purple bg-purple-light-6" },
  delivering: { label: "Đang giao hàng (GHN)", badgeClass: "text-blue bg-blue-light-6" },
  money_collect_delivering: { label: "Đang giao & Thu tiền COD (GHN)", badgeClass: "text-blue bg-blue-light-6" },
  delivered: { label: "Đã giao hàng thành công (GHN)", badgeClass: "text-green bg-green-light-6" },
  delivery_fail: { label: "Giao hàng thất bại (GHN)", badgeClass: "text-red bg-red-light-6" },
  waiting_to_return: { label: "Chờ trả hàng (GHN)", badgeClass: "text-yellow bg-yellow-light-4" },
  return: { label: "Trả hàng (GHN)", badgeClass: "text-yellow bg-yellow-light-4" },
  return_transporting: { label: "Đang luân chuyển trả hàng (GHN)", badgeClass: "text-yellow bg-yellow-light-4" },
  return_sorting: { label: "Đang phân loại trả hàng (GHN)", badgeClass: "text-yellow bg-yellow-light-4" },
  returning: { label: "Đang trả hàng (GHN)", badgeClass: "text-yellow bg-yellow-light-4" },
  return_fail: { label: "Trả hàng thất bại (GHN)", badgeClass: "text-red bg-red-light-6" },
  returned: { label: "Đã trả hàng (GHN)", badgeClass: "text-red bg-red-light-6" },
  exception: { label: "Hàng ngoại lệ / Sự cố (GHN)", badgeClass: "text-red bg-red-light-6" },
  damage: { label: "Hàng hư hỏng (GHN)", badgeClass: "text-red bg-red-light-6" },
  lost: { label: "Hàng thất lạc (GHN)", badgeClass: "text-red bg-red-light-6" },
  cancel: { label: "Đã hủy đơn hàng (GHN)", badgeClass: "text-red bg-red-light-6" },
};

const defaultStatuses = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Hoàn thành",
  "Đã hủy",
];

export function getOrderStatusText(orderStatus: number, ghnStatus?: string | null): string {
  if (ghnStatus && ghnStatusMap[ghnStatus.toLowerCase()]) {
    return ghnStatusMap[ghnStatus.toLowerCase()].label;
  }
  return defaultStatuses[orderStatus] || "Chưa xác định";
}

export function getOrderStatusBadgeClass(orderStatus: number, ghnStatus?: string | null): string {
  if (ghnStatus && ghnStatusMap[ghnStatus.toLowerCase()]) {
    return ghnStatusMap[ghnStatus.toLowerCase()].badgeClass;
  }
  const defaultClasses = [
    "text-yellow bg-yellow-light-4",
    "text-purple bg-purple-light-6",
    "text-blue bg-blue-light-6",
    "text-green bg-green-light-6",
    "text-red bg-red-light-6",
  ];
  return defaultClasses[orderStatus] || "text-dark bg-gray-2";
}
