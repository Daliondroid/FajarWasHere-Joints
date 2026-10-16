import Image from 'next/image';

export interface Bintang {
  x: number;
  y: number;
  s: number;
}

/** Ilustrasi siswa + bintang pixel (Figma "Illustration + stars", kotak 320 × 330). Gambar dua lapis sesuai Figma. */
export default function IlustrasiSiswa({
  gambar,
  bintang,
  posisi = 'top-2.5 left-[55px]',
}: {
  gambar: [string, string];
  bintang: Bintang[];
  posisi?: string;
}) {
  return (
    <div className="relative h-[330px] w-[320px] shrink-0" aria-hidden>
      {bintang.map((t) => (
        <span key={`${t.x}-${t.y}`} className="absolute" style={{ left: t.x, top: t.y, width: t.s, height: t.s }}>
          <Image src="/figma/bintang-1.png" alt="" fill sizes="40px" className="object-cover" />
          <Image src="/figma/bintang-2.png" alt="" fill sizes="40px" className="object-cover" />
        </span>
      ))}
      <span className={`absolute h-[315px] w-[210px] ${posisi}`}>
        <Image src={gambar[0]} alt="" fill sizes="210px" className="object-cover" />
        <Image src={gambar[1]} alt="" fill sizes="210px" className="object-cover" />
      </span>
    </div>
  );
}
