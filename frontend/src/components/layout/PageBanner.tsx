"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface PageBannerRightCard {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

export interface PageBannerProps {
  badgeText: string;
  badgeIcon?: React.ReactNode;
  title: string;
  description: string;
  rightCard?: PageBannerRightCard;
  actionButton?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function PageBanner({
  badgeText,
  badgeIcon,
  title,
  description,
  rightCard,
  actionButton,
  className = "",
  style = {},
}: PageBannerProps) {
  const displayBadgeText = badgeText
    .replace(/[•·\-–—]\s*CEAMIS(\s*2\.0)?/gi, "")
    .replace(/CEAMIS(\s*2\.0)?/gi, "")
    .trim();

  return (
    <div 
      style={{
        background: "var(--color-lime)",
        border: "2px solid var(--color-navy)",
        boxShadow: "3px 3px 0px var(--color-navy)",
        borderRadius: "14px",
        ...style,
      }}
      className={`p-3.5 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${className}`}
    >
      <div>
        <div className="inline-flex items-center bg-[#0A192F] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1.5">
          {displayBadgeText}
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#0A192F] leading-tight">
          {title}
        </h1>
        <p className="text-[#0A192F]/85 font-medium text-xs md:text-sm mt-0.5 max-w-xl line-clamp-1 md:line-clamp-2">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {actionButton}

        {rightCard && (
          <div 
            style={{
              background: "#FFFFFF",
              border: "2px solid var(--color-navy)",
              boxShadow: "2px 2px 0px var(--color-navy)",
              borderRadius: "10px",
            }}
            className="px-3 py-2 flex items-center gap-2.5 shrink-0"
          >
            {rightCard.icon}
            <div>
              <div className="text-[10px] font-bold uppercase text-gray-500 leading-tight">
                {rightCard.label}
              </div>
              <div className="text-xs font-black text-[#0A192F]">
                {rightCard.value}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
