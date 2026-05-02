import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BriefOps",
  description: "Agentic intelligence briefings for technical builders."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
