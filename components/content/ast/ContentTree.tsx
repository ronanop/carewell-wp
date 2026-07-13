import { memo, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ContentNode, ContentTextRun } from "@/types/content-ast";

export type ContentNodeRenderContext = {
  node: ContentNode;
  children: ReactNode;
};

export type ContentTreeProps = {
  nodes: ContentNode[];
  className?: string;
  /** Wrap each node (Experience Studio editable overlays). */
  wrapNode?: (ctx: ContentNodeRenderContext) => ReactNode;
};

/**
 * Renders a Content AST as React — shared by public site and Experience Studio.
 */
export const ContentTree = memo(function ContentTree({
  nodes,
  className,
  wrapNode,
}: ContentTreeProps) {
  return (
    <div className={cn("content-ast", className)}>
      {nodes.map((node) => (
        <ContentNodeView key={node.id} node={node} wrapNode={wrapNode} />
      ))}
    </div>
  );
});

const ContentNodeView = memo(function ContentNodeView({
  node,
  wrapNode,
}: {
  node: ContentNode;
  wrapNode?: ContentTreeProps["wrapNode"];
}) {
  if (node.visibility === "hidden") return null;

  const body = renderNodeBody(node, wrapNode);
  if (!body) return null;

  return wrapNode ? wrapNode({ node, children: body }) : body;
});

function renderNodeBody(
  node: ContentNode,
  wrapNode?: ContentTreeProps["wrapNode"],
): ReactNode {
  const style = stylesToCss(node);
  const className = node.attributes.className;

  switch (node.type) {
    case "heading": {
      const level = node.attributes.level ?? 2;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag className={cn("content-ast-heading", className)} style={style}>
          <Runs runs={node.runs} />
        </Tag>
      );
    }
    case "paragraph":
      return (
        <p className={cn("content-ast-paragraph", className)} style={style}>
          <Runs runs={node.runs} />
        </p>
      );
    case "quote":
      return (
        <blockquote
          className={cn("content-ast-quote border-l-4 border-primary/30 pl-4 italic", className)}
          style={style}
        >
          <Runs runs={node.runs} />
        </blockquote>
      );
    case "code":
      return (
        <pre
          className={cn(
            "content-ast-code overflow-x-auto rounded-lg bg-muted p-4 text-small",
            className,
          )}
          style={style}
        >
          <code>
            <Runs runs={node.runs} />
          </code>
        </pre>
      );
    case "divider":
      return <hr className={cn("content-ast-divider my-8 border-border", className)} style={style} />;
    case "image": {
      const frameStyle = stylesToCss(node);
      const needsFrame = Boolean(
        node.styles.height ||
          node.styles.imageScale ||
          node.styles.crop ||
          node.styles.objectPositionX != null,
      );
      const img = (
        // WordPress media URLs are arbitrary hosts — next/image requires remotePatterns.
        // eslint-disable-next-line @next/next/no-img-element -- remote WP hosts
        <img
          src={node.attributes.src}
          alt={node.attributes.alt ?? ""}
          title={node.attributes.title}
          width={node.attributes.width ?? undefined}
          height={node.attributes.height ?? undefined}
          loading={node.attributes.loading ?? "lazy"}
          className={cn(
            "content-ast-image h-auto max-w-full",
            needsFrame && "h-full w-full",
            className,
          )}
          style={
            needsFrame
              ? { ...frameStyle, width: "100%", height: "100%" }
              : frameStyle
          }
        />
      );
      if (!needsFrame) return img;
      return (
        <div
          className="content-ast-image-frame relative overflow-hidden"
          style={{
            width: node.styles.width ?? undefined,
            height: node.styles.height ?? undefined,
            maxWidth: node.styles.maxWidth ?? undefined,
            borderRadius: node.styles.borderRadius ?? undefined,
          }}
        >
          {img}
        </div>
      );
    }
    case "figure":
      return (
        <figure className={cn("content-ast-figure", className)} style={style}>
          {node.children.map((child) => (
            <ContentNodeView key={child.id} node={child} wrapNode={wrapNode} />
          ))}
          {node.attributes.caption ? (
            <figcaption className="mt-2 text-center text-small text-muted-foreground">
              {node.attributes.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "list": {
      const Tag = node.attributes.listStyle === "numbered" ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            "content-ast-list my-4 space-y-1 pl-6",
            node.attributes.listStyle === "numbered" ? "list-decimal" : "list-disc",
            className,
          )}
          style={style}
        >
          {node.children.map((child) => (
            <ContentNodeView key={child.id} node={child} wrapNode={wrapNode} />
          ))}
        </Tag>
      );
    }
    case "list-item":
      return (
        <li className={cn("content-ast-list-item", className)} style={style}>
          <Runs runs={node.runs} />
          {node.children.map((child) => (
            <ContentNodeView key={child.id} node={child} wrapNode={wrapNode} />
          ))}
        </li>
      );
    case "button":
      return (
        <a
          href={node.attributes.href ?? "#"}
          target={node.attributes.target}
          rel={node.attributes.rel}
          className={cn(
            "content-ast-button inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-small font-medium text-primary-foreground no-underline",
            className,
          )}
          style={style}
        >
          <Runs runs={node.runs} />
        </a>
      );
    case "callout": {
      const tone = node.attributes.calloutTone ?? "info";
      const toneClass =
        tone === "warning"
          ? "border-amber-300 bg-amber-50 text-amber-950"
          : tone === "danger"
            ? "border-red-300 bg-red-50 text-red-950"
            : tone === "success" || tone === "tip"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-sky-300 bg-sky-50 text-sky-950";
      return (
        <aside
          className={cn(
            "content-ast-callout my-4 rounded-xl border px-4 py-3 text-small",
            toneClass,
            className,
          )}
          style={style}
        >
          <Runs runs={node.runs} />
        </aside>
      );
    }
    case "table":
    case "embed":
    case "video":
    case "faq":
    case "custom-html":
      if (!node.attributes.rawHtml) return null;
      return (
        <div
          className={cn("content-ast-raw", className)}
          style={style}
          dangerouslySetInnerHTML={{ __html: node.attributes.rawHtml }}
        />
      );
    case "group":
      return (
        <div className={cn("content-ast-group", className)} style={style}>
          {node.children.map((child) => (
            <ContentNodeView key={child.id} node={child} wrapNode={wrapNode} />
          ))}
        </div>
      );
    case "gallery":
      return (
        <div
          className={cn(
            "content-ast-gallery grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
            className,
          )}
          style={style}
        >
          {node.children.map((child) => (
            <ContentNodeView key={child.id} node={child} wrapNode={wrapNode} />
          ))}
        </div>
      );
    default:
      return null;
  }
}

