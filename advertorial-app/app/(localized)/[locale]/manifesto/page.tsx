import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ManifestoPage from "../../../../components/ManifestoPage";
import { getLanguage, routeFor, translate } from "../../../../lib/i18n";
import { manifesto } from "../../../../lib/manifesto";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "no" }];
}
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const language = getLanguage(locale);
  return {
    title: translate(language, "Engineered Status · The Manifesto"),
    description: translate(language, manifesto.subhead),
    alternates: {
      canonical: routeFor(language, "manifesto"),
      languages: { en: "/manifesto", ar: "/ar/manifesto", nb: "/no/manifesto" },
    },
    openGraph: {
      title: translate(language, manifesto.headline),
      description: translate(language, manifesto.subhead),
      type: "article",
      locale: language === "ar" ? "ar" : "nb_NO",
      images: [{ url: "/assets/cad_design.webp", width: 1024, height: 1024 }],
    },
  };
}
export default async function LocalizedManifesto({ params }: Props) {
  const { locale } = await params;
  if (locale !== "ar" && locale !== "no") notFound();
  return <ManifestoPage language={getLanguage(locale)} />;
}
