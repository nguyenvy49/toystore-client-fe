import Image from "next/image";
import React from "react";

const OrderDetails = ({ orderItem }: any) => {
  return (
    <>
      <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex">
        <div className="min-w-[213px]">
          <p className="text-custom-sm text-dark">Tên sản phẩm</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">giá tiền</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Số lượng</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Tổng tiền</p>
        </div>
      </div>

      {orderItem.orderDetails.map((item, key) => {
        const hasDiscount =
          item.product.discountedPrice &&
          item.product.discountedPrice < item.product.price;
        return (
          <>
            <div key={key} className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
              <div className="min-w-[213px]">
                <p className="text-custom-sm text-dark">
                  {item.product.name}
                </p>
              </div>

              <div className="min-w-[113px]">
                <p
                  className="text-custom-sm text-dark"
                >
                  {hasDiscount ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-gray-400 line-through text-xs">
                        {item.product.price.toLocaleString("vi-VN") || 0} ₫
                      </span>
                      <span className="text-red-600 font-semibold">
                        {item.product.discountedPrice.toLocaleString("vi-VN") ||
                          0} ₫
                      </span>
                    </div>
                  ) : (
                    <span>{item.price.toLocaleString("vi-VN") || 0} ₫</span>
                  )}
                </p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">{item.quantity}</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark">
                  {orderItem.totalPrice.toLocaleString("vi-VN") || 0} đ
                </p>
              </div>
            </div>
          </>
        )
      })}

      <div className="px-7.5 w-full">
        <p className="font-bold">Người đặt:</p>{" "}
        <p>{orderItem.user.fullName}</p>
      </div>
    </>
  );
};

export default OrderDetails;
