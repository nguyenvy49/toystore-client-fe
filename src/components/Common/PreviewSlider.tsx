"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";

function CloseIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen, previewImages, initialIndex } = usePreviewSlider();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isModalPreviewOpen) {
      setCurrentIndex(initialIndex || 0);
    }
  }, [isModalPreviewOpen, initialIndex]);

  // Keyboard navigation & ESC close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalPreviewOpen) return;
      if (e.key === "Escape") closePreviewModal();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalPreviewOpen, currentIndex, previewImages]);

  if (!isModalPreviewOpen) return null;

  const imagesList = previewImages && previewImages.length > 0
    ? previewImages
    : ["/images/noImage/error.png"];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const currentImgSrc = imagesList[currentIndex] || "/images/noImage/error.png";

  return (
    <div className="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      {/* Top Bar: Counter & Close Button */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10">
        <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
          Hình ảnh {currentIndex + 1} / {imagesList.length}
        </div>

        <button
          onClick={closePreviewModal}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all border border-white/20 active:scale-95"
          title="Đóng xem ảnh (ESC)"
        >
          <CloseIcon className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Image View & Navigation Controls */}
      <div className="relative flex-1 flex items-center justify-center my-4 w-full max-w-6xl mx-auto">
        {/* Previous Button */}
        {imagesList.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 shadow-xl active:scale-95"
            title="Ảnh trước (Mũi tên Trái)"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Display Image */}
        <div className="relative max-h-[72vh] max-w-[85vw] flex items-center justify-center overflow-hidden rounded-2xl">
          <img
            src={currentImgSrc}
            alt={`product-preview-${currentIndex}`}
            className="max-h-[72vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl transition-all duration-300 transform scale-100"
          />
        </div>

        {/* Next Button */}
        {imagesList.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 shadow-xl active:scale-95"
            title="Ảnh kế tiếp (Mũi tên Phải)"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Navigation Bar */}
      {imagesList.length > 1 && (
        <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 px-4 no-scrollbar z-10">
          {imagesList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-slate-900 ${
                idx === currentIndex
                  ? "border-indigo-400 scale-110 shadow-lg"
                  : "border-white/20 opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl}
                alt={`thumb-${idx}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewSliderModal;
