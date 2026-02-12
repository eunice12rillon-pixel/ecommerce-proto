import React, { useState, useCallback } from "react";
import { ToastContext } from "./toast-context";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a toast
  const showToast = useCallback((message, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);

    // Remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-green-500 text-white px-4 py-2 rounded shadow-md animate-slide-in"
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Simple animation using Tailwind */}
      <style>
        {`
          @keyframes slide-in {
            0% { opacity: 0; transform: translateX(100%); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
          }
        `}
      </style>
    </ToastContext.Provider>
  );
};
