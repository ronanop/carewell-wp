/**
 * Generic undo/redo stack. EditorStore keeps PresentationConfig history;
 * this engine is reusable for layout-only operations.
 */
export type HistoryStack<T> = {
  past: T[];
  present: T;
  future: T[];
};

export function createHistory<T>(present: T): HistoryStack<T> {
  return { past: [], present, future: [] };
}

export function pushHistory<T>(
  stack: HistoryStack<T>,
  next: T,
  limit = 100,
): HistoryStack<T> {
  return {
    past: [...stack.past, stack.present].slice(-limit),
    present: next,
    future: [],
  };
}

export function undoHistory<T>(stack: HistoryStack<T>): HistoryStack<T> {
  if (!stack.past.length) return stack;
  const previous = stack.past[stack.past.length - 1]!;
  return {
    past: stack.past.slice(0, -1),
    present: previous,
    future: [stack.present, ...stack.future],
  };
}

export function redoHistory<T>(stack: HistoryStack<T>): HistoryStack<T> {
  if (!stack.future.length) return stack;
  const [next, ...rest] = stack.future;
  return {
    past: [...stack.past, stack.present],
    present: next!,
    future: rest,
  };
}
