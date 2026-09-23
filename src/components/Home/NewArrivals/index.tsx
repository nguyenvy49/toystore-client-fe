"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { ProductService } from "@/services/productServices";

const NewArrival = () => {
  const [listProduct, setlistProduct] = useState<any[]>([]);
  const [toTalProduct, settoTalProduct] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fecthData = async () => {
    try {
      setLoading(true);
      const getlistProduct = await ProductService.getProduct(
        "/api/Product/client?Sortby=createdOn&SortAsc=false"
      );
      setlistProduct(getlistProduct?.result?.items || []);
      settoTalProduct(getlistProduct?.result?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      setlistProduct([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <section className="overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
                Mẫu Mới Cập Nhật
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sản Phẩm Mới Nhất
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Khám phá đồ chơi giáo dục và giải trí vừa lên kệ tại ToysWorld
            </p>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="group inline-flex items-center gap-2 font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-full border border-slate-200 bg-white text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm active:scale-95"
          >
            <span>Xem tất cả ({toTalProduct})</span>
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7.5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-100 animate-pulse rounded-2xl h-[360px]" />
            ))}
          </div>
        ) : listProduct.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Chưa có sản phẩm mới nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
            {listProduct.map((item, key) => (
              <ProductItem item={item} key={key} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrival;
