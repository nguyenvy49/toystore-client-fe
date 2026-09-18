import React from "react";

const OrderDetails = ({ orderItem }: any) => {
  if (!orderItem) return null;

  return (
    <div className="space-y-4 text-dark text-sm">
      <h3 className="font-semibold text-lg text-dark border-b pb-2">
        Chi tiết đơn hàng
      </h3>

      {/* General info */}
      <div className="bg-gray-1 p-4 rounded-lg space-y-2">
        <p><span className="font-medium">Người đặt:</span> {orderItem.user?.fullName || "Khách hàng"}</p>
        <p><span className="font-medium">Số điện thoại:</span> {orderItem.phone}</p>
        <p><span className="font-medium">Địa chỉ giao hàng:</span> {orderItem.address}</p>
        {orderItem.ghnOrderCode && (
          <p><span className="font-medium text-blue">Mã vận đơn GHN:</span> {orderItem.ghnOrderCode}</p>
        )}
      </div>

      {/* Product list */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-3">
          <thead>
            <tr className="bg-gray-2 text-xs font-semibold uppercase text-dark">
              <th className="p-3 border-b border-gray-3">Sản phẩm</th>
              <th className="p-3 border-b border-gray-3 text-center">Đơn giá</th>
              <th className="p-3 border-b border-gray-3 text-center">Số lượng</th>
              <th className="p-3 border-b border-gray-3 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {orderItem.orderDetails?.map((item: any, key: number) => {
              const hasDiscount =
                item.product?.discountedPrice &&
                item.product?.discountedPrice < item.product?.price;
              const itemTotal = item.totalPrice || (item.price * item.quantity);

              return (
                <tr key={key} className="border-b border-gray-3">
                  <td className="p-3 font-medium">{item.product?.name || item.product?.productName}</td>
                  <td className="p-3 text-center">
                    {hasDiscount ? (
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 line-through text-xs">
                          {item.product.price.toLocaleString("vi-VN")} đ
                        </span>
                        <span className="text-red font-semibold">
                          {item.product.discountedPrice.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    ) : (
                      <span>{(item.price || 0).toLocaleString("vi-VN")} đ</span>
                    )}
                  </td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right font-medium">
                    {itemTotal.toLocaleString("vi-VN")} đ
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="pt-2 border-t border-gray-3 space-y-1.5 text-right">
        {orderItem.shippingFee !== undefined && orderItem.shippingFee !== null && (
          <p className="text-sm text-gray-6">
            Phí vận chuyển GHN:{" "}
            <span className="font-semibold text-blue">
              {orderItem.shippingFee.toLocaleString("vi-VN")} đ
            </span>
          </p>
        )}
        <p className="text-base font-bold text-dark">
          Tổng thanh toán:{" "}
          <span className="text-blue text-lg">
            {(orderItem.totalPrice || 0).toLocaleString("vi-VN")} đ
          </span>
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
