import React from "react";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { getOrderStatusText, getOrderStatusBadgeClass } from "@/utils/ghnStatusHelper";

function UserIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TruckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

const OrderDetails = ({ orderItem, toggleModal, onRefresh }: any) => {
  if (!orderItem) return null;

  const statusText = getOrderStatusText(orderItem.orderStatus, orderItem.ghnStatus);
  const badgeClass = getOrderStatusBadgeClass(orderItem.orderStatus, orderItem.ghnStatus);

  const ghnStatusLower = (orderItem.ghnStatus || "").toLowerCase().trim();
  const isShipped = ["picked", "storing", "transporting", "sorting", "delivering", "delivered"].includes(ghnStatusLower);
  const canCancel = orderItem.orderStatus === 0 || (orderItem.orderStatus === 1 && !isShipped);

  return (
    <div className="space-y-6 text-slate-800 text-xs sm:text-sm pr-2">
      {/* Modal Title & Status */}
      <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
            Chi Tiết Đơn Hàng
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Thời gian đặt: {formatDateTime(orderItem.orderDate)}
          </p>
        </div>

        <span className={`inline-block font-semibold text-xs px-3 py-1 rounded-full ${badgeClass}`}>
          {statusText}
        </span>
      </div>

      {/* Recipient & Shipping Information Card */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
          Thông Tin Giao Hàng
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span><strong className="text-slate-900">Người nhận:</strong> {orderItem.user?.fullName || "Khách hàng"}</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span><strong className="text-slate-900">Số điện thoại:</strong> {orderItem.phone}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60 text-slate-700">
          <MapPinIcon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span><strong className="text-slate-900">Địa chỉ:</strong> {orderItem.address}</span>
        </div>

        {orderItem.ghnOrderCode && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
            <TruckIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong className="text-slate-900">Mã vận đơn GHN:</strong>{" "}
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {orderItem.ghnOrderCode}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Product Items Table */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
          Danh Sách Sản Phẩm ({orderItem.orderDetails?.length || 0})
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="p-3.5">Sản phẩm</th>
                <th className="p-3.5 text-center">Đơn giá</th>
                <th className="p-3.5 text-center">Số lượng</th>
                <th className="p-3.5 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orderItem.orderDetails?.map((item: any, key: number) => {
                const productName = item.product?.productName || item.product?.name || "Sản phẩm";
                const unitPrice = item.price || item.product?.price || 0;
                const itemTotal = item.totalPrice || (unitPrice * item.quantity);

                return (
                  <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      {productName}
                    </td>
                    <td className="p-3.5 text-center text-slate-700">
                      {formatCurrency(unitPrice)}
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-900">
                      {item.quantity}
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-slate-900">
                      {formatCurrency(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Summary Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {canCancel ? (
          <button
            onClick={() => {
              if (toggleModal) toggleModal(true); // Switches to cancel modal if triggered
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            Hủy đơn hàng này
          </button>
        ) : (
          <div />
        )}

        <div className="text-right space-y-1">
          {orderItem.shippingFee !== undefined && orderItem.shippingFee !== null && (
            <p className="text-xs text-slate-500 font-medium">
              Phí vận chuyển GHN:{" "}
              <span className="font-bold text-blue-600">
                {formatCurrency(orderItem.shippingFee)}
              </span>
            </p>
          )}
          <p className="text-sm font-semibold text-slate-700">
            Tổng thanh toán:{" "}
            <span className="text-xl font-black text-rose-600 ml-1">
              {formatCurrency(orderItem.totalPrice || 0)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
