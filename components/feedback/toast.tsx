"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "default" | "success" | "danger" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

export function toast(input: Omit<ToastItem, "id">) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, ...input }];
  emit();
  return id;
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const toneIcon: Record<ToastTone, React.ReactNode> = {
  default: <Info className="size-5 text-text-brand" aria-hidden />,
  success: <CheckCircle2 className="size-5 text-success-fg" aria-hidden />,
  danger: <AlertCircle className="size-5 text-danger-fg" aria-hidden />,
  info: <Info className="size-5 text-info-fg" aria-hidden />,
};

export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
      {items.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          onOpenChange={(open) => {
            if (!open) dismiss(item.id);
          }}
          className={cn(
            "flex items-start gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-4 shadow-[var(--shadow-md)]",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0",
          )}
        >
          {toneIcon[item.tone ?? "default"]}
          <div className="flex-1">
            <ToastPrimitive.Title className="text-sm font-semibold text-text-primary">
              {item.title}
            </ToastPrimitive.Title>
            {item.description && (
              <ToastPrimitive.Description className="mt-0.5 text-sm text-text-secondary">
                {item.description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss"
            className="text-text-tertiary hover:text-text-primary"
          >
            <X className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 outline-none sm:bottom-6 sm:right-6" />
    </ToastPrimitive.Provider>
  );
}
