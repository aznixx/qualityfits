const message = "NIKE ESSENTIALS ASICS PRADA / SNELLE VERZENDING / QUALITYFITS / PREMIUM BRANDS";

export function AnnouncementBar() {
  const items = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="bg-brand-lime text-brand-ink text-xs sm:text-sm py-2 overflow-hidden border-b border-brand-ink/10">
      <div className="marquee">
        <div className="marquee-track font-bold tracking-widest uppercase">
          {items.map((i) => (
            <span key={`a${i}`}>{message}</span>
          ))}
        </div>
        <div className="marquee-track font-bold tracking-widest uppercase" aria-hidden>
          {items.map((i) => (
            <span key={`b${i}`}>{message}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
