import Image from 'next/image';

export interface Bintang {
  x: number;
  y: number;
  s: number;
}

/** Ilustrasi siswa + bintang pixel (Figma "Illustration + stars"). Mobile: kotak 320 × 330, gambar 210 × 315.
 *  Desktop (D01 `184:2016`): kotak 460 × 460, gambar 290 × 435 lewat `kotak` dan `ukuranGambar`. Gambar dua lapis sesuai Figma. */
export default function IlustrasiSiswa({
  gambar,
  bintang,
  posisi = 'top-2.5 left-[55px]',
  kotak = 'h-[330px] w-[320px]',
  ukuranGambar = 'h-[315px] w-[210px]',
  className = '',
}: {
  gambar: [string, string];
  bintang: Bintang[];
  posisi?: string;
  kotak?: string;
  ukuranGambar?: string;
  className?: string;
}) {
  return (
    <div className={`relative shrink-0 ${kotak} ${className}`} aria-hidden>
      {bintang.map((t) => (
        <span key={`${t.x}-${t.y}`} className="absolute" style={{ left: t.x, top: t.y, width: t.s, height: t.s }}>
          <Image src="/figma/bintang-1.png" alt="" fill sizes="40px" className="object-cover" />
          <Image src="/figma/bintang-2.png" alt="" fill sizes="40px" className="object-cover" />
        </span>
      ))}
      <span className={`absolute ${ukuranGambar} ${posisi}`}>
        <Image src={gambar[0]} alt="" fill sizes="290px" className="object-cover" />
        <Image src={gambar[1]} alt="" fill sizes="290px" className="object-cover" />
      </span>
    </div>
  );
}
