"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { AssetManager } from "@/components/admin/assets/AssetManager";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/types/assets";

export type AssetPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: Asset) => void;
  title?: string;
  selectedMediaId?: number | null;
  imagesOnly?: boolean;
};

/**
 * Universal Asset Picker dialog — replaces WordPress MediaPicker throughout Studio.
 */
export function AssetPicker({
  open,
  onClose,
  onSelect,
  title = "Asset Manager",
  selectedMediaId = null,
  imagesOnly = true,
}: AssetPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const dialog = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="flex h-dvh w-screen min-w-0 flex-col overflow-hidden bg-surface shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <h2 className="font-heading text-h4 font-semibold text-foreground">
                {title}
              </h2>
              <p className="text-[0.75rem] text-muted-foreground">
                Browse, upload, and manage assets — WordPress stores the files.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close asset picker"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="min-h-0 flex-1">
            <AssetManager
              mode="dialog"
              imagesOnly={imagesOnly}
              selectedMediaId={selectedMediaId}
              onSelect={(asset) => {
                onSelect(asset);
                onClose();
              }}
            />
          </div>

          <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-3 sm:px-6">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(dialog, document.body);
}
