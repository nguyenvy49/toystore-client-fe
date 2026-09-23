import React from "react";
import Image from "next/image";
import Link from "next/link";

const SingleItem = ({ item }: { item: any }) => {
  return (
    <Link
      href={`/shop-with-sidebar?category=${item.id}`}
      className="group flex flex-col items-center py-1 cursor-pointer"
    >
      {/* Simple Image Box */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100/80 p-3.5 flex items-center justify-center mb-2.5 transition-all duration-200 group-hover:scale-105 group-hover:bg-blue-50">
        <Image
          src={item.image || "/images/noImage/error.png"}
          alt={item.categoryName || "Category"}
          width={72}
          height={72}
          className="object-contain max-h-full max-w-full"
        />
      </div>

      {/* Simple Category Name Label */}
      <h3 className="font-semibold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors text-center line-clamp-1 px-1">
        {item.categoryName}
      </h3>
    </Link>
  );
};

export default SingleItem;
