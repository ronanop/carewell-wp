"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { useEditorStore } from "@/lib/experience/builder/editorStore";
import { cn } from "@/lib/utils";

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/**
 * Single scroll surface for the live page.
 */
export const ScrollableViewport = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    onBackgroundClick?: () => void;
  }
>(function ScrollableViewport(
  { children, className, onBackgroundClick },
  forwardedRef,
) {
  const localRef = useRef<HTMLDivElement>(null);
  const zoom = useEditorStore((s) => s.zoom);
  const device = useEditorStore((s) => s.device);

  useEffect(() => {
    const el = localRef.current;
    assignRef(forwardedRef, el);
    return () => assignRef(forwardedRef, null);
  }, [forwardedRef]);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    function onKey(event: KeyboardEvent) {
      if (!el) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const page = el.clientHeight * 0.9;
      if (event.key === "PageDown") {
        event.preventDefault();
        el.scrollBy({ top: page, behavior: "smooth" });
      } else if (event.key === "PageUp") {
        event.preventDefault();
        el.scrollBy({ top: -page, behavior: "smooth" });
      } else if (event.key === "Home" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        el.scrollTo({ top: 0, behavior: "smooth" });
      } else if (event.key === "End" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={localRef}
      tabIndex={0}
      data-editor-viewport
      className={cn(
        "h-full w-full overflow-auto overscroll-contain outline-none",
        "[scrollbar-gutter:stable]",
        className,
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onBackgroundClick?.();
        }
      }}
    >
      <div
        data-editor-page-frame
        className={cn(
          "mx-auto min-h-full bg-white transition-[width] duration-300 ease-out",
          device === "desktop" && "w-full",
          device === "tablet" &&
            "w-[768px] max-w-full shadow-[0_0_0_1px_rgba(15,23,42,0.06)]",
          device === "mobile" &&
            "w-[390px] max-w-full shadow-[0_0_0_1px_rgba(15,23,42,0.06)]",
        )}
        style={{
          zoom: zoom / 100,
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onBackgroundClick?.();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
});
