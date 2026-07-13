export type SelectionState = {
  ids: string[];
  primaryId: string | null;
};

export function createSelection(ids: string[] = []): SelectionState {
  return {
    ids,
    primaryId: ids[0] ?? null,
  };
}

export function selectOne(
  state: SelectionState,
  id: string | null,
  opts?: { additive?: boolean; toggle?: boolean },
): SelectionState {
  if (!id) return createSelection();
  if (opts?.additive || opts?.toggle) {
    const has = state.ids.includes(id);
    if (opts.toggle && has) {
      const ids = state.ids.filter((x) => x !== id);
      return { ids, primaryId: ids[0] ?? null };
    }
    if (!has) {
      const ids = [...state.ids, id];
      return { ids, primaryId: id };
    }
    return { ...state, primaryId: id };
  }
  return { ids: [id], primaryId: id };
}

export function selectMany(ids: string[]): SelectionState {
  return {
    ids: [...new Set(ids)],
    primaryId: ids[0] ?? null,
  };
}

export function isSelected(state: SelectionState, id: string): boolean {
  return state.ids.includes(id);
}
