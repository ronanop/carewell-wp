# Care Well Medical Centre — Gutenberg Rendering Contract

## Purpose

Define the specification for rendering WordPress Gutenberg HTML content in the Next.js frontend. This contract governs the `ContentRenderer` component, HTML sanitization, embed handling, and styling of WordPress block output.

## Responsibilities

- Render Gutenberg HTML faithfully without converting to React components.
- Sanitize HTML to prevent XSS.
- Style WordPress block classes consistently with the design system.
- Handle embedded media (images, YouTube) responsively and accessibly.

## Architecture

```
WordPress Gutenberg Editor
  → WPGraphQL `content` field (rendered HTML string)
    → lib/wordpress/mappers/ (optional URL normalization)
      → ContentRenderer (Server Component)
        → Sanitized HTML via dangerouslySetInnerHTML
          → Scoped CSS for .wp-block-* classes
```

## ContentRenderer Component Contract

### Location

`components/shared/ContentRenderer.tsx`

### Type

Server Component (no interactivity required for content rendering).

### Props Interface

```typescript
interface ContentRendererProps {
  /** Raw HTML string from WordPress GraphQL content field */
  html: string;
  /** Optional className for wrapper */
  className?: string;
  /** Content type context for conditional styling */
  as?: 'article' | 'section' | 'div';
}
```

### Behavior Requirements

1. **Sanitize** HTML before rendering — remove `<script>`, event handlers (`onclick`, etc.), and unauthorized tags.
2. **Preserve** semantic content tags: `p`, `h1`–`h6`, `ul`, `ol`, `li`, `blockquote`, `figure`, `figcaption`, `a`, `strong`, `em`, `table`, `thead`, `tbody`, `tr`, `th`, `td`.
3. **Allow** `<iframe>` only from trusted YouTube/Vimeo embed sources.
4. **Wrap** iframes in a responsive container (`aspect-video` wrapper).
5. **Add** `rel="noopener noreferrer"` to external links opening in new tabs.
6. **Add** `loading="lazy"` attribute to content images where not already present.
7. **Apply** `prose` or custom typography classes for readable long-form content.
8. **Return** `null` or empty state component for empty HTML string.

### Sanitization Library

Use `isomorphic-dompurify` (or equivalent) when implementing. Configuration:

```typescript
const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'strong', 'em', 'b', 'i', 'u', 's',
  'figure', 'figcaption', 'img', 'iframe',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'br', 'hr', 'sup', 'sub',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'width', 'height', 'loading', 'target', 'rel',
  'colspan', 'rowspan', 'allow', 'allowfullscreen', 'frameborder',
];

const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
```

---

## Supported Gutenberg Blocks

| Block | Expected HTML Output | Rendering Strategy |
|-------|---------------------|-------------------|
| Paragraph | `<p>` | Style via `.wp-block-paragraph` or prose |
| Heading | `<h2>`–`<h6>` | Map to design system typography scale |
| Image | `<figure class="wp-block-image"><img>` | Ensure responsive; max-width 100% |
| Gallery | `<figure class="wp-block-gallery">` | CSS grid layout |
| List | `<ul>`, `<ol>` | Prose list styling |
| Quote | `<blockquote class="wp-block-quote">` | Brand blockquote styling |
| Embed (YouTube) | `<figure class="wp-block-embed"><iframe>` | Responsive wrapper |
| Columns | `<div class="wp-block-columns">` | Stack on mobile, side-by-side on desktop |
| Group | `<div class="wp-block-group">` | Pass-through container |
| Separator | `<hr class="wp-block-separator">` | Subtle border color |
| Button | `<div class="wp-block-button"><a class="wp-block-button__link">` | Style as secondary CTA |
| Table | `<figure class="wp-block-table"><table>` | Responsive scroll wrapper |
| Spacer | `<div class="wp-block-spacer">` | Preserve or collapse on mobile |

### Unsupported / Warning Blocks

If these appear unprocessed in HTML, log a server-side warning:

- Raw `[shortcode]` text (WordPress did not process shortcode server-side)
- `<script>` tags (stripped by sanitizer)
- Unknown block comments (`<!-- wp:... -->` visible in output)

---

## Styling Contract

### CSS Location

`styles/wordpress-content.css` imported in `ContentRenderer` or `globals.css`.

### Typography in Content

| Element | Style |
|---------|-------|
| `p` | `body` token, `mb-4`, `leading-relaxed` |
| `h2` | `heading-2` scale, `mt-8 mb-4` |
| `h3` | `heading-3` scale, `mt-6 mb-3` |
| `a` | `text-primary underline-offset-4 hover:underline` |
| `blockquote` | `border-l-4 border-accent pl-4 italic text-muted-foreground` |
| `ul`, `ol` | `ml-6 mb-4 list-disc/list-decimal` |
| `img` | `rounded-lg max-w-full h-auto` |
| `table` | `w-full border-collapse text-sm` |
| `th`, `td` | `border border-border px-4 py-2` |

### WordPress Class Prefix

Target `.wp-block-*` and `.alignwide`, `.alignfull`, `.aligncenter` classes from Gutenberg.

---

## URL Normalization

WordPress may return absolute URLs pointing to the CMS domain. The mapper or ContentRenderer must:

1. Leave image `src` URLs pointing to WordPress media (whitelisted in `next.config.ts`).
2. Convert internal WordPress page links to Next.js routes (e.g., `cms.domain.com/services/foo` → `/services/foo`).
3. Preserve external links unchanged.

---

## Accessibility Requirements

- Content images must have `alt` attributes (from WordPress media library).
- Decorative images with empty alt: render as-is.
- YouTube iframes: include `title` attribute for screen readers.
- Heading hierarchy: do not demote block headings — preserve WordPress h2/h3 as rendered (page provides h1).
- Tables: preserve `<th>` for header cells.

---

## Security Requirements

- Never render unsanitized HTML.
- Strip all `on*` event attributes.
- Strip `javascript:` URLs from `href` and `src`.
- Allow iframes only from: `youtube.com`, `youtube-nocookie.com`, `player.vimeo.com`.
- Log sanitization removals in development mode only.

---

## Error Handling

| Condition | Behavior |
|-----------|----------|
| Empty `html` prop | Return `null` |
| Sanitization removes all content | Return fallback message: "Content unavailable" |
| Malformed HTML | Sanitizer auto-corrects; log warning server-side |

---

## Testing Requirements

- Unit test sanitizer with: script injection, event handlers, allowed tags, YouTube iframe.
- Integration test with fixture HTML from real WordPress posts.
- Visual test: blog post with images, embeds, tables, columns.

---

## Do's

- Keep ContentRenderer as the single entry point for all Gutenberg HTML.
- Style WordPress blocks via scoped CSS, not inline styles.
- Test with real WordPress content samples before launch.

## Don'ts

- Do not parse Gutenberg block comments into React components.
- Do not use `dangerouslySetInnerHTML` outside ContentRenderer.
- Do not strip legitimate iframes from trusted video sources.
- Do not convert content to MDX.

## Future Expansion

- Lightbox for content images on click.
- Table of contents generation from heading blocks.
- Syntax highlighting for code blocks.
