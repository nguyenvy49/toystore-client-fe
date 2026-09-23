import { OrderService } from "@/services/orderServices";
import React, { useState } from "react";
import { Slide, toast } from "react-toastify";

const EditOrder = ({ order, toggleModal, onRefresh }: any) => {
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const res: any = await OrderService.cancelOrder(order.id);
      if (res?.isSuccess || res?.success || res) {
        toast.success(res?.message || "Hủy đơn hàng thành công!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Slide,
        });
        if (onRefresh) onRefresh();
      } else {
        toast.error(res?.message || "Không thể hủy đơn hàng!", {
          position: "top-center",
          autoClose: 3000,
          theme: "light",
          transition: Slide,
        });
      }
    } catch (error: any) {
      toast.error(error?.message || "Hủy đơn hàng thất bại!", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Slide,
      });
    } finally {
      setLoading(false);
      toggleModal(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-sm">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </div>

      <h3 className="text-lg font-extrabold text-slate-900 mb-2">
        Xác nhận hủy đơn hàng?
      </h3>
      <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
        Đơn hàng chưa được bên vận chuyển tiếp nhận giao. Bạn có chắc chắn muốn hủy đơn hàng này không?
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => toggleModal(false)}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Bỏ qua
        </button>

        <button
          onClick={handleCancelOrder}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Xác nhận hủy
        </button>
      </div>
    </div>
  );
};

export default EditOrder;

