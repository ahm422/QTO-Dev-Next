const BAR_DATA = [72, 85, 78, 92, 88, 96] as const;
const AREA_DATA = [42, 38, 55, 48, 62, 58, 71] as const;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function toPoints(values: readonly number[], w: number, h: number, padding: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  return values.map((v, i) => {
    const t = values.length <= 1 ? 0 : i / (values.length - 1);
    const x = padding + t * innerW;
    const y = padding + (1 - clamp01((v - min) / span)) * innerH;
    return { x, y };
  });
}

function linePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function areaPath(points: Array<{ x: number; y: number }>, w: number, h: number, padding: number) {
  if (points.length === 0) return "";
  const baseY = h - padding;
  return `${linePath(points)} L ${points[points.length - 1]!.x} ${baseY} L ${points[0]!.x} ${baseY} Z`;
}

export function StatsBarChart() {
  const w = 320;
  const h = 160;
  const padding = 14;
  const bars = BAR_DATA;
  const max = Math.max(...bars);
  const innerH = h - padding * 2;
  const innerW = w - padding * 2;
  const gap = 10;
  const barW = (innerW - gap * (bars.length - 1)) / bars.length;

  return (
    <div className="h-[140px] w-full max-w-[280px] md:h-[160px] md:max-w-[320px]" aria-hidden>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
        <g stroke="currentColor" opacity="0.12">
          <line x1={padding} y1={padding + innerH * 0.33} x2={w - padding} y2={padding + innerH * 0.33} />
          <line x1={padding} y1={padding + innerH * 0.66} x2={w - padding} y2={padding + innerH * 0.66} />
          <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} />
        </g>

        <g fill="var(--theme-primary, #f48b22)" opacity="0.45">
          {bars.map((v, i) => {
            const t = max === 0 ? 0 : v / max;
            const bh = clamp01(t) * innerH;
            const x = padding + i * (barW + gap);
            const y = padding + (innerH - bh);
            const r = 10;
            return <rect key={i} x={x} y={y} width={barW} height={bh} rx={r} ry={r} />;
          })}
        </g>
      </svg>
    </div>
  );
}

export function StatsAreaChart() {
  const w = 320;
  const h = 160;
  const padding = 14;
  const points = toPoints(AREA_DATA, w, h, padding);
  const stroke = "var(--theme-primary, #f48b22)";

  return (
    <div className="h-[140px] w-full max-w-[280px] md:h-[160px] md:max-w-[320px]" aria-hidden>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
        <defs>
          <linearGradient id="statsAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g stroke="currentColor" opacity="0.12">
          <line x1={padding} y1={padding + (h - padding * 2) * 0.33} x2={w - padding} y2={padding + (h - padding * 2) * 0.33} />
          <line x1={padding} y1={padding + (h - padding * 2) * 0.66} x2={w - padding} y2={padding + (h - padding * 2) * 0.66} />
          <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} />
        </g>

        <path d={areaPath(points, w, h, padding)} fill="url(#statsAreaFill)" />
        <path d={linePath(points)} fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
