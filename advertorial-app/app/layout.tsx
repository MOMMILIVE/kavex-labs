import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geist = localFont({
  src: "../fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://www.kavexlabs.com"),
  title: { default: "The Manifesto — Kavex Labs", template: "%s — Kavex Labs" },
  description:
    "The Bespoke Architect protocol. A Kavex Labs editorial on engineered status, direct sourcing, and modern luxury.",
  robots: { index: false, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
