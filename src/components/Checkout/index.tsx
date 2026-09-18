"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import { useAppSelector } from "@/redux/store";
import { selectCartItems, selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { OrderService } from "@/services/orderServices";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectTotalPrice);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Billing form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // GHN Location state
  const [ghnData, setGhnData] = useState<{
    provinceId: number | null;
    districtId: number | null;
    wardCode: string | null;
    shippingFee: number;
    locationAddress: string;
  }>({
    provinceId: null,
    districtId: null,
    wardCode: null,
    shippingFee: 0,
    locationAddress: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (data: {
    provinceId: number | null;
    districtId: number | null;
    wardCode: string | null;
    shippingFee: number;
    locationAddress: string;
  }) => {
    setGhnData(data);
  };

  const grandTotal = subtotal + (ghnData.shippingFee || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cartItems || cartItems.length === 0) {
      setErrorMsg("Giỏ hàng của bạn đang trống!");
      return;
    }

    if (!ghnData.provinceId || !ghnData.districtId || !ghnData.wardCode) {
      setErrorMsg("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện và Phường/Xã vận chuyển!");
      return;
    }

    if (!formData.phone || !formData.address) {
      setErrorMsg("Vui lòng nhập số điện thoại và địa chỉ nhận hàng!");
      return;
    }

    const fullAddress = `${formData.address}, ${ghnData.locationAddress}`;

    const orderPayload = {
      phone: formData.phone,
      address: fullAddress,
      provinceId: ghnData.provinceId,
      districtId: ghnData.districtId,
      wardCode: ghnData.wardCode,
      shippingFee: ghnData.shippingFee,
      recipientName: formData.fullName,
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    setLoading(true);
    try {
      const res = await OrderService.createOrder(orderPayload);
      if (res?.isSuccess !== false) {
        dispatch(removeAllItemsFromCart());
        alert("Đặt hàng thành công!");
        router.push("/my-account");
      } else {
        setErrorMsg(res?.message || "Đặt hàng thất bại, vui lòng thử lại!");
      }
    } catch (err: any) {
      console.error("Order error:", err);
      setErrorMsg(err?.response?.data?.message || err?.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Thanh toán"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Billing
                  formData={formData}
                  onChange={handleInputChange}
                  onLocationChange={handleLocationChange}
                />
              </div>

              {/* <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3 font-medium text-dark">
                      <div>Sản phẩm</div>
                      <div className="text-right">Tạm tính</div>
                    </div>

                    {/* <!-- product items --> */}
                    {cartItems.length === 0 ? (
                      <p className="py-5 text-gray-5 text-center">Chưa có sản phẩm nào trong giỏ hàng</p>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-3 text-sm">
                          <div className="pr-4">
                            <p className="text-dark font-medium">{item.title}</p>
                            <p className="text-gray-5 text-xs">x {item.quantity}</p>
                          </div>
                          <div className="text-dark font-medium text-right whitespace-nowrap">
                            {(item.discountedPrice * item.quantity).toLocaleString("vi-VN")} đ
                          </div>
                        </div>
                      ))
                    )}

                    {/* <!-- Subtotal --> */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-3 text-sm">
                      <p className="text-dark">Tiền hàng:</p>
                      <p className="text-dark font-medium text-right">
                        {subtotal.toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    {/* <!-- GHN Shipping Fee --> */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-3 text-sm">
                      <p className="text-dark">Phí vận chuyển GHN:</p>
                      <p className="text-blue font-medium text-right">
                        {ghnData.shippingFee > 0
                          ? `${ghnData.shippingFee.toLocaleString("vi-VN")} đ`
                          : "Vui lòng chọn địa chỉ"}
                      </p>
                    </div>

                    {/* <!-- Grand Total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <p className="font-semibold text-lg text-dark">Tổng thanh toán:</p>
                      <p className="font-bold text-xl text-blue text-right">
                        {grandTotal.toLocaleString("vi-VN")} đ
                      </p>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- payment box --> */}
                <PaymentMethod />

                {/* Error message */}
                {errorMsg && (
                  <div className="mt-4 p-3 bg-red/10 border border-red/30 rounded text-red text-sm">
                    {errorMsg}
                  </div>
                )}

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className={`w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Đang xử lý..." : "Đặt hàng"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
