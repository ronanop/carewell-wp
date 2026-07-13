import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Studio | Care Well Medical Centre",
  robots: { index: false, follow: false },
};

/**
 * Root admin segment — studio layouts nest underneath.
 * Public root layout (fonts/tokens) still wraps this tree.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
