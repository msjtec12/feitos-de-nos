'use client';

import React from 'react';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({ children, className = '', delay = 0 }: SectionRevealProps) {
  return (
    <div
      className={'transition-all duration-500 ease-out ' + className}
      style={{ animationDelay: delay + 'ms' }}
    >
      {children}
    </div>
  );
}
