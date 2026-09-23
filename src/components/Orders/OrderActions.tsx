import React from "react";

function EyeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function BanIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

const OrderActions = ({ toggleEdit, toggleDetails, canCancel }: any) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDetails}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white font-semibold text-xs transition-all border border-slate-200/80 shadow-sm active:scale-95"
        title="Xem chi tiết đơn hàng"
      >
        <EyeIcon className="w-3.5 h-3.5" />
        <span>Chi tiết</span>
      </button>

      {canCancel && (
        <button
          onClick={toggleEdit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs transition-all border border-rose-200 shadow-sm active:scale-95"
          title="Hủy đơn hàng này"
        >
          <BanIcon className="w-3.5 h-3.5" />
          <span>Hủy đơn</span>
        </button>
      )}
    </div>
  );
};

export default OrderActions;
