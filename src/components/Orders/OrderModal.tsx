import React, { useEffect } from "react";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";

function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const OrderModal = ({ showDetails, showEdit, toggleModal, order, onRefresh }: any) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleModal(false);
    };
    if (showDetails || showEdit) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showDetails, showEdit, toggleModal]);

  if (!showDetails && !showEdit) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Modal Card Content */}
      <div className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => toggleModal(false)}
          className="absolute right-5 top-5 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
          title="Đóng (ESC)"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {/* Modal Body */}
        {showDetails && (
          <div className="w-full">
            <OrderDetails orderItem={order} toggleModal={toggleModal} onRefresh={onRefresh} />
          </div>
        )}
        {showEdit && (
          <div className="w-full">
            <EditOrder order={order} toggleModal={toggleModal} onRefresh={onRefresh} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
