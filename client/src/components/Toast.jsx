import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
};

const COLORS = {
  success: "border-moss/30 bg-moss/5 text-moss",
  error: "border-red-400/30 bg-red-50 text-red-600",
  info: "border-ember/30 bg-ember/5 text-ember"
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-20 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <div
              key={toast.id}
              className={`toast-slide-in flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-premium backdrop-blur ${COLORS[toast.type] || COLORS.info}`}
            >
              <Icon size={18} />
              <span className="flex-1">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="opacity-60 hover:opacity-100">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
