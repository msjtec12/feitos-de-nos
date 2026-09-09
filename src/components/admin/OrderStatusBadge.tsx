'use client';

import React from 'react';
import { OrderStatus } from '@/types/database';
import { ORDER_STATUS_MAP } from '@/types/admin';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export function OrderStatusBadge({
  status,
  size = 'md',
  showDescription = false,
}: OrderStatusBadgeProps) {
  const info = ORDER_STATUS_MAP[status] || {
    status,
    label: status,
    description: '',
    bgClass: 'bg-gray-100 border-gray-300',
    textClass: 'text-gray-700',
    dotClass: 'bg-gray-400',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <div className="inline-flex flex-col">
      <span
        className={`inline-flex items-center font-medium rounded-full border shadow-sm ${info.bgClass} ${info.textClass} ${sizeClasses[size]}`}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${info.dotClass}`} />
        <span>{info.label}</span>
      </span>
      {showDescription && info.description && (
        <span className="text-[11px] text-[#302B2D]/60 mt-1 pl-1">
          {info.description}
        </span>
      )}
    </div>
  );
}
