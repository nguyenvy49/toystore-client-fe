import { formatCurrency } from "@/utils/format";
import React from "react";

interface CartItem {
  product: {
    id: string;
    name: string;
    discountedPrice: number;
  };
  quantity: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems }) => {
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.discountedPrice * item.quantity,
    0
  );

  const shippingFee = 30000;
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="lg:max-w-[455px] w-full">
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5 flex justify-between items-center">
          <h3 className="font-medium text-xl text-dark">Tóm tắt đơn hàng</h3>
          <span className="text-sm text-gray-500">
            (Đã bao gồm phí vận chuyển)
          </span>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* Tiêu đề cột */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <h4 className="font-medium text-dark">Sản phẩm</h4>
            <h4 className="font-medium text-dark text-right">Tổng tiền</h4>
          </div>

          {/* Danh sách sản phẩm */}
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 border-b border-gray-3"
            >
              <p className="text-dark">{item.product.name}</p>
              <p className="text-dark text-right">
                {formatCurrency(item.product.discountedPrice * item.quantity)}
              </p>
            </div>
          ))}

          {/* Thành tiền */}
          <div className="flex items-center justify-between pt-5">
            <p className="font-medium text-dark">Thành tiền</p>
            <p className="font-medium text-dark text-right">
              {formatCurrency(totalPrice)}
            </p>
          </div>

          {/* Phí vận chuyển */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-dark">Phí vận chuyển</p>
            <p className="text-dark text-right">
              {formatCurrency(shippingFee)}
            </p>
          </div>

          {/* Tổng cộng */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-3 mt-4">
            <p className="font-semibold text-lg text-dark">Tổng cộng</p>
            <p className="font-semibold text-lg text-dark text-right">
              {formatCurrency(finalTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
