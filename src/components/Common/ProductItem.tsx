"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import { addCart } from "@/utils/cart";
import { useRouter } from "next/navigation";

function ShoppingBagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function EyeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const SingleGridItem = ({ item }: { item: any }) => {
  const router = useRouter();
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.quantity > 0) {
      await addCart(item.id, 1);
    }
  };

  const discountPercentage = item?.promotion?.discountPercent ? item.promotion.discountPercent : 0;
  const priceProduct = discountPercentage > 0 ? item.price * (1 - discountPercentage / 100) : item.price;
  const categoryName = item.category?.categoryName || item.category?.name || item.category?.parentName;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between group h-full relative overflow-hidden">
      {/* Upper Section: Image & Hover Action Overlay */}
      <div>
        <div className="relative overflow-hidden rounded-xl bg-slate-50 w-full h-[220px] flex items-center justify-center mb-3 group-hover:bg-slate-100/80 transition-colors">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-10 tracking-wide">
              -{discountPercentage}%
            </div>
          )}

          {/* Product Image */}
          <Link href={`/shop-details/${item.slug}`} className="w-full h-full flex items-center justify-center p-3">
            <Image
              src={item.image?.[0] || "/images/noImage/error.png"}
              alt={item.productName || "ToysWorld Product"}
              width={220}
              height={220}
              className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Floating Action Overlay on Hover */}
          <div className="absolute inset-x-2.5 bottom-2.5 py-2 px-3 rounded-xl bg-slate-900/85 backdrop-blur-md flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-20 shadow-lg">
            <button
              onClick={() => router.push(`/shop-details/${item.slug}`)}
              aria-label="Xem chi tiết"
              title="Xem chi tiết sản phẩm"
              style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors shadow-sm group/eye"
            >
              <EyeIcon className="w-4 h-4 text-slate-900 transition-colors" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={item.quantity <= 0}
              className={`flex-1 h-8 rounded-lg font-semibold text-xs text-white flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                item.quantity > 0
                  ? "bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ShoppingBagIcon className="w-3.5 h-3.5" />
              <span>{item.quantity > 0 ? "Thêm giỏ" : "Hết hàng"}</span>
            </button>
          </div>
        </div>

        {/* Category Label */}
        {categoryName && (
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider line-clamp-1 mb-1">
            {categoryName}
          </p>
        )}

        {/* Product Title */}
        <h3 className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-3">
          <Link href={`/shop-details/${item.slug}`}>{item.productName}</Link>
        </h3>
      </div>

      {/* Bottom Section: Stock & Price Row */}
      <div className="pt-2 border-t border-slate-100 flex items-end justify-between gap-2 mt-auto">
        {/* Price */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-extrabold text-rose-600 tracking-tight">
              {formatCurrency(priceProduct)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-[11px] font-medium text-slate-400 line-through">
                {formatCurrency(item.price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Badge */}
        <div>
          {item.quantity <= 0 ? (
            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200/60">
              Hết hàng
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Còn {item.quantity} sp
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleGridItem;