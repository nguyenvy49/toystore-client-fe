/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProductService } from "@/services/productServices";
import ProductItem from "@/components/Common/ProductItem";

const BestSeller = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [listProduct, setlistProduct] = useState<any[]>([]);
  const [toTalProduct, settoTalProduct] = useState<any>(0);

  const fecthData = async () => {
    try {
      const getlistProduct = await ProductService.getProduct(
        `/api/Statistic/product/${year}/${month}?topN=9`
      );
      if (Array.isArray(getlistProduct)) {
        setlistProduct(getlistProduct);
      } else if (getlistProduct && Array.isArray(getlistProduct.result)) {
        setlistProduct(getlistProduct.result);
      } else if (getlistProduct && Array.isArray(getlistProduct.result?.items)) {
        setlistProduct(getlistProduct.result.items);
      } else {
        setlistProduct([]);
      }
    } catch (error) {
      console.error("Error fetching best seller products:", error);
      setlistProduct([]);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678"
                  stroke="#3C50E0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Sản phẩm bán chạy nhất
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {Array.isArray(listProduct) && listProduct.length > 0 ? (
            listProduct.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-5 py-4">
              Chưa có sản phẩm bán chạy trong tháng này.
            </p>
          )}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
