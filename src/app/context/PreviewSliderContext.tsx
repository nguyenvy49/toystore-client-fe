"use client";
import React, { createContext, useContext, useState } from "react";

interface PreviewSliderType {
  isModalPreviewOpen: boolean;
  previewImages: string[];
  initialIndex: number;
  openPreviewModal: (images?: string[], index?: number) => void;
  closePreviewModal: () => void;
}

const PreviewSlider = createContext<PreviewSliderType | undefined>(undefined);

export const usePreviewSlider = () => {
  const context = useContext(PreviewSlider);
  if (!context) {
    throw new Error("usePreviewSlider must be used within a PreviewSliderProvider");
  }
  return context;
};

export const PreviewSliderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalPreviewOpen, setIsModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [initialIndex, setInitialIndex] = useState<number>(0);

  const openPreviewModal = (images?: string[], index?: number) => {
    if (images && images.length > 0) {
      setPreviewImages(images);
    }
    setInitialIndex(index || 0);
    setIsModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PreviewSlider.Provider
      value={{
        isModalPreviewOpen,
        previewImages,
        initialIndex,
        openPreviewModal,
        closePreviewModal,
      }}
    >
      {children}
    </PreviewSlider.Provider>
  );
};