function Runs({ runs }: { runs?: ContentTextRun[] }) {
  if (!runs?.length) return null;
  return (
    <>
      {runs.map((run, index) => {
        let el: ReactNode = run.text;
        for (const mark of run.marks ?? []) {
          if (mark.type === "bold") el = <strong key={`b${index}`}>{el}</strong>;
          else if (mark.type === "italic") el = <em key={`i${index}`}>{el}</em>;
          else if (mark.type === "underline") el = <u key={`u${index}`}>{el}</u>;
          else if (mark.type === "code")
            el = (
              <code key={`c${index}`} className="rounded bg-muted px-1">
                {el}
              </code>
            );
          else if (mark.type === "highlight")
            el = (
              <mark key={`h${index}`} className="bg-amber-100">
                {el}
              </mark>
            );
          else if (mark.type === "link")
            el = (
              <a
                key={`a${index}`}
                href={mark.href}
                target={mark.target}
                rel={mark.rel}
                className="text-primary underline-offset-2 hover:underline"
              >
                {el}
              </a>
            );
        }
        return <span key={index}>{el}</span>;
      })}
    </>
  );
}

function stylesToCss(node: ContentNode): CSSProperties | undefined {
  const s = node.styles;
  if (!s || !Object.keys(s).length) return undefined;

  const objectPosition =
    s.objectPosition ??
    (s.objectPositionX != null || s.objectPositionY != null
      ? `${s.objectPositionX ?? 50}% ${s.objectPositionY ?? 50}%`
      : undefined);

  const transformParts: string[] = [];
  if (s.imageScale != null && s.imageScale !== 1) {
    transformParts.push(`scale(${s.imageScale})`);
  }
  if (s.rotate) transformParts.push(`rotate(${s.rotate}deg)`);

  let clipPath: string | undefined;
  if (s.crop) {
    const { x, y, width, height } = s.crop;
    clipPath = `inset(${y}% ${Math.max(0, 100 - x - width)}% ${Math.max(0, 100 - y - height)}% ${x}%)`;
  }

  return {
    marginTop: s.margin?.top,
    marginRight: s.margin?.right,
    marginBottom: s.margin?.bottom,
    marginLeft: s.margin?.left,
    paddingTop: s.padding?.top,
    paddingRight: s.padding?.right,
    paddingBottom: s.padding?.bottom,
    paddingLeft: s.padding?.left,
    maxWidth: s.maxWidth ?? undefined,
    width: s.width ?? undefined,
    height: s.height ?? undefined,
    textAlign: s.textAlign ?? undefined,
    fontSize: s.fontSize ?? undefined,
    fontWeight: s.fontWeight ?? undefined,
    color: s.color ?? undefined,
    background: s.background ?? undefined,
    borderRadius: s.borderRadius ?? undefined,
    opacity: s.opacity ?? undefined,
    objectFit: s.objectFit ?? undefined,
    objectPosition,
    boxShadow: s.boxShadow ?? undefined,
    filter: s.filter ?? undefined,
    transform: transformParts.length ? transformParts.join(" ") : undefined,
    clipPath,
  };
}
