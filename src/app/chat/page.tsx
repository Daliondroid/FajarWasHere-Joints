'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Icon } from '@/components/ui/Icon';
import PemilihPreferensi from '@/components/ui/PemilihPreferensi';
import { usePreferensiStorage } from '@/components/preferensi/usePreferensiStorage';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  badge?: string;
  time?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { savedList, setAktif } = usePreferensiStorage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
      let botResponse =
        'Berdasarkan data snpmb.id dan PDDikti, prodi ini memiliki tingkat keketatan yang cukup tinggi. Perhatikan nilai rapor semester 1-5 dan mata pelajaran pendukung pilihanmu.';
      let badge: string | undefined = 'DATA RESMI · SNPMB.ID';

      if (text.toLowerCase().includes('ukt') || text.toLowerCase().includes('biaya')) {
        botResponse =
          'Maaf, datanya tidak tersedia. UKT per prodi belum ada di data resmi yang aku pakai, jadi aku tidak mau menebak.';
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
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center">
      <div className="w-full max-w-[402px] bg-white border-x-2 border-black flex flex-col min-h-screen font-['Outfit',sans-serif] relative">
        {/* 1. Header M15: Back + Title + Menu Action + 4-Color Stripe Bar */}
        <header className="sticky top-0 z-40 bg-white border-b-2 border-[#151D21]">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/cocokin')}
              aria-label="Kembali"
              className="p-1 cursor-pointer hover:opacity-70 active:scale-90"
            >
              <Icon name="back" className="w-5 h-5 text-[#151D21]" />
            </button>

            <h1 className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
              Cocokin AI
            </h1>

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Buka Menu Chat"
              className="p-1 cursor-pointer hover:opacity-70 active:scale-90"
            >
              <Icon name="menu" className="w-5 h-5 text-[#151D21]" />
            </button>
          </div>

          {/* 4-Color Stripe Progress Bar */}
          <div className="w-full grid grid-cols-4 h-1">
            <div className="bg-[#277EFD]" />
            <div className="bg-[#F1402E]" />
            <div className="bg-[#FEBD01]" />
            <div className="bg-[#22A94F]" />
          </div>

          {/* Subheader: Preferensi Aktif Container (M15) */}
          <div className="p-3 bg-[#F7F5F0] border-b border-gray-200">
            <PemilihPreferensi
              preferensiList={savedList}
              onPilih={setAktif}
            />
          </div>
        </header>

        {/* 2. Messages List */}
        <main className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto pb-24">
          <div className="text-center my-1">
            <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#6B7680] tracking-wider uppercase">
              HARI INI · 21.40
            </span>
          </div>

          {/* Initial Bot Bubble */}
          <div className="flex items-start gap-2.5 max-w-[90%] self-start">
            <div className="w-8 h-8 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center shrink-0">
              <Icon name="school" className="w-4 h-4 text-[#277EFD]" />
            </div>
            <div className="p-3 bg-white border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] text-sm text-[#151D21] font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Halo, Ari! Aku menjawab berdasarkan preferensi Informatika Impian (SNBP). Mau tanya apa?
            </div>
          </div>

          {/* Quick Prompt Chips (M15) */}
          <div className="flex flex-col gap-2 my-1 pl-10">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip)}
                className="w-full text-left p-2.5 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#151D21] flex items-center gap-2 cursor-pointer transition-all"
              >
                <Icon name="spark" className="w-3.5 h-3.5 text-[#277EFD] shrink-0" />
                <span>{chip}</span>
              </button>
            ))}
          </div>

          {/* Conversation Messages */}
          {messages.slice(1).map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 max-w-[90%] ${
                  isUser ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center shrink-0">
                    <Icon name="school" className="w-4 h-4 text-[#277EFD]" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {m.badge && (
                    <span className="self-start px-2 py-0.5 bg-[#E6F6EC] border border-[#22A94F] text-[#22A94F] font-bold text-[10px] tracking-wider uppercase">
                      {m.badge}
                    </span>
                  )}
                  <div
                    className={`p-3 border-2 border-[#151D21] shadow-[3px_3px_0px_#151D21] text-sm leading-relaxed font-['Plus_Jakarta_Sans',sans-serif] ${
                      isUser
                        ? 'bg-[#277EFD] text-white'
                        : 'bg-white text-[#151D21]'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.time && (
                    <span
                      className={`text-[10px] text-[#6B7680] ${
                        isUser ? 'self-end' : 'self-start'
                      }`}
                    >
                      {m.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </main>

        {/* 3. Sticky Bottom Composer (M15) */}
        <div className="sticky bottom-0 bg-white border-t-2 border-[#151D21] p-3 flex items-center gap-2 z-30">
          <button
            type="button"
            aria-label="Tambah Lampiran"
            className="w-10 h-10 bg-white hover:bg-gray-100 text-[#151D21] border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center cursor-pointer active:translate-x-[1px] active:translate-y-[1px] shrink-0"
          >
            <Icon name="plus" className="w-4 h-4 text-[#151D21]" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ketik pertanyaanmu…"
            className="flex-1 h-10 px-3 bg-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] text-xs text-[#151D21] placeholder:text-[#6B7680] font-['Plus_Jakarta_Sans',sans-serif] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            aria-label="Kirim Pesan"
            className="w-10 h-10 bg-[#277EFD] hover:bg-[#1E6FD9] text-white border-2 border-[#151D21] shadow-[2px_2px_0px_#151D21] flex items-center justify-center cursor-pointer active:translate-x-[1px] active:translate-y-[1px] shrink-0"
          >
            <Icon name="send" className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* 4. SIDE DRAWER MENU CHAT M16 (node 177:1649) */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-[#151D21]/60 flex justify-end">
            <div className="w-[320px] max-w-[85%] bg-white border-l-2 border-[#151D21] h-full flex flex-col p-4 overflow-y-auto animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D3D6DA] mb-4">
                <span className="font-['Press_Start_2P',monospace] text-xs font-bold text-[#151D21]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Tutup Menu"
                  className="w-7 h-7 border border-[#151D21] hover:bg-gray-100 flex items-center justify-center cursor-pointer"
                >
                  <Icon name="close" className="w-4 h-4 text-[#151D21]" />
                </button>
              </div>

              {/* Pemilih Preferensi + Link */}
              <div className="mb-4">
                <PemilihPreferensi
                  preferensiList={savedList}
                  onPilih={setAktif}
                />
                <Link
                  href="/preferensi"
                  onClick={() => setIsDrawerOpen(false)}
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#277EFD] hover:underline mt-2 inline-block"
                >
                  Kelola preferensi →
                </Link>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-1 mb-4">
                <Link
                  href="/katalog"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2.5 border border-[#151D21] flex items-center justify-between hover:bg-gray-50 text-[#151D21]"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="play" className="w-4 h-4 text-[#277EFD]" />
                    <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold">
                      Simulasi
                    </span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 text-[#151D21]" />
                </Link>

                <Link
                  href="/preferensi"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2.5 border border-[#151D21] flex items-center justify-between hover:bg-gray-50 text-[#151D21]"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="grid" className="w-4 h-4 text-[#FEBD01]" />
                    <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold">
                      Preferensi
                    </span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 text-[#151D21]" />
                </Link>

                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2.5 border border-[#151D21] flex items-center justify-between hover:bg-gray-50 text-[#151D21]"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon name="home" className="w-4 h-4 text-[#22A94F]" />
                    <span className="font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold">
                      Beranda
                    </span>
                  </div>
                  <Icon name="chevron-right" className="w-3.5 h-3.5 text-[#151D21]" />
                </Link>
              </div>

              <div className="border-b border-[#D3D6DA] my-2" />

              {/* Riwayat Chat Section */}
              <div className="mb-4">
                <span className="font-['Pixelify_Sans',sans-serif] text-[12px] font-medium text-[#6B7680] uppercase tracking-wider block mb-2">
                  RIWAYAT CHAT
                </span>

                <div className="space-y-2">
                  {/* Chat 1 (Active) */}
                  <div className="p-2.5 bg-[#EAF2FF] border-2 border-[#277EFD] shadow-[2px_2px_0px_#277EFD] flex items-center gap-2.5 cursor-pointer">
                    <Icon name="chat" className="w-4 h-4 text-[#277EFD] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Pixelify_Sans',sans-serif] text-[13px] font-semibold text-[#151D21] truncate">
                        Peluang TI UGM
                      </p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6B7680]">
                        Hari ini · 21.40
                      </p>
                    </div>
                  </div>

                  {/* Chat 2 */}
                  <div className="p-2.5 bg-white border border-[#151D21] hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
                    <Icon name="chat" className="w-4 h-4 text-[#6B7680] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Pixelify_Sans',sans-serif] text-[13px] font-semibold text-[#151D21] truncate">
                        Bandingkan ITB vs ITS
                      </p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6B7680]">
                        Kemarin · 14.15
                      </p>
                    </div>
                  </div>

                  {/* Chat 3 */}
                  <div className="p-2.5 bg-white border border-[#151D21] hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
                    <Icon name="chat" className="w-4 h-4 text-[#6B7680] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Pixelify_Sans',sans-serif] text-[13px] font-semibold text-[#151D21] truncate">
                        Jurusan alternatif Saintek
                      </p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6B7680]">
                        12 Okt 2026
                      </p>
                    </div>
                  </div>

                  {/* Chat 4 */}
                  <div className="p-2.5 bg-white border border-[#151D21] hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer">
                    <Icon name="chat" className="w-4 h-4 text-[#6B7680] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Pixelify_Sans',sans-serif] text-[13px] font-semibold text-[#151D21] truncate">
                        Strategi SNBP Informatika
                      </p>
                      <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#6B7680]">
                        10 Okt 2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-auto pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 text-[#F1402E] hover:underline font-['Pixelify_Sans',sans-serif] text-[15px] font-semibold cursor-pointer w-full"
                >
                  <Icon name="logout" className="w-4 h-4 text-[#F1402E]" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
