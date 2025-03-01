'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
  dismiss: (id?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);

    // Otomatik kapat
    if (props.duration !== 0) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || 3000);
    }
  };

  const dismiss = (id?: string) => {
    if (id) {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    } else {
      setToasts([]);
    }
  };

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: (ToastProps & { id: string })[];
  dismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md transition-all transform translate-y-0 opacity-100 ${
            toast.variant === 'destructive'
              ? 'bg-red-100 border-l-4 border-red-500 text-red-700'
              : toast.variant === 'success'
              ? 'bg-green-100 border-l-4 border-green-500 text-green-700'
              : 'bg-white border-l-4 border-blue-500 text-gray-700'
          }`}
          role="alert"
        >
          <div className="flex justify-between items-start">
            <div>
              {toast.title && <h3 className="font-medium">{toast.title}</h3>}
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Kapat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const toast = (props: ToastProps) => {
  // Client tarafında çalışıyorsa
  if (typeof window !== 'undefined') {
    // Toast context'i henüz oluşturulmamış olabilir, bu durumda bir sonraki tick'te deneyelim
    setTimeout(() => {
      try {
        const context = React.useContext(ToastContext);
        if (context) {
          context.toast(props);
        } else {
          console.warn('Toast context not found. Make sure ToastProvider is in the component tree.');
        }
      } catch (error) {
        console.warn('Failed to show toast:', error);
      }
    }, 0);
  }
}; 