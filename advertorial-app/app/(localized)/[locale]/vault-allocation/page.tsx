import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VaultPage from "../../../../components/VaultPage";
import { getLanguage, routeFor, translate } from "../../../../lib/i18n";
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "no" }];
}
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const language = getLanguage(locale);
  return {
    title: translate(language, "Request Vault Allocation"),
    description: translate(
      language,
      "Create a private brief in five steps and connect with the Kavex Labs concierge on WhatsApp.",
    ),
    alternates: {
      canonical: routeFor(language, "vault-allocation"),
      languages: {
        en: "/vault-allocation",
        ar: "/ar/vault-allocation",
        nb: "/no/vault-allocation",
      },
    },
  };
}
export default async function LocalizedVault({ params }: Props) {
  const { locale } = await params;
  if (locale !== "ar" && locale !== "no") notFound();
  return <VaultPage language={getLanguage(locale)} />;
}
