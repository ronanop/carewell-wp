import type {
  Asset,
  AssetConnection,
  AssetListFilter,
  AssetMetadataUpdate,
  AssetProviderName,
  AssetUploadInput,
} from "@/types/assets";

/**
 * AssetProvider — Experience Studio talks ONLY to this interface.
 * WordPress is the default implementation; S3/Cloudinary/etc. can plug in later.
 * Providers never expose credentials to the browser.
 */
export interface AssetProvider {
  readonly name: AssetProviderName;

  list(filter: AssetListFilter): Promise<AssetConnection>;

  getById(id: number): Promise<Asset>;

  getByIds(ids: number[]): Promise<Asset[]>;

  upload(input: AssetUploadInput): Promise<Asset>;

  /**
   * Replace binary + optional metadata. Prefer keeping the same storage id.
   * Returns the authoritative asset after replace (id may change if provider cannot rewrite in place).
   */
  replace(
    id: number,
    input: AssetUploadInput,
  ): Promise<{ asset: Asset; idChanged: boolean; previousId: number }>;

  updateMetadata(id: number, patch: AssetMetadataUpdate): Promise<Asset>;

  /** Soft-delete / trash — never hard-delete immediately. */
  trash(id: number): Promise<void>;

  restore(id: number): Promise<Asset>;

  /** Optional hard delete after trash confirmation workflows. */
  forceDelete?(id: number): Promise<void>;
}
