/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import OrderSummary from "./OrderSummary";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";
import { CartService } from "@/services/CartServices";
import CustomerInfo from "./CustomerInfo ";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Gọi API lấy giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await CartService.getCart("/api/Cart/by-user");
        console.log("Dữ liệu giỏ hàng từ API:", response);
        const products = response?.result?.products || [];
        setCartItems(products);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Callback cập nhật số lượng
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Callback xóa sản phẩm
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  if (loading) {
    return <p className="text-center mt-10">Đang tải giỏ hàng...</p>;
  }

  return (
    <>
      <section>
        <Breadcrumb title={"Cart"} pages={["Cart"]} />
      </section>

      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">Giỏ hàng của bạn</h2>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  <div className="flex items-center py-5.5 px-7.5">
                    <div className="min-w-[400px]">
                      <p className="text-dark">Sản phẩm</p>
                    </div>
                    <div className="min-w-[180px]">
                      <p className="text-dark">Giá</p>
                    </div>
                    <div className="min-w-[275px]">
                      <p className="text-dark">Số lượng</p>
                    </div>
                    <div className="min-w-[200px]">
                      <p className="text-dark">Tổng tiền</p>
                    </div>
                    <div className="min-w-[50px]">
                      <p className="text-dark text-right">Hành động</p>
                    </div>
                  </div>

                  {/* Render từng sản phẩm */}
                  {cartItems.map((item) => (
                    <SingleItem
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Thông tin khách hàng & Tóm tắt đơn hàng */}
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <CustomerInfo ghnData={ghnData} setGhnData={setGhnData} />
              <OrderSummary cartItems={cartItems} shippingFee={ghnData.shippingFee} />
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center mt-8">
          <p className="pb-6">Giỏ hàng của bạn đang trống!</p>
          <Link
            href="/shop-with-sidebar"
            className="w-96 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md hover:bg-opacity-95"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      )}
    </>
  );
};

export default Cart;
