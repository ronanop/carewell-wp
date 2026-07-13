/**
 * Dev-only guard: RichContent and AST content must never mount together.
 */

let richContentMounts = 0;
let astContentMounts = 0;

function assertExclusiveMounts(): void {
  if (process.env.NODE_ENV === "production") return;
  if (richContentMounts > 0 && astContentMounts > 0) {
    throw new Error(
      "[page-renderer] FATAL: RichContent and AST ContentRenderer are mounted together. " +
        "Only one content body renderer may exist per page tree. " +
        `rich=${richContentMounts} ast=${astContentMounts}`,
    );
  }
}

export function registerRichContentMount(): () => void {
  richContentMounts += 1;
  assertExclusiveMounts();
  return () => {
    richContentMounts = Math.max(0, richContentMounts - 1);
  };
}

export function registerAstContentMount(): () => void {
  astContentMounts += 1;
  assertExclusiveMounts();
  return () => {
    astContentMounts = Math.max(0, astContentMounts - 1);
  };
}

/** Test helpers */
export function __resetContentMountGuardsForTests(): void {
  richContentMounts = 0;
  astContentMounts = 0;
}

export function __getContentMountCountsForTests(): {
  rich: number;
  ast: number;
} {
  return { rich: richContentMounts, ast: astContentMounts };
}
