
import { del, get, post } from "@/utils/request";

export const OrderService = {
    getOrder: (url: string) => get<any>(url, { requireAuth: true }),
    createOrder: (data: any) => post<any>("/api/Order", data, { requireAuth: true }),
    cancelOrder: (id: string) => del<any>(`/api/Order`,id, { requireAuth: true }),
};