'use client';

import React from 'react';
import { PaymentStatus } from '@/types/database';
import { PAYMENT_STATUS_MAP } from '@/types/admin';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export function PaymentStatusBadge({
  status,
  size = 'md',
}: PaymentStatusBadgeProps) {
  const info = PAYMENT_STATUS_MAP[status] || {
    status,
    label: status,
    bgClass: 'bg-gray-100 border-gray-300',
    textClass: 'text-gray-700',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-sm ${info.bgClass} ${info.textClass} ${sizeClasses[size]}`}
    >
      {info.label}
    </span>
  );
}
