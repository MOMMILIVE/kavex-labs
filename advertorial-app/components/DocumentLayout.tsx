import { translate, type Language } from "../lib/i18n";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../app/globals.css";

const geist = localFont({
  src: "../fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
const arabic = localFont({
  src: "../fonts/noto-sans-arabic.ttf",
  preload: false,
  variable: "--font-arabic",
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
export default function DocumentLayout({
  children,
  language = "en",
}: Readonly<{ children: React.ReactNode; language?: Language }>) {
  return (
    <html
      lang={language === "no" ? "nb" : language}
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`${geist.variable} ${language === "ar" ? arabic.variable : ""}`}
    >
      <body>
        <a className="skip-link" href="#main">
          {translate(language, "Skip to content")}
        </a>
        {children}
      </body>
    </html>
  );
}
