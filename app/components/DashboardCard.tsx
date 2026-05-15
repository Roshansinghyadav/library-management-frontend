"use client";

import { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  title: string;
  count: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  color?: "indigo" | "rose" | "emerald" | "amber";
};

export default function DashboardCard({
  title,
  count,
  icon: Icon,
  trend,
  trendType = "neutral",
  color = "indigo"
}: DashboardCardProps) {
  
  const colorMap = {
    indigo: "bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-transparent",
    rose: "bg-gradient-to-br from-rose-500 to-pink-600 text-white border-transparent",
    emerald: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-transparent",
    amber: "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent",
  };

  const trendColors = {
    up: "text-emerald-500",
    down: "text-rose-500",
    neutral: "text-slate-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 card-hover group">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 ${trendColors[trendType]}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          {title}
        </h3>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {count}
        </p>
      </div>
    </div>
  );
}