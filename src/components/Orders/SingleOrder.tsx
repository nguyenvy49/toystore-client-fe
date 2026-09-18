import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import { formatCurrency, formatDateTime } from "@/utils/format";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const status = [ "Chờ xác nhận","Đã xác nhận","Đang giao","Hoàn thành","Đã hủy"]
  console.log(orderItem);
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

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm  py-0.5 rounded-[30px] capitalize 
                ${orderItem.orderStatus == 0
                  ? "text-yellow bg-yellow-light-4"
                  : orderItem.orderStatus == 1
                    ? "text-purple bg-purple-light-6"
                    : orderItem.orderStatus == 2
                      ? "text-blue bg-blue-light-6"
                      : orderItem.orderStatus == 3
                        ? "text-green bg-green-light-6"
                        : orderItem.orderStatus == 4
                          ? "text-red bg-red-light-6"
                          : "Unknown Status"
                }`}
            >
              {status[orderItem.orderStatus]}
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
                  className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${orderItem.orderStatus === 0
                      ? "text-yellow bg-yellow-light-4"
                      : orderItem.orderStatus === 1
                        ? "text-purple bg-purple-light-6"
                        : orderItem.orderStatus === 2
                          ? "text-blue bg-blue-light-6"
                          : orderItem.orderStatus === 3
                            ? "text-green bg-green-light-6"
                            : orderItem.orderStatus === 4
                              ? "text-red bg-red-light-6"
                              : "Unknown Status"
                    }`}
                >
                  {orderItem.orderStatus}
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
