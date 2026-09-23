"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect, useState } from "react";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";
import { categoryService } from "@/services/category";

function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const Categories = () => {
  const sliderRef = useRef<any>(null);
  const [listCategory, setListCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  const fecthData = async () => {
    try {
      setLoading(true);
      const getListCategory = await categoryService.getListCategory('/api/Category/Client');
      setListCategory(getListCategory?.result?.items || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setListCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <section className="overflow-hidden py-8 bg-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="pb-8 border-b border-slate-100">
          {/* Simple Header */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Danh Mục Sản Phẩm
            </h2>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                title="Danh mục trước"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                title="Danh mục kế tiếp"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Swiper Slider */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden py-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 animate-pulse flex-shrink-0" />
              ))}
            </div>
          ) : (
            <Swiper
              ref={sliderRef}
              slidesPerView={6}
              spaceBetween={16}
              breakpoints={{
                0: {
                  slidesPerView: 3,
                  spaceBetween: 12,
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 16,
                },
                1000: {
                  slidesPerView: 5,
                  spaceBetween: 16,
                },
                1200: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
              }}
            >
              {Array.isArray(listCategory) &&
                listCategory.map((item, key) => (
                  <SwiperSlide key={key}>
                    <SingleItem item={item} />
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
