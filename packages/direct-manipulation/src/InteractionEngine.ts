/**
 * Interaction Engine — centralizes pointer / keyboard / selection modes.
 * Editor overlays subscribe; React components must not invent ad-hoc gesture logic.
 */

export type InteractionMode =
  | "select"
  | "pan"
  | "resize"
  | "rotate"
  | "crop"
  | "image-position"
  | "image-scale"
  | "spacing"
  | "draw-select";

export type InteractionTarget = {
  kind: "section" | "content" | "layout" | "image";
  id: string;
};

export type InteractionState = {
  mode: InteractionMode;
  primary: InteractionTarget | null;
  selection: InteractionTarget[];
  hovered: InteractionTarget | null;
  pointerDown: boolean;
  spaceHeld: boolean;
  cropDraft: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
};

export type InteractionEvent =
  | { type: "set-mode"; mode: InteractionMode }
  | { type: "select"; target: InteractionTarget | null; additive?: boolean }
  | { type: "hover"; target: InteractionTarget | null }
  | { type: "pointer-down" }
  | { type: "pointer-up" }
  | { type: "space"; held: boolean }
  | { type: "begin-crop"; rect: InteractionState["cropDraft"] }
  | { type: "update-crop"; rect: NonNullable<InteractionState["cropDraft"]> }
  | { type: "cancel-crop" }
  | { type: "clear" };

export const INITIAL_INTERACTION: InteractionState = {
  mode: "select",
  primary: null,
  selection: [],
  hovered: null,
  pointerDown: false,
  spaceHeld: false,
  cropDraft: null,
};

export function reduceInteraction(
  state: InteractionState,
  event: InteractionEvent,
): InteractionState {
  switch (event.type) {
    case "set-mode":
      return {
        ...state,
        mode: event.mode,
        cropDraft: event.mode === "crop" ? state.cropDraft : null,
      };
    case "select": {
      if (!event.target) {
        return { ...state, primary: null, selection: [], mode: "select" };
      }
      if (event.additive) {
        const exists = state.selection.some(
          (t) => t.kind === event.target!.kind && t.id === event.target!.id,
        );
        const selection = exists
          ? state.selection.filter(
              (t) =>
                !(t.kind === event.target!.kind && t.id === event.target!.id),
            )
          : [...state.selection, event.target];
        return {
          ...state,
          primary: event.target,
          selection,
        };
      }
      return {
        ...state,
        primary: event.target,
        selection: [event.target],
      };
    }
    case "hover":
      return { ...state, hovered: event.target };
    case "pointer-down":
      return { ...state, pointerDown: true };
    case "pointer-up":
      return { ...state, pointerDown: false };
    case "space":
      return {
        ...state,
        spaceHeld: event.held,
        mode: event.held ? "pan" : state.mode === "pan" ? "select" : state.mode,
      };
    case "begin-crop":
      return { ...state, mode: "crop", cropDraft: event.rect };
    case "update-crop":
      return { ...state, cropDraft: event.rect };
    case "cancel-crop":
      return { ...state, mode: "select", cropDraft: null };
    case "clear":
      return { ...INITIAL_INTERACTION };
    default:
      return state;
  }
}

export function createInteractionStore(
  onChange?: (state: InteractionState) => void,
) {
  let state = { ...INITIAL_INTERACTION };
  return {
    getState: () => state,
    dispatch: (event: InteractionEvent) => {
      state = reduceInteraction(state, event);
      onChange?.(state);
      return state;
    },
  };
}
