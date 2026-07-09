"use client";

import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { cn } from "@/components/theme/cn";

const BAR_DATA = [
  { name: "Q1", value: 72 },
  { name: "Q2", value: 85 },
  { name: "Q3", value: 78 },
  { name: "Q4", value: 92 },
  { name: "Q5", value: 88 },
  { name: "Q6", value: 96 },
];

const AREA_DATA = [
  { name: "Jan", value: 42 },
  { name: "Feb", value: 38 },
  { name: "Mar", value: 55 },
  { name: "Apr", value: 48 },
  { name: "May", value: 62 },
  { name: "Jun", value: 58 },
  { name: "Jul", value: 71 },
];

const CHART_COLOR = "var(--theme-primary, #f48b22)";

function useChartInView() {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!motionEnabled) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [motionEnabled]);

  return { ref, animate: !motionEnabled || inView, motionEnabled };
}

export function StatsBarChartClient({ className }: { className?: string }) {
  const { ref, animate, motionEnabled } = useChartInView();

  return (
    <div ref={ref} className={cn("h-[140px] w-full md:h-[160px]", className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={BAR_DATA} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} vertical={false} />
          <Bar
            dataKey="value"
            fill={CHART_COLOR}
            fillOpacity={0.45}
            radius={[10, 10, 0, 0]}
            isAnimationActive={animate}
            animationDuration={motionEnabled ? 1200 : 0}
            animationBegin={0}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatsAreaChartClient({ className }: { className?: string }) {
  const { ref, animate, motionEnabled } = useChartInView();
  const gradientId = "statsAreaFillClient";

  return (
    <div ref={ref} className={cn("h-[140px] w-full md:h-[160px]", className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={AREA_DATA} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.45} />
              <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} vertical={false} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={CHART_COLOR}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            isAnimationActive={animate}
            animationDuration={motionEnabled ? 1400 : 0}
            animationBegin={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
