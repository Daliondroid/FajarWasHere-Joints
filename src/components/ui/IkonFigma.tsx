/**
 * Ikon pixel dari Figma (file SVG di /public/figma) yang warnanya ikut `currentColor`,
 * dipakai bila satu ikon tampil dalam beberapa warna (mis. item navigasi aktif/tidak aktif).
 */
export default function IkonFigma({ src, ukuran, className = '' }: { src: string; ukuran: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: ukuran,
        height: ukuran,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: '100% 100%',
        WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  );
}
