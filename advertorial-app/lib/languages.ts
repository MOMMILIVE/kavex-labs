export type Language = "en" | "ar" | "no";
export const languages: Language[] = ["en", "ar", "no"];
export function getLanguage(value?: string): Language {
  return value === "ar" || value === "no" ? value : "en";
}
export function routeFor(
  language: Language,
  page: "manifesto" | "vault-allocation",
) {
  return `${language === "en" ? "" : `/${language}`}/${page}`;
}
