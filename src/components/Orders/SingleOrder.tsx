"use client";
import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { getOrderStatusText, getOrderStatusBadgeClass } from "@/utils/ghnStatusHelper";

function CalendarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
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

const SingleOrder = ({ orderItem, onRefresh }: { orderItem: any; onRefresh?: () => void }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  const statusText = getOrderStatusText(orderItem.orderStatus, orderItem.ghnStatus);
  const badgeClass = getOrderStatusBadgeClass(orderItem.orderStatus, orderItem.ghnStatus);

  const ghnStatusLower = (orderItem.ghnStatus || "").toLowerCase().trim();
  const isShipped = ["picked", "storing", "transporting", "sorting", "delivering", "delivered"].includes(ghnStatusLower);
  const canCancel = orderItem.orderStatus === 0 || (orderItem.orderStatus === 1 && !isShipped);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3.5">
        {/* Order Info & Date */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">
              {formatDateTime(orderItem.orderDate)}
            </span>
          </div>

          {orderItem.ghnOrderCode && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <TruckIcon className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-bold text-blue-600">
                GHN: {orderItem.ghnOrderCode}
              </span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div>
          <span className={`inline-block font-semibold text-xs px-3 py-1 rounded-full ${badgeClass}`}>
            {statusText}
          </span>
        </div>

        {/* Total Price & Action Button */}
        <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="flex flex-col md:items-end">
            <span className="text-[11px] font-semibold text-slate-400">Tổng thanh toán:</span>
            <span className="text-base font-extrabold text-slate-900">
              {formatCurrency(orderItem.totalPrice)}
            </span>
          </div>

          <OrderActions
            toggleDetails={toggleDetails}
            toggleEdit={toggleEdit}
            canCancel={canCancel}
          />
        </div>
      </div>

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default SingleOrder;
