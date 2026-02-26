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

/** Brand primary orange for charts (matches --theme-primary). */
const PRIMARY_HEX = "#f48b22";

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

export function StatsBarChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const barFill = isDark ? "rgba(244,139,34,0.5)" : "rgba(244,139,34,0.45)";
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisStroke = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)";

  return (
    <div
      className="h-[140px] w-full max-w-[280px] md:h-[160px] md:max-w-[320px]"
      aria-hidden
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={BAR_DATA}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: axisStroke }}
            dy={4}
          />
          <YAxis hide domain={[0, 100]} />
          <Bar
            dataKey="value"
            fill={barFill}
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
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
  const stroke = PRIMARY_HEX;
  const gridStroke = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisStroke = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.22)";

  return (
    <div
      className="h-[140px] w-full max-w-[280px] md:h-[160px] md:max-w-[320px]"
      aria-hidden
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={AREA_DATA}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={stroke}
                stopOpacity={0.5}
              />
              <stop
                offset="100%"
                stopColor={stroke}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: axisStroke }}
            dy={4}
          />
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
