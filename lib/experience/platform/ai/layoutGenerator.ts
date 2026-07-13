/**
 * Future AI layout layer — interface only.
 * No model calls yet; architecture is ready for prompt → BlockDocument.
 */

import { createBlockNode } from "@/lib/experience/platform/composition/tree";
import { emitStudioEvent } from "@/lib/experience/platform/events";
import { listBlocks } from "@/lib/experience/platform/bootstrap";
import type {
  AiLayoutRequest,
  AiLayoutResult,
  BlockDocument,
} from "@/types/studio-platform";

/**
 * Heuristic layout generator — placeholder until an AI provider is wired.
 * Demonstrates the contract AI must satisfy later.
 */
export function generateLayoutFromPrompt(
  request: AiLayoutRequest,
): AiLayoutResult {
  const available = listBlocks(
    request.packIds?.length
      ? { packId: request.packIds[0] }
      : { packId: "medical" },
  );

  const byCategory = (category: string) =>
    available.find((block) => block.manifest.category === category)?.manifest
      .id;

  const sequence = [
    byCategory("Hero") ?? "hero-editorial",
    byCategory("Trust") ?? "trust-badges",
    byCategory("Content") ?? "content-body",
    byCategory("Doctor") ?? "doctor-card",
    byCategory("Gallery") ?? "gallery-grid",
    byCategory("Timeline") ?? "procedure-timeline",
    byCategory("FAQ") ?? "faq-accordion",
    byCategory("CTA") ?? "final-cta",
  ].filter(Boolean) as string[];

  const document: BlockDocument = {
    schemaVersion: 1,
    packIds: request.packIds ?? ["medical"],
    themeId: "medical",
    root: sequence.map((blockId) => createBlockNode(blockId)),
    meta: {
      generatedBy: "ai",
      notes: request.prompt.slice(0, 500),
    },
  };

  emitStudioEvent("AiLayoutGenerated", {
    prompt: request.prompt,
    blockCount: document.root.length,
  });

  return {
    document,
    rationale:
      "Heuristic medical landing skeleton. Replace with model output when AI provider is configured.",
  };
}
