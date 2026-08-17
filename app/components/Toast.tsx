'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export function Toast({ messages, onRemove }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((msg) => (
        <ToastItem
          key={msg.id}
          message={msg}
          onRemove={() => onRemove(msg.id)}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  message: ToastMessage;
  onRemove: () => void;
}

function ToastItem({ message, onRemove }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(onRemove, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[message.type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded shadow-lg flex items-center justify-between gap-4`}
    >
      <span>{message.message}</span>
      <button
        onClick={onRemove}
        className="text-white hover:text-gray-200 font-bold"
      >
        ×
      </button>
    </div>
  );
}
