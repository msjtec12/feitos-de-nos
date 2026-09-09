"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BrandSymbol } from "./BrandSymbol";

interface BrandLogoProps {
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSlogan?: boolean;
  className?: string;
  inverted?: boolean;
}

export function BrandLogo({
  src = "/brand/logo-feito-de-nos.png",
  size = "md",
  showSlogan = true,
  className = "",
  inverted = false,
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Dimensões proporcionais do logo oficial
  const heightClasses = {
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-14",
    lg: "h-16 sm:h-20",
    xl: "h-20 sm:h-24",
  };

  if (!imageError && src) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Feito de Nós — Histórias que viram presente"
          className={`${heightClasses[size]} w-auto object-contain transition-transform duration-300 drop-shadow-xs`}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback tipográfico oficial com DM Serif Display e símbolo SVG fiel
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="flex items-center gap-2.5">
        <BrandSymbol size={size === "lg" ? 36 : size === "md" ? 28 : 22} />
        <span
          className={`font-serif tracking-tight ${
            size === "lg" ? "text-2xl sm:text-3xl" : size === "md" ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          <span className="text-brand-wine">Feito de </span>
          <span className="text-brand-terracotta">Nós</span>
        </span>
      </div>
      {showSlogan && (
        <span className="text-[11px] sm:text-xs tracking-wider uppercase mt-1 font-medium text-brand-graphite/70">
          Histórias que viram presente.
        </span>
      )}
    </div>
  );
}
