"use client";
import { useState, useEffect } from "react";
import { Inter } from 'next/font/google';
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import { AppProvider } from "../context/AppContext";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'], // Thêm "vietnamese" để hỗ trợ tiếng Việt
  weight: ['300', '400', '500', '600', '700'], // Các trọng lượng tương ứng với mã ban đầu
  style: ['normal', 'italic'], // Hỗ trợ cả normal và italic
  display: 'swap', // Tối ưu hóa tải font
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <ToastContainer />
            <AppProvider>
              <ReduxProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Header />
                    {children}

                    <QuickViewModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </ReduxProvider>
            </AppProvider>
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
