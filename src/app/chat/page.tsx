'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const samplePrompts = [
    'Bagaimana cara lolos SNBP di UGM?',
    'Berapa nilai rata-rata masuk Informatika ITB?',
    'Apakah peluang saya aman dengan nilai rapor 88?',
    'Perbedaan prospek kerja Sistem Informasi vs Informatika',
    'Tips menyusun portofolio olimpiade untuk SNBP',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulated Bot Reply
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Halo Ari! Untuk pertanyaan "${text.trim()}", berdasarkan data snpmb.id dan PDDikti, persaingan di jurusan ini tergolong ketat. Pastikan nilai akademik konsisten dan cek simulasi di menu Test Drive!`,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Outfit',sans-serif] relative overflow-x-hidden">
      <div className="w-full max-w-[402px] mx-auto min-h-screen flex flex-col justify-between relative bg-white border-x border-gray-100">
        {/* Top Header */}
        <header className="px-5 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
          {/* Back Button to /cocokin */}
          <Link
            href="/cocokin"
            aria-label="Kembali ke Rekomendasi"
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="square"
              />
            </svg>
          </Link>

          {/* Drawer Toggle Hamburger */}
          <button
            type="button"
            aria-label="Toggle Drawer"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className="p-1 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          >
            <span className="w-5 h-[3px] bg-black block"></span>
            <span className="w-5 h-[3px] bg-black block"></span>
            <span className="w-5 h-[3px] bg-black block"></span>
          </button>
        </header>

        {/* Chat / Greeting Content */}
        <div className="flex-1 px-4 py-6 flex flex-col justify-center overflow-y-auto">
          {messages.length === 0 ? (
            /* Figma Greeting Default State (31:1058) */
            <div className="text-center my-auto">
              <h1 className="font-['Press_Start_2P',monospace] text-[15px] leading-relaxed text-black">
                Halo, <span className="text-[#FBBC05]">Ari Rahman</span> !
              </h1>
              <p className="font-['Outfit',sans-serif] text-[13px] text-black mt-2">
                Beri tahu kami jurusan & kampus incaran kamu
              </p>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex flex-col gap-3 my-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[82%] p-3 text-[13px] leading-relaxed border-[2px] border-black shadow-[3px_3px_0px_#000] ${
                      m.sender === 'user'
                        ? 'bg-[#FEF08A] text-black'
                        : 'bg-[#EFF6FF] text-black'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Input Bar */}
        <div className="p-4 bg-white sticky bottom-0 z-10 border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="w-full h-[52px] border-[2px] border-[#4285F4] bg-white flex items-center justify-between px-3.5 focus-within:ring-2 focus-within:ring-[#4285F4]"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik untuk mulai ..."
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-black placeholder:text-gray-400 font-['Outfit',sans-serif]"
            />
            <div className="flex items-center gap-2">
              {/* Pixel Microphone Icon from Figma */}
              <button
                type="button"
                aria-label="Voice Input"
                onClick={() => setInputText('Apakah peluang saya di Kedokteran UGM aman?')}
                className="p-1 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/assets/avatar-bot.png"
                  alt="Microphone"
                  width={20}
                  height={20}
                  className="w-[18px] h-[18px] object-contain image-pixelated"
                />
              </button>
              {inputText.trim() && (
                <button
                  type="submit"
                  aria-label="Kirim"
                  className="bg-[#4285F4] text-white p-1 text-xs px-2 font-bold"
                >
                  ▶
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Drawer Menu (Figma Frame 68:352) */}
        {isDrawerOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-[195px] bg-[#C7D9FE] border-l-[2px] border-black z-30 p-4 flex flex-col justify-between shadow-[-4px_0px_0px_rgba(0,0,0,0.1)] animate-in slide-in-from-right-full duration-150">
            <div>
              {/* Drawer Top Hamburger (click to close) */}
              <div className="flex justify-start mb-6">
                <button
                  type="button"
                  aria-label="Tutup Drawer"
                  onClick={() => setIsDrawerOpen(false)}
                  className="cursor-pointer p-1"
                >
                  <span className="w-5 h-[3px] bg-black block mb-1"></span>
                  <span className="w-5 h-[3px] bg-black block mb-1"></span>
                  <span className="w-5 h-[3px] bg-black block"></span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/katalog"
                  onClick={() => setIsDrawerOpen(false)}
                  className="font-['Outfit',sans-serif] text-[13px] font-medium text-[#EA4335] hover:underline"
                >
                  Simulation
                </Link>
                <Link
                  href="/preferensi/minat"
                  onClick={() => setIsDrawerOpen(false)}
                  className="font-['Outfit',sans-serif] text-[13px] font-medium text-[#EA4335] hover:underline"
                >
                  Edit Preferensi
                </Link>
              </div>

              {/* Dashed Separator Line */}
              <div className="w-full border-b-[2px] border-dashed border-[#EA4335] my-4"></div>

              {/* Histori Percakapan */}
              <h2 className="font-['Outfit',sans-serif] text-[13px] font-bold text-black mb-3">
                Histori Percakapan
              </h2>

              <div className="flex flex-col gap-2">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left font-['Outfit',sans-serif] text-[11px] text-black hover:text-[#4285F4] truncate transition-colors"
                  >
                    {prompt.length > 20 ? prompt.slice(0, 20) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200">
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-[10px] text-gray-600 hover:text-black font-semibold"
              >
                Bersihkan Percakapan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
