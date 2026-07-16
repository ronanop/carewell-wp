"use client";

/**
 * @deprecated Use AssetPicker from `@/components/admin/assets/AssetPicker`.
 * Compatibility wrapper preserving MediaBrowser props.
 */

import { AssetPicker } from "@/components/admin/assets/AssetPicker";
import type { Asset } from "@/types/assets";
import type { MediaAsset } from "@/types/wordpress-media";

export type MediaBrowserProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  title?: string;
  selectedMediaId?: number | null;
};

export function MediaBrowser({
  open,
  onClose,
  onSelect,
  title = "Asset Manager",
  selectedMediaId = null,
}: MediaBrowserProps) {
  return (
    <AssetPicker
      open={open}
      onClose={onClose}
      title={title}
      selectedMediaId={selectedMediaId}
      imagesOnly
      onSelect={(asset: Asset) => onSelect(asset)}
    />
  );
}
