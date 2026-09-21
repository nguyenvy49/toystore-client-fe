"use client"
import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";
import { OrderService } from "@/services/orderServices";
import { HubConnectionBuilder } from "@microsoft/signalr";
import envConfig from "@/config/envConfig";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const fecthData = async () => {
    try {
      const res = await OrderService.getOrder('/api/Order/my-orders')
      console.log(res);
      setOrders(res.result.orders);
    } catch (error) {
      console.log(error);
    }
  }

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
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* <!-- order item --> */}
          {orders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex">
              <div className="min-w-[175px]">
                <p className="text-custom-sm text-dark">Ngày đặt</p>
              </div>

              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark">Tình trạng</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Tổng tiền</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">Hàng động</p>
              </div>
            </div>
          )}
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className="py-9.5 sm:px-7.5 xl:px-10">
              Bạn không có đơn hàng nào!
            </p>
          )}
        </div>

        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;
