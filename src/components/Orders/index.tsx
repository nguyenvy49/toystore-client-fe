"use client";
import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import { OrderService } from "@/services/orderServices";
import { HubConnectionBuilder } from "@microsoft/signalr";
import envConfig from "@/config/envConfig";

function ShoppingBagIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fecthData = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getOrder('/api/Order/my-orders');
      setOrders(res?.result?.orders || []);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthData();

    const baseUrl = envConfig.NEXT_PUBLIC_API_URL || "https://cua-hang-do-choi-be.onrender.com";
    const hubUrl = `${baseUrl.replace(/\/$/, "")}/hubs/order`;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("⚡ SignalR connected to OrderHub in Client FE"))
      .catch((err) => console.warn("SignalR connection error:", err));

    connection.on("ReceiveOrderStatusUpdate", (data) => {
      console.log("🔔 Realtime OrderStatusUpdate received via SignalR in Client FE:", data);
      fecthData();
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Đơn Hàng Của Tôi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý và theo dõi tiến độ giao hàng real-time từ GHN
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          Tổng: {orders.length} đơn hàng
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-slate-50/60 rounded-3xl border border-slate-200/80 p-8 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <ShoppingBagIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-base text-slate-800 mb-1">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm">
            Khám phá ngay hàng trăm món đồ chơi hấp dẫn tại ToysWorld!
          </p>
          <a
            href="/shop-with-sidebar"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-sm"
          >
            Mua sắm ngay ➔
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} onRefresh={fecthData} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
