"use client";
import React, { useState, useRef, useEffect } from "react";
import { formatCurrency } from "@/utils/format";
import envConfig from "@/config/envConfig";

// --- Clean Vector SVG Icon Components ---
function SparklesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

function RobotIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="15" x2="8" y2="15.01" strokeWidth="3" />
      <line x1="16" y1="15" x2="16" y2="15.01" strokeWidth="3" />
      <path d="M9 18h6" />
    </svg>
  );
}

function CloseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UserIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShoppingBagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function SendIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

interface ProductDto {
  id: string;
  name: string;
  price: number;
  slug: string;
  discountedPrice?: number;
  image?: string;
}

interface AiConsultResponse {
  adviceText: string;
  recommendedProducts: ProductDto[];
}

export default function AiChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "user" | "ai"; text: string; products?: ProductDto[] }>
  >([
    {
      sender: "ai",
      text: "Xin chào! Tôi là Trợ lý AI thông minh của ToysWorld. Tôi có thể giúp bạn tìm kiếm món đồ chơi phù hợp nhất theo độ tuổi, sở thích và ngân sách cho bé.",
    },
  ]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (customMsg?: string) => {
    const msgToSend = customMsg || userMessage;
    if (!msgToSend.trim()) return;

    const userText = msgToSend;
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    if (!customMsg) setUserMessage("");
    setLoading(true);

    try {
      const baseUrl = (
        envConfig.NEXT_PUBLIC_API_URL || "https://cua-hang-do-choi-be.onrender.com"
      ).replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/Ai/consult-toys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userText,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        const aiResult: AiConsultResponse = data.result;
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: aiResult.adviceText,
            products: aiResult.recommendedProducts,
          },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Rất tiếc, hiện tại tôi chưa tìm thấy gợi ý phù hợp với yêu cầu này. Bạn có thể thử lại với tiêu chí hoặc độ tuổi khác nhé!",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Hệ thống AI đang phản hồi chậm hoặc gián đoạn kết nối. Vui lòng thử lại sau giây lát!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-15 z-[9999] flex items-center gap-3 px-5 py-3.5 transition-all duration-300 transform hover:scale-105 active:scale-95 group"
        title="Trợ lý AI Tư vấn"
      >
        <div style={{ backgroundColor: "rgba(99, 102, 241, 0.2)" }} className="relative flex items-center justify-center w-8 h-8 rounded-full transition-colors">
          <SparklesIcon className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
        </div>
      </button>

      {/* Chat Modal Panel */}
      {isOpen && (
        <div
          style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1" }}
          className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[92vw] sm:w-[420px] h-[600px] rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
        >
          {/* Header */}
          <div
            style={{ backgroundColor: "#0f172a", color: "#ffffff", borderBottomColor: "#1e293b" }}
            className="px-5 py-4 flex items-center justify-between border-b shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: "rgba(79, 70, 229, 0.3)", borderColor: "rgba(99, 102, 241, 0.4)" }}
                className="w-10 h-10 rounded-2xl border flex items-center justify-center text-indigo-300 shadow-inner"
              >
                <RobotIcon className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 style={{ color: "#ffffff" }} className="font-bold text-sm tracking-wide">
                    ToysWorld AI Advisor
                  </h3>
                  <span
                    style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", borderColor: "rgba(16, 185, 129, 0.3)" }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Trực tuyến
                  </span>
                </div>
                <p style={{ color: "#94a3b8" }} className="text-[11px] mt-0.5">
                  Tư vấn đồ chơi thông minh 24/7
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#cbd5e1" }}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20 hover:text-white"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div style={{ backgroundColor: "#f8fafc" }} className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col ${item.sender === "user" ? "items-end" : "items-start"
                  }`}
              >
                {/* Sender Avatar & Name */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium mb-1 px-1">
                  {item.sender === "user" ? (
                    <>
                      <span style={{ color: "#64748b" }}>Bạn</span>
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span style={{ color: "#312e81" }} className="font-semibold">Trợ lý AI</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  style={
                    item.sender === "user"
                      ? { backgroundColor: "#2563eb", color: "#ffffff" }
                      : { backgroundColor: "#ffffff", color: "#0f172a", borderColor: "#cbd5e1" }
                  }
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${item.sender === "user"
                    ? "rounded-br-none shadow-md font-medium"
                    : "border shadow-sm rounded-bl-none font-normal"
                    }`}
                >
                  <div className="whitespace-pre-line">{item.text}</div>
                </div>

                {/* Recommended Products */}
                {item.products && item.products.length > 0 && (
                  <div className="mt-3 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.products.map((prod) => (
                      <div
                        key={prod.id}
                        style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1" }}
                        className="border rounded-2xl p-3 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
                      >
                        <div>
                          <div style={{ backgroundColor: "#f1f5f9" }} className="w-full h-20 rounded-xl mb-2 flex items-center justify-center overflow-hidden relative">
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <ShoppingBagIcon className="w-7 h-7 text-indigo-500 group-hover:scale-110 transition-transform" />
                            )}
                          </div>
                          <p style={{ color: "#0f172a" }} className="font-bold text-xs line-clamp-2 leading-snug">
                            {prod.name}
                          </p>
                        </div>
                        <div style={{ borderTopColor: "#f1f5f9" }} className="mt-2.5 pt-2 border-t flex items-center justify-between">
                          <p style={{ color: "#e11d48" }} className="text-xs font-bold">
                            {formatCurrency(prod.price)}
                          </p>
                          <a
                            href={`/shop-details/${prod.slug}`}
                            style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold hover:bg-indigo-600 px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                          >
                            <span>Xem</span>
                            <ArrowRightIcon className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ backgroundColor: "#ffffff", color: "#334155", borderColor: "#cbd5e1" }} className="flex items-center gap-2.5 text-xs font-medium p-3 rounded-2xl border shadow-sm w-fit">
                <SpinnerIcon className="w-4 h-4 text-indigo-600" />
                <span>AI đang tìm kiếm thông tin và tổng hợp gợi ý...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Option Chips */}
          <div style={{ backgroundColor: "#ffffff", borderTopColor: "#cbd5e1" }} className="p-2.5 border-t flex gap-2 overflow-x-auto text-xs no-scrollbar">
            <button
              onClick={() => handleSend("Tư vấn đồ chơi tư duy cho bé 3-5 tuổi")}
              style={{ backgroundColor: "#f1f5f9", color: "#334155", borderColor: "#cbd5e1" }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border text-[11px] whitespace-nowrap transition-all active:scale-95 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <SparklesIcon className="w-3 h-3 text-indigo-500" />
              <span>Đồ chơi 3-5 tuổi</span>
            </button>
            <button
              onClick={() => handleSend("Gợi ý đồ chơi Xếp hình Lego dưới 500k")}
              style={{ backgroundColor: "#f1f5f9", color: "#334155", borderColor: "#cbd5e1" }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border text-[11px] whitespace-nowrap transition-all active:scale-95 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <ShoppingBagIcon className="w-3 h-3 text-purple-500" />
              <span>Lego dưới 500k</span>
            </button>
            <button
              onClick={() => handleSend("Tư vấn quà sinh nhật cho bé trai 6 tuổi")}
              style={{ backgroundColor: "#f1f5f9", color: "#334155", borderColor: "#cbd5e1" }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium border text-[11px] whitespace-nowrap transition-all active:scale-95 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <SparklesIcon className="w-3 h-3 text-amber-500" />
              <span>Quà sinh nhật</span>
            </button>
          </div>

          {/* Input Box */}
          <div style={{ backgroundColor: "#ffffff", borderTopColor: "#cbd5e1" }} className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập yêu cầu tư vấn (VD: Bé 4 tuổi thích ô tô...)"
              style={{ backgroundColor: "#f1f5f9", color: "#0f172a", borderColor: "#cbd5e1" }}
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:bg-white border transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !userMessage.trim()}
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
              className="hover:bg-blue-700 disabled:opacity-50 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
            >
              <SendIcon className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
