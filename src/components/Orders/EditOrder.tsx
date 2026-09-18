import { OrderService } from "@/services/orderServices";
import React from "react";
import { Slide, toast } from "react-toastify";

const EditOrder = ({ order, toggleModal }: any) => {
  const handleCancelOrder = async () => {
    try {
      const res = await OrderService.cancelOrder(order.id)
      if (res.success) {
        toast.success("Hủy đơn hàng thành công!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      }
    } catch (error) {
      toast.error("Chỉ có thể hủy đơn hàng khi ở trạng thái chờ xác nhận!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    } finally {
      toggleModal(false);
    }
  };

  return (
    <div className="w-full px-10 py-8 text-center">
      <p className="text-lg font-semibold text-dark mb-6">
        Bạn có chắc muốn hủy đơn hàng này không?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCancelOrder}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all bg-red"
        >
          Xác nhận
        </button>

        <button
          onClick={() => toggleModal(false)}
          className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all"
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
};

export default EditOrder;
