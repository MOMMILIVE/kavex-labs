import type { Metadata } from "next";
import ManifestoPage from "../../../components/ManifestoPage";
import { manifesto as copy } from "../../../lib/manifesto";

export const metadata: Metadata = {
  title: "Engineered Status · The Manifesto",
  alternates: {
    canonical: "/manifesto",
    languages: { en: "/manifesto", ar: "/ar/manifesto", nb: "/no/manifesto" },
  },
  openGraph: {
    title: copy.headline,
    description: copy.subhead,
    type: "article",
    images: [
      {
        url: "/assets/cad_design.webp",
        width: 1024,
        height: 1024,
        alt: "Kavex engagement ring CAD design",
      },
    ],
  },
};

export default function Manifesto() {
  return <ManifestoPage />;
}
