import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/client";

type BodyImageValue = {
  alt?: string;
  caption?: string;
  asset?: {
    _id?: string;
    url?: string;
    metadata?: { lqip?: string; dimensions?: { width?: number; height?: number } };
  };
};

function BodyImage({ value }: { value: BodyImageValue }) {
  if (!value?.asset) return null;
  const width = value.asset.metadata?.dimensions?.width || 1200;
  const height = value.asset.metadata?.dimensions?.height || 800;
  const src = value.asset?.url
    ? urlFor({ asset: value.asset }).width(1200).url()
    : null;
  if (!src) return null;

  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={value.alt || ""}
        width={Math.min(width, 1200)}
        height={Math.round((Math.min(width, 1200) * height) / width)}
        className="h-auto w-full rounded-lg"
        placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={value.asset.metadata?.lqip}
      />
      {value.caption ? (
        <figcaption className="mt-2 text-center text-sm text-slate-500">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="mt-10 mb-4 text-3xl font-semibold tracking-tight text-slate-900">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-slate-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 text-xl font-semibold text-slate-900">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-5 mb-2 text-lg font-semibold text-slate-900">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-700">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-slate-300 pl-4 text-slate-600 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-6 text-slate-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-6 text-slate-700">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const external = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className="text-teal-700 underline underline-offset-2"
          rel={external ? "noopener noreferrer" : undefined}
          target={value?.openInNewTab || external ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    bodyImage: ({ value }) => <BodyImage value={value} />,
    youtube: ({ value }) => {
      const id = value?.youtubeId;
      if (!id) return null;
      return (
        <div className="my-8 aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
    embed: ({ value }) =>
      value?.html ? (
        <div
          className="my-6 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: value.html }}
        />
      ) : null,
    htmlTable: ({ value }) =>
      value?.html ? (
        <div
          className="my-6 overflow-x-auto rounded-lg border border-slate-200 p-2"
          dangerouslySetInnerHTML={{ __html: value.html }}
        />
      ) : null,
  },
};

export function SanityPortableText({ value }: { value: unknown }) {
  if (!Array.isArray(value) || value.length === 0) {
    return <p className="text-slate-500">No body content.</p>;
  }
  return <PortableText value={value} components={components} />;
}
