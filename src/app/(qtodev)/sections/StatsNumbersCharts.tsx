"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";

const BAR_DATA = [
  { name: "Q1", value: 72, fill: "" },
  { name: "Q2", value: 85, fill: "" },
  { name: "Q3", value: 78, fill: "" },
  { name: "Q4", value: 92, fill: "" },
  { name: "Q5", value: 88, fill: "" },
  { name: "Q6", value: 96, fill: "" },
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

export function StatsBarChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const barFill = isDark ? "rgba(255,255,255,0.25)" : "rgba(139, 119, 101, 0.6)";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisStroke = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";

  return (
    <div className="h-[140px] w-full max-w-[280px] md:h-[160px] md:max-w-[320px]" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={BAR_DATA}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: axisStroke }}
            dy={4}
          />
          <YAxis hide domain={[0, 100]} />
          <Bar
            dataKey="value"
            fill={barFill}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatsAreaChart() {
  const gradientId = useId().replace(/:/g, "-");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const stroke = isDark ? "rgba(255,255,255,0.35)" : "rgba(139, 119, 101, 0.7)";
  const fillEnd = isDark ? "rgba(255,255,255,0)" : "rgba(139, 119, 101, 0)";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisStroke = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";

  return (
    <div className="h-[140px] w-full max-w-[280px] md:h-[160px] md:max-w-[320px]" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={AREA_DATA}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={isDark ? 0.4 : 0.6} />
              <stop offset="100%" stopColor={fillEnd} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: axisStroke }}
            dy={4}
          />
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
