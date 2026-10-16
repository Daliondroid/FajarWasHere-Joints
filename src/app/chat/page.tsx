'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  badge?: string;
  time?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Halo, Ari! Aku menjawab berdasarkan preferensi Informatika Impian (SNBP). Mau tanya apa?',
      time: '21.40',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Peluangku di Teknologi Informasi UGM?',
      time: '21.41',
    },
    {
      id: 'm3',
      sender: 'bot',
      badge: 'DATA RESMI · SNPMB.ID',
      text: 'Daya tampung SNBP 2026: 29 kursi. Tahun lalu 24 dari 645 pendaftar diterima (3,7%, Sangat Ketat). Dengan peringkat 36/287, peluangmu sekitar 10–20% (estimasi).',
      time: '21.41',
    },
    {
      id: 'm4',
      sender: 'user',
      text: 'UKT-nya berapa?',
      time: '21.42',
    },
    {
      id: 'm5',
      sender: 'bot',
      text: 'Maaf, datanya tidak tersedia. UKT per prodi belum ada di data resmi yang aku pakai, jadi aku tidak mau menebak.',
      time: '21.42',
    },
  ]);

  const quickChips = [
    'Peluangku di Teknologi Informasi UGM?',
    'Bandingkan Informatika ITB dan ITS',
    'Prodi serumpun yang lebih longgar?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: '21.43',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      let botResponse = 'Berdasarkan data snpmb.id dan PDDikti, prodi ini memiliki tingkat keketatan yang cukup tinggi. Perhatikan nilai rapor semester 1-5 dan mata pelajaran pendukung pilihanmu.';
      let badge: string | undefined = 'DATA RESMI · SNPMB.ID';

      if (text.toLowerCase().includes('ukt') || text.toLowerCase().includes('biaya')) {
        botResponse = 'Maaf, datanya tidak tersedia. UKT per prodi belum ada di data resmi yang aku pakai, jadi aku tidak mau menebak.';
        badge = undefined;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        badge,
        time: '21.43',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif] relative">
        {/* 1. Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b-2 border-[#151D21]">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Kembali"
              className="p-1 cursor-pointer hover:opacity-70 active:scale-90"
            >
              <Icon name="back" className="w-5 h-5 text-[#151D21]" />
            </button>

            <h1 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
              Cocokin AI
            </h1>

            <Link href="/" className="p-1">
              <Icon name="home" className="w-5 h-5 text-[#151D21]" />
            </Link>
          </div>

          {/* 4-Color Stripe Bar */}
          <div className="w-full grid grid-cols-4 h-1">
            <div className="bg-[#277EFD]" />
            <div className="bg-[#F1402E]" />
            <div className="bg-[#FEBD01]" />
            <div className="bg-[#22A94F]" />
          </div>

          {/* Subheader Banner: PREFERENSI AKTIF · SNBP (M15) */}
          <div className="px-4 py-2 bg-[#F9F8F6] border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-['Press_Start_2P',monospace] text-[7px] text-[#277EFD] tracking-wider uppercase">
                PREFERENSI AKTIF · SNBP
              </span>
              <span className="font-bold text-xs text-[#151D21]">
                Informatika Impian
              </span>
            </div>
            <Link
              href="/preferensi"
              className="text-[11px] text-[#277EFD] font-bold hover:underline"
            >
              Ubah
            </Link>
          </div>
        </header>

        {/* 2. Messages List */}
        <main className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto pb-24">
          <div className="text-center">
            <span className="font-['Press_Start_2P',monospace] text-[7px] text-[#6B7680] tracking-wider uppercase">
              HARI INI · 21.40
            </span>
          </div>

          {/* Quick Chips Suggestion (M15) */}
          <div className="flex flex-col gap-2 my-1">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip)}
                className="w-full text-left p-2.5 bg-white border border-[#151D21] shadow-[2px_2px_0px_#151D21] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] text-xs text-[#151D21] font-medium transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages */}
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] ${isUser ? 'self-end' : 'self-start'}`}
              >
                {m.badge && (
                  <span className="font-['Press_Start_2P',monospace] text-[7px] text-[#277EFD] mb-1">
                    {m.badge}
                  </span>
                )}
                <div
                  className={`p-3 border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#277EFD] text-white'
                      : 'bg-[#FFFDF0] text-[#151D21]'
                  }`}
                >
                  {m.text}
                </div>
                {m.time && (
                  <span className="text-[10px] text-[#6B7680] mt-1">
                    {m.time}
                  </span>
                )}
              </div>
            );
          })}
        </main>

        {/* 3. Sticky Bottom Input Box Persis Figma M15 */}
        <div className="sticky bottom-0 bg-white border-t-2 border-[#151D21] p-3 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ketik pertanyaanmu…"
            className="flex-1 p-2.5 bg-[#F9F8F6] border border-[#151D21] text-xs text-[#151D21] placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="px-3.5 py-2.5 bg-[#22A94F] hover:bg-[#1E9646] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] font-['Press_Start_2P',monospace] text-[9px] active:translate-x-[1px] cursor-pointer"
          >
            KIRIM
          </button>
        </div>
      </div>
    </div>
  );
}
