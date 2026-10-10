import { languages, routeFor, translate, type Language } from "../lib/i18n";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Header({
  language = "en",
  page = "manifesto",
}: {
  language?: Language;
  page?: "manifesto" | "vault-allocation";
}) {
  const t = (text: string) => translate(language, text);
  return (
    <>
      <header className="masthead" dir="ltr">
        <a href="/" className="brand" aria-label={t("Kavex Labs home")}>
          <img src="/kavex_logo.svg" width="36" height="36" alt="" />
          <span>
            KAVEX <span className="brand-light">LABS</span>
          </span>
        </a>
        <span className="masthead-edition micro">
          {t("THE SOURCING JOURNAL")}
        </span>
        <div className="masthead-actions">
          <a
            className="pill pill-small"
            href={routeFor(language, "vault-allocation")}
          >
            {t("Request access")} <Arrow diagonal />
          </a>
          <nav
            className="language-switcher micro"
            aria-label={
              language === "ar"
                ? "اللغة"
                : language === "no"
                  ? "Språk"
                  : "Language"
            }
            dir="ltr"
          >
            {languages.map((item) => (
              <a
                key={item}
                href={routeFor(item, page)}
                hrefLang={item === "no" ? "nb" : item}
                lang={item === "no" ? "nb" : item}
                aria-label={
                  item === "en"
                    ? "English"
                    : item === "ar"
                      ? "العربية"
                      : "Norsk"
                }
                aria-current={language === item ? "true" : undefined}
              >
                <span className="language-flag" aria-hidden="true">
                  {item === "en" ? "🇬🇧" : item === "ar" ? "🇸🇦" : "🇳🇴"}
                </span>
                <span>{item.toUpperCase()}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>
      <p className="market-note">
        <span>{t("🌐 MARKET UPDATE: Global gold and raw diamond commodities fluctuate daily. Secure your allocation today to lock in current direct-forge pricing.")}</span>
      </p>
    </>
  );
}

export function Footer({ language = "en" }: { language?: Language }) {
  const t = (text: string) => translate(language, text);
  return (
    <footer className="footer">
      <a href="/" className="brand" aria-label={t("Kavex Labs home")}>
        <img src="/kavex_logo.svg" width="28" height="28" alt="" />
        <span>KAVEX LABS</span>
      </a>
      <span className="micro">{t("ENGINEERED DIRECTLY AT THE SOURCE.")}</span>
      <a href="/privacy">{t("Privacy")}</a>
      <a href={`${routeFor(language, "manifesto")}#top`} className="back-top">
        {t("Back to top ↑")}
      </a>
    </footer>
  );
}

export function InlineCopy({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\*\*.*?\*\*)/g)
        .map((part, index) =>
          part.startsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
    </>
  );
}
