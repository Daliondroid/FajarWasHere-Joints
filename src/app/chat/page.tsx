'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const samplePrompts = [
    'Peluang lolos Informatika UGM?',
    'Beda Sistem Informasi vs Informatika',
    'Prospek kerja lulusan Teknik Elektro',
  ];

  const chatHistory = [
    { title: 'Cara lolos SNBP Informatika UGM', time: 'Hari ini', active: true },
    { title: 'Beda SI dan Informatika', time: 'Kemarin', active: false },
    { title: 'Prospek kerja Teknik Elektro', time: '12 Okt', active: false },
    { title: 'Strategi pilih 4 prodi SNBT', time: '10 Okt', active: false },
    { title: 'Kuliah sambil kerja, bisa?', time: '8 Okt', active: false },
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

    // Simulated Bot Response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `Halo Ari! Mengenai "${text.trim()}", berdasarkan data snpmb.id dan PDDikti, persaingan di jurusan ini tergolong ketat. Pastikan nilai akademik konsisten dan kamu bisa coba simulasi studi kasus di menu Simulasi Jurusan!`,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Outfit',sans-serif] relative overflow-x-hidden">
      {/* 1. Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-black">
        <div className="w-full max-w-[402px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back button */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali"
            className="p-1 cursor-pointer hover:opacity-70 active:scale-90 transition-transform"
          >
            <Icon name="back" className="w-5 h-5 text-black" />
          </button>

          {/* Title */}
          <h1 className="font-['Press_Start_2P',monospace] text-xs sm:text-sm font-bold text-black text-center truncate">
            Cocokin AI
          </h1>

          {/* Hamburger Menu to open drawer */}
          <button
            type="button"
            aria-label="Buka Menu"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1 cursor-pointer hover:opacity-70 active:scale-90 transition-transform"
          >
            <Icon name="menu" className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* 4-Color Stripe Bar */}
        <div className="w-full grid grid-cols-4 h-[3px]">
          <div className="bg-[#277EFD]" />
          <div className="bg-[#F1402E]" />
          <div className="bg-[#FEBD01]" />
          <div className="bg-[#22A94F]" />
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="w-full max-w-[402px] mx-auto px-4 flex-1 flex flex-col justify-between pb-24 pt-8">
        {messages.length === 0 ? (
          /* Initial Screen (Figma 85:434) */
          <div className="flex flex-col items-center text-center my-auto">
            {/* Retro Cap Box */}
            <div className="w-[72px] h-[72px] border-[3px] border-black shadow-[4px_4px_0px_#000] bg-white flex items-center justify-center mb-6">
              <Image
                src="/assets/logo-cap.png"
                alt="Cap Logo"
                width={44}
                height={44}
                className="w-11 h-11 object-contain image-pixelated"
              />
            </div>

            {/* Greeting */}
            <h2 className="font-['Press_Start_2P',monospace] text-[15px] sm:text-[17px] font-bold text-black leading-relaxed mb-2">
              Halo, <span className="text-[#277EFD]">Ari Rahman</span>!
            </h2>
            <p className="text-xs text-[#4B5563] leading-relaxed max-w-[280px] mb-8">
              Tanya apa saja soal jurusan, kampus, dan strategi masuk PTN.
            </p>

            {/* Suggestion Chips */}
            <div className="w-full flex flex-col items-center">
              <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#6B7280] tracking-wider uppercase mb-3">
                COBA TANYAKAN
              </span>

              <div className="w-full flex flex-col gap-2.5 max-w-[340px]">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-center gap-2.5 text-left hover:bg-gray-50 active:translate-y-0.5 transition-transform"
                  >
                    <Icon name="plus" className="w-4 h-4 text-[#277EFD] shrink-0" />
                    <span className="text-xs font-semibold text-black leading-snug">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Messages */
          <div className="flex flex-col gap-3 py-4 overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-xs leading-relaxed border-2 border-black ${
                    m.sender === 'user'
                      ? 'bg-[#277EFD] text-white shadow-[3px_3px_0px_#000]'
                      : 'bg-[#FEF9E7] text-black shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 3. Composer Fixed Bottom (Figma 85:434) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-30 py-3 px-4">
        <div className="w-full max-w-[402px] mx-auto flex items-center gap-2.5">
          {/* Input field with mic */}
          <div className="flex-1 h-11 border-2 border-black bg-white px-3 flex items-center justify-between">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik pertanyaanmu..."
              className="w-full text-xs text-black placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <button
              type="button"
              aria-label="Voice input"
              className="p-1 hover:opacity-70 text-black shrink-0"
            >
              <Icon name="mic" className="w-5 h-5" />
            </button>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            aria-label="Kirim pesan"
            className="w-11 h-11 bg-[#277EFD] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center shrink-0 hover:bg-[#1b6fe5] active:translate-y-0.5 transition-transform"
          >
            <Icon name="send" className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 4. Side Drawer (Figma 85:478 · Cocokin AI — Menu & Riwayat) */}
      {isDrawerOpen && (
        <>
          {/* Scrim Overlay */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-[300px] max-w-[85vw] bg-white border-l-[3px] border-black z-50 flex flex-col justify-between p-4 shadow-[-4px_0px_0px_#000] animate-in slide-in-from-right duration-150">
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black">
                <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-black">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 cursor-pointer hover:opacity-70"
                >
                  <Icon name="close" className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Chat Baru Button */}
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setIsDrawerOpen(false);
                }}
                className="w-full pixel-btn-blue py-2.5 text-[11px] tracking-wider mb-4 flex items-center justify-center gap-2"
              >
                <span>CHAT BARU</span>
                <Icon name="plus" className="w-3.5 h-3.5 text-white" />
              </button>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1">
                <Link
                  href="/cocokin"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 text-black transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="plus" className="w-4 h-4 text-black" />
                    <span className="font-['Press_Start_2P',monospace] text-[10px]">
                      Rekomendasi
                    </span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  href="/katalog"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 text-black transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="play" className="w-4 h-4 text-black" />
                    <span className="font-['Press_Start_2P',monospace] text-[10px]">
                      Simulasi jurusan
                    </span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  href="/preferensi/minat"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 text-black transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="edit" className="w-4 h-4 text-black" />
                    <span className="font-['Press_Start_2P',monospace] text-[10px]">
                      Edit preferensi
                    </span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>

              {/* Section Riwayat Percakapan */}
              <div className="mt-4 pt-3 border-t-2 border-gray-200 flex flex-col">
                <span className="font-['Press_Start_2P',monospace] text-[9px] text-[#6B7280] tracking-wider uppercase mb-2">
                  RIWAYAT PERCAKAPAN
                </span>

                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[220px]">
                  {chatHistory.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        handlePromptClick(item.title);
                        setIsDrawerOpen(false);
                      }}
                      className={`p-2 flex items-start gap-2 cursor-pointer transition-colors ${
                        item.active
                          ? 'bg-[#EEF5FF] border-2 border-[#277EFD]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        name="chat"
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          item.active ? 'text-[#277EFD]' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex flex-col truncate">
                        <span className="text-[11px] font-medium text-black truncate leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[9px] text-gray-400 mt-0.5">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Profile Card (Ari Rahman) */}
            <div className="p-2.5 border-2 border-black bg-[#FFFDF5] flex items-center gap-2.5 mt-4">
              <div className="w-9 h-9 border-2 border-black bg-[#FEBD01] flex items-center justify-center font-['Press_Start_2P',monospace] text-[10px] font-bold text-black shrink-0">
                AR
              </div>
              <div className="flex flex-col truncate">
                <span className="font-['Press_Start_2P',monospace] text-[9px] font-bold text-black truncate">
                  Ari Rahman
                </span>
                <span className="text-[11px] text-[#6B7280] truncate">
                  SMAN 1 Talaga
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
