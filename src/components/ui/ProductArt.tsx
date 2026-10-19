import type { ArtKind, Tone } from "@/data/catalog";

const TONES: Record<Tone, { bg1: string; bg2: string; metal1: string; metal2: string; stone: string; accent: string }> = {
  gold: { bg1: "#faf5ec", bg2: "#ebdccb", metal1: "#e4d092", metal2: "#a87f2a", stone: "#fffef8", accent: "#141211" },
  rose: { bg1: "#fcf4f0", bg2: "#f4ded5", metal1: "#eed0c5", metal2: "#b87563", stone: "#fff8f6", accent: "#2a1c1e" },
  onyx: { bg1: "#faf5f0", bg2: "#ebdccb", metal1: "#e4d092", metal2: "#85631c", stone: "#1e1b19", accent: "#141211" },
  pearl: { bg1: "#fdf8f5", bg2: "#f0dfd5", metal1: "#dbc17e", metal2: "#9e7d30", stone: "#fffdfa", accent: "#6e6458" },
};

/**
 * Illustrated placeholder shown until a real product photo is uploaded.
 * Line-art in the brand's gold/ivory/black palette — one drawing per jewellery type.
 */
export function ProductArt({ kind, tone = "gold", uid, bare = false }: { kind: ArtKind; tone?: Tone; uid: string; bare?: boolean }) {
  const t = TONES[tone];
  const g = `g-${uid}`;
  const bg = `bg-${uid}`;
  const metal = { stroke: `url(#${g})`, fill: "none", strokeWidth: 5, strokeLinecap: "round" as const };
  const stone = { fill: t.stone, stroke: `url(#${g})`, strokeWidth: 2.5 };

  const art = (() => {
    switch (kind) {
      case "ring":
        return (
          <>
            <ellipse cx="200" cy="262" rx="78" ry="82" {...metal} strokeWidth={13} />
            <path d="M170 186 L200 138 L230 186 Z" {...stone} />
            <path d="M170 186 L200 196 L230 186 M200 138 L200 196" fill="none" stroke={`url(#${g})`} strokeWidth={2} />
          </>
        );
      case "hoop":
        return (
          <>
            <circle cx="140" cy="215" r="64" {...metal} strokeWidth={9} />
            <circle cx="262" cy="215" r="64" {...metal} strokeWidth={9} />
            <circle cx="140" cy="150" r="5" fill={`url(#${g})`} />
            <circle cx="262" cy="150" r="5" fill={`url(#${g})`} />
          </>
        );
      case "stud":
        return (
          <>
            {[140, 262].map((x) => (
              <g key={x}>
                <circle cx={x} cy="205" r="34" {...stone} strokeWidth={4} />
                <circle cx={x} cy="205" r="14" fill={`url(#${g})`} opacity={0.55} />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <circle key={a} cx={x + 46 * Math.cos((a * Math.PI) / 180)} cy={205 + 46 * Math.sin((a * Math.PI) / 180)} r="7" fill={`url(#${g})`} />
                ))}
              </g>
            ))}
          </>
        );
      case "drop":
        return (
          <>
            {[142, 260].map((x) => (
              <g key={x}>
                <circle cx={x} cy="110" r="8" fill={`url(#${g})`} />
                <path d={`M${x} 118 L${x} 160`} {...metal} strokeWidth={3} />
                <path d={`M${x} 160 C${x - 44} 200 ${x - 36} 262 ${x} 292 C${x + 36} 262 ${x + 44} 200 ${x} 160 Z`} {...stone} strokeWidth={4} />
                <circle cx={x} cy="296" r="9" fill={`url(#${g})`} />
                <circle cx={x} cy="228" r="12" fill={`url(#${g})`} opacity={0.5} />
              </g>
            ))}
          </>
        );
      case "necklace":
      case "chain-necklace":
        return (
          <>
            <path d="M92 118 C110 300 290 300 308 118" {...metal} strokeWidth={kind === "necklace" ? 6 : 3.5} strokeDasharray={kind === "chain-necklace" ? "2 7" : undefined} />
            {kind === "necklace" &&
              [150, 175, 200, 225, 250].map((x, i) => {
                const y = 244 + (i === 2 ? 22 : i === 1 || i === 3 ? 12 : 0) - 28;
                return <circle key={x} cx={x} cy={y} r={i === 2 ? 15 : 10} {...stone} />;
              })}
            {kind === "chain-necklace" && <circle cx="200" cy="262" r="9" {...stone} />}
          </>
        );
      case "pendant":
        return (
          <>
            <path d="M104 120 C120 250 280 250 296 120" {...metal} strokeWidth={3.5} />
            <path d="M200 226 L200 244" {...metal} strokeWidth={3} />
            <path d="M200 244 C160 270 172 322 200 340 C228 322 240 270 200 244 Z" {...stone} strokeWidth={4} />
            <circle cx="200" cy="288" r="11" fill={`url(#${g})`} opacity={0.55} />
          </>
        );
      case "mangalsutra":
        return (
          <>
            <path d="M92 110 C108 300 292 300 308 110" stroke={t.accent} strokeWidth="6" strokeDasharray="1 11" strokeLinecap="round" fill="none" />
            <path d="M92 110 C108 300 292 300 308 110" {...metal} strokeWidth={2.5} opacity={0.7} />
            <path d="M200 264 C176 282 184 314 200 326 C216 314 224 282 200 264 Z" {...stone} strokeWidth={3.5} />
            <circle cx="200" cy="292" r="7" fill={`url(#${g})`} />
          </>
        );
      case "bangle":
        return (
          <>
            <ellipse cx="200" cy="215" rx="108" ry="86" {...metal} strokeWidth={22} />
            <ellipse cx="200" cy="215" rx="108" ry="86" fill="none" stroke={t.stone} strokeWidth={4} strokeDasharray="1 14" strokeLinecap="round" opacity={0.9} />
            <ellipse cx="200" cy="215" rx="82" ry="62" fill="none" stroke={`url(#${g})`} strokeWidth={1.5} opacity={0.6} />
          </>
        );
      case "bracelet":
      case "chain-bracelet":
        return (
          <>
            <ellipse cx="200" cy="218" rx="112" ry="84" {...metal} strokeWidth={kind === "bracelet" ? 7 : 4} strokeDasharray={kind === "chain-bracelet" ? "14 5" : undefined} />
            {kind === "bracelet" &&
              [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <circle key={a} cx={200 + 112 * Math.cos((a * Math.PI) / 180)} cy={218 + 84 * Math.sin((a * Math.PI) / 180)} r="8" {...stone} strokeWidth={2} />
              ))}
            {kind === "chain-bracelet" && <circle cx="200" cy="302" r="8" {...stone} />}
          </>
        );
      case "watch":
        return (
          <>
            <rect x="166" y="60" width="68" height="100" rx="10" fill="none" stroke={`url(#${g})`} strokeWidth={9} />
            <rect x="166" y="270" width="68" height="100" rx="10" fill="none" stroke={`url(#${g})`} strokeWidth={9} />
            <circle cx="200" cy="215" r="80" fill={t.stone} stroke={`url(#${g})`} strokeWidth={9} />
            <circle cx="200" cy="215" r="64" fill="none" stroke={`url(#${g})`} strokeWidth={1.5} />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return <line key={i} x1={200 + 54 * Math.sin(a)} y1={215 - 54 * Math.cos(a)} x2={200 + 62 * Math.sin(a)} y2={215 - 62 * Math.cos(a)} stroke={t.accent} strokeWidth={i % 3 === 0 ? 3 : 1.2} opacity={0.8} />;
            })}
            <path d="M200 215 L200 172" stroke={t.accent} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M200 215 L228 232" stroke={t.accent} strokeWidth={3} strokeLinecap="round" />
            <circle cx="200" cy="215" r="5" fill={`url(#${g})`} />
          </>
        );
      case "combo":
        return (
          <>
            <path d="M96 100 C112 232 288 232 304 100" {...metal} strokeWidth={3} />
            <path d="M92 130 C108 290 292 290 308 130" {...metal} strokeWidth={4.5} strokeDasharray="2 6" />
            <path d="M104 160 C124 330 276 330 296 160" {...metal} strokeWidth={3} />
            <circle cx="200" cy="268" r="12" {...stone} />
            <path d="M200 316 C176 332 182 350 200 360 C218 350 224 332 200 316 Z" {...stone} strokeWidth={3} />
          </>
        );
    }
  })();

  return (
    <svg viewBox="0 0 400 430" className="h-full w-full" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.bg1} />
          <stop offset="1" stopColor={t.bg2} />
        </linearGradient>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.metal1} />
          <stop offset="0.55" stopColor={t.metal2} />
          <stop offset="1" stopColor={t.metal1} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {!bare && <rect width="400" height="430" fill={`url(#${bg})`} />}
      {!bare && <rect width="400" height="430" fill={`url(#glow-${uid})`} />}
      <g>{art}</g>
      <g fill={`url(#${g})`} opacity="0.8">
        <path d="M52 64 l4 12 12 4 -12 4 -4 12 -4 -12 -12 -4 12 -4z" />
        <path d="M340 340 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" />
      </g>
    </svg>
  );
}
