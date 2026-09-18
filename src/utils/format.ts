export function getFirstImageFromString(image?: string | null): string | null {
  if (!image) return null; // xử lý undefined hoặc null

  try {
    const parsed = JSON.parse(image);

    if (Array.isArray(parsed) && typeof parsed[0] === "string") {
      return parsed[0];
    }

    return null;
  } catch (error) {
    console.error("Invalid JSON in image:", error);
    return null;
  }
}

export function formatCurrency(amount: number, locale: string = "vi-VN"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // không hiện số lẻ
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateTime(
  isoString: string,
  locale: string = "vi-VN",
  timeZone: string = "Asia/Ho_Chi_Minh"
): string {
  const date = new Date(isoString);

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}