"use client";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import type { Toast, ToastVariant } from "@/hooks/use-toast";

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-emerald-950/90 border-emerald-500/30 text-emerald-100",
  error: "bg-red-950/90 border-red-500/30 text-red-100",
  info: "bg-slate-900/90 border-slate-500/30 text-slate-100",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
  error: <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />,
  info: <Info className="h-4 w-4 text-slate-400 shrink-0" />,
};

type ToasterProps = {
  toasts: Toast[];
  onDismiss: (id: number) => void;
};

export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-14 ml-2 right-6 z-100 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md animate-in slide-in-from-right-5 fade-in duration-300 ${variantStyles[toast.variant]}`}
        >
          {variantIcons[toast.variant]}
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
