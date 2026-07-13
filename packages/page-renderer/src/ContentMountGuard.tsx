"use client";

import { useEffect } from "react";

import {
  registerAstContentMount,
  registerRichContentMount,
} from "./runtimeGuard";

/** Invisible mount registrar for the exclusive content-renderer guard. */
export function ContentMountGuard({ kind }: { kind: "rich" | "ast" }) {
  useEffect(() => {
    return kind === "ast"
      ? registerAstContentMount()
      : registerRichContentMount();
  }, [kind]);
  return null;
}
