import { cn } from "@/lib/utils";

import { ContentContainer } from "@/components/content/ContentContainer";
import { normalizeContentSpacing } from "@/components/content/content-utils";

import "./rich-content.css";

/**
 * Renders trusted WordPress Gutenberg HTML.
 *
 * Security assumptions:
 * - `html` is sanitized upstream (repository / mapper / CMS).
 * - This component does not parse, rewrite, or execute scripts.
 * - Inline event handlers and `<script>` must already be stripped.
 * - Only trusted iframe sources should remain in the HTML payload.
 */
export interface RichContentProps {
  /** Sanitized HTML string from WordPress. */
  html: string;
  /** Optional className merged onto the `.rich-content` root. */
  className?: string;
}

/**
 * Primary WordPress content renderer for service and blog pages.
 * Styles Gutenberg markup via scoped `.rich-content` CSS only.
 */
export function RichContent({ html, className }: RichContentProps) {
  const content = normalizeContentSpacing(html);

  if (!content) {
    return null;
  }

  return (
    <ContentContainer>
      <div
        className={cn("rich-content", className)}
        // Trusted, pre-sanitized WordPress HTML — do not inject unsanitized strings.
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </ContentContainer>
  );
}
