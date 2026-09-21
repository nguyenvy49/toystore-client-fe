import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { getOrderStatusText, getOrderStatusBadgeClass } from "@/utils/ghnStatusHelper";

const SingleOrder = ({ orderItem, smallView }: any) => {
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

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">{formatDateTime(orderItem.orderDate)}</p>
          </div>

          <div className="min-w-[180px]">
            <p
              className={`inline-block text-custom-sm py-0.5 px-3 rounded-[30px] capitalize font-medium ${getOrderStatusBadgeClass(
                orderItem.orderStatus,
                orderItem.ghnStatus
              )}`}
            >
              {getOrderStatusText(orderItem.orderStatus, orderItem.ghnStatus)}
            </p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">{formatCurrency(orderItem.totalPrice)}</p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5">
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Date:</span>{" "}
                {orderItem.orderDate}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Status:</span>{" "}
                <span
                  className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize ${getOrderStatusBadgeClass(
                    orderItem.orderStatus,
                    orderItem.ghnStatus
                  )}`}
                >
                  {getOrderStatusText(orderItem.orderStatus, orderItem.ghnStatus)}
                </span>
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Total:</span>
                {formatCurrency(orderItem.totalPrice)}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Hoạt động:</span>{" "}
                <OrderActions
                  toggleDetails={toggleDetails}
                  toggleCancel={toggleEdit}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
