import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Map My Swing — Golf Swing Analyzer",
  description: "Analyze your golf swing with frame-by-frame breakdown, tempo analysis, and swing metrics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
