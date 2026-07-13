export type ClipboardPayload<T> = {
  items: T[];
  copiedAt: string;
};

export function copyToClipboard<T>(items: T[]): ClipboardPayload<T> {
  return {
    items: structuredClone(items),
    copiedAt: new Date().toISOString(),
  };
}

export function pasteFromClipboard<T>(
  clipboard: ClipboardPayload<T> | null,
): T[] {
  if (!clipboard?.items.length) return [];
  return structuredClone(clipboard.items);
}
