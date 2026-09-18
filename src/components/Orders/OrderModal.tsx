import React from "react";
import OrderDetails from "./OrderDetails";
import EditOrder from "./EditOrder";

const OrderModal = ({ showDetails, showEdit, toggleModal, order }: any) => {
  if (!showDetails && !showEdit) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4 py-8 sm:px-8"
    >
      {/* Modal content */}
      <div
        className="
          relative w-full max-w-[700px] 
          max-h-[90vh] overflow-y-auto 
          bg-white rounded-[15px] shadow-lg 
          p-6
          transition-all transform scale-100
          flex flex-col
        "
      >
        {/* Nút đóng */}
        <button
          onClick={() => toggleModal(false)}
          className="text-body absolute right-2 top-2 z-[9999] flex h-11.5 w-11.5 items-center justify-center rounded-full border-2 border-stroke bg-white hover:text-dark"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.9983 10.586L17.9483 5.63603L19.3623 7.05003L14.4123 12L19.3623 16.95L17.9483 18.364L12.9983 13.414L8.04828 18.364L6.63428 16.95L11.5843 12L6.63428 7.05003L8.04828 5.63603L12.9983 10.586Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Nội dung */}
        {showDetails && (
          <div className="w-full">
            <OrderDetails orderItem={order} />
          </div>
        )}
        {showEdit && (
          <div className="w-full">
            <EditOrder order={order} toggleModal={toggleModal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
