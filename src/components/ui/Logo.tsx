/** Logo Cocokin! (Figma `80:98`): potongan logo.png sesuai crop di Figma. */
export default function Logo({ ukuran = 36, className = '' }: { ukuran?: number; className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 overflow-hidden ${className}`} style={{ width: ukuran, height: ukuran }}>
      <img
        src="/figma/logo.png"
        alt=""
        className="absolute max-w-none"
        style={{ width: '255%', height: '193.25%', left: '-75%', top: '-25.37%' }}
      />
    </span>
  );
}
