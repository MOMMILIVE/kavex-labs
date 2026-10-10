import { translate, routeFor, type Language } from "../lib/i18n";
import { Header, Footer, Arrow, InlineCopy } from "./Brand";
import { media } from "../lib/media";
import { manifesto as copy } from "../lib/manifesto";

export default function ManifestoPage({
  language = "en",
}: {
  language?: Language;
}) {
  const t = (text: string) => translate(language, text);
  const closingWords = t("Engineered Status.");
  return (
    <>
      <Header language={language} />
      <main id="main">
        <article id="top">
          <div className="article-intro shell">
            <div className="edition-line micro">
              <span>
                <span className="status-dot" /> {t("KAVEX PERSPECTIVES")}
              </span>
              <span>{t("VOL. 01 / THE MANIFESTO")}</span>
            </div>
            <h1>
              {t(copy.headline).replace(closingWords, "")}
              <span>{closingWords}</span>
            </h1>
            <p className="standfirst">{t(copy.subhead)}</p>
            <div className="byline">
              <div>
                <span className="byline-mark" aria-hidden="true">
                  MJ
                </span>
                <div>
                  <span>{t("By: M. Jacob")}</span>
                  <span className="byline-role">{t("Head of Sourcing")}</span>
                </div>
              </div>
              <span className="micro">{t("READ TIME: 3 MIN")}</span>
              <a href="#the-protocol" className="micro">
                {t("READ THE STORY")}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <figure className="hero-figure shell">
            <div className="hero-image">
              <img
                src={media.cad_design.src}
                srcSet={media.cad_design.srcSet}
                sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) calc(100vw - 64px), (max-width: 1280px) calc(100vw - 96px), 1184px"
                decoding="async"
                width={media.cad_design.width}
                height={media.cad_design.height}
                alt={t(
                  "A Kavex engagement ring rendered as a precision CAD blueprint on an atelier monitor",
                )}
                fetchPriority="high"
              />
              <div className="hero-overlay">
                <span className="micro">
                  {t("THE BESPOKE ARCHITECT PROTOCOL")}
                </span>
                <p>
                  {t("Precision.")}
                  <br />
                  {t("Without the theatre.")}
                </p>
                <span className="micro hero-coordinate">
                  {t("DESIGN → SOURCE → ENGINEER")}
                </span>
              </div>
              <span className="image-index micro">
                {t("FIG. 01 / THE ARCHITECTURE")}
              </span>
            </div>
            <figcaption>
              <span>
                {t("From a private vision to a precisely engineered setting.")}
              </span>
              <span className="micro">{t("KAVEX LABS / ATELIER STUDY")}</span>
            </figcaption>
          </figure>
          <div className="reading-layout shell">
            <aside className="article-rail" aria-label={t("Article contents")}>
              <div className="rail-sticky">
                <span className="micro">{t("IN THIS PERSPECTIVE")}</span>
                <nav>
                  <a href="#the-protocol">
                    <span>01</span> {t("The protocol")}
                  </a>
                  <a href="#modern-wealth">
                    <span>02</span> {t("Modern wealth")}
                  </a>
                  <a href="#the-guarantee">
                    <span>03</span> {t("The guarantee")}
                  </a>
                  <a href="#private-access">
                    <span>04</span> {t("Private access")}
                  </a>
                </nav>
                <div className="rail-signature">
                  <img src="/kavex_logo.svg" width="38" height="38" alt="" />
                  <p>
                    {t("Direct access.")}
                    <br />
                    {t("Singular vision.")}
                  </p>
                </div>
              </div>
            </aside>
            <div className="article-body">
              <section id="the-protocol" className="chapter">
                <div className="chapter-label micro">
                  {t("01 / THE PROTOCOL")}
                </div>
                <p className="opening">
                  <InlineCopy text={t(copy.body[0])} />
                </p>
                {copy.body.slice(1).map((paragraph, i) => (
                  <p key={i}>
                    <InlineCopy text={t(paragraph)} />
                  </p>
                ))}
              </section>
              <div className="client-proof">
                <div className="proof-score">
                  4.9<span>/5</span>
                </div>
                <div>
                  <span
                    className="proof-stars"
                    aria-label={t("Rated 4.9 out of 5")}
                  >
                    ★★★★★
                  </span>
                  <p>
                    {t("Rated 4.9/5 by 120+ Private Clients in Scandinavia.")}
                  </p>
                </div>
                <span className="micro">
                  {t("PRIVATE CLIENTS.")}
                  <br />
                  {t("EXCEPTIONAL STANDARDS.")}
                </span>
              </div>
              <section id="modern-wealth" className="chapter">
                <div className="chapter-label micro">
                  {t("02 / THE MODERN WEALTH PROTOCOL")}
                </div>
                <h2>
                  {t("The mathematics")}
                  <br />
                  {t("of true luxury.")}
                </h2>
                {copy.wealth.map((paragraph, i) => (
                  <p key={i}>{t(paragraph)}</p>
                ))}
                <div
                  className="wealth-equation"
                  aria-label={t(
                    "Illustrative wealth comparison from the manifesto",
                  )}
                >
                  <div>
                    <span className="micro">{t("TRADITIONAL RETAIL")}</span>
                    <span className="equation-price old-price">
                      400,000<span>Kr</span>
                    </span>
                  </div>
                  <div>
                    <span className="micro">{t("KAVEX LAB-GROWN")}</span>
                    <span className="equation-price">
                      45,000<span>Kr</span>
                    </span>
                  </div>
                  <div>
                    <span className="micro">{t("THE DIFFERENCE")}</span>
                    <span className="equation-price">
                      355,000<span>Kr</span>
                    </span>
                  </div>
                </div>
              </section>
              <figure className="craft-figure">
                <img
                  src={media.gold_pour.src}
                  srcSet={media.gold_pour.srcSet}
                  sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) calc(100vw - 274px), (max-width: 1142px) calc(100vw - 422px), 720px"
                  decoding="async"
                  alt={t(
                    "Molten gold being poured by a gloved jeweler in a dark workshop",
                  )}
                  width={media.gold_pour.width}
                  height={media.gold_pour.height}
                  loading="lazy"
                />
                <figcaption>
                  <span className="micro">
                    {t("FIG. 02 / FORMED AT THE SOURCE")}
                  </span>
                  <span>{t("Every commission begins with intention.")}</span>
                </figcaption>
              </figure>
              <section id="the-guarantee" className="chapter">
                <div className="chapter-label micro">
                  {t("03 / THE KAVEX GUARANTEE")}
                </div>
                <h2>
                  {t("Nothing hidden.")}
                  <br />
                  {t("Nothing compromised.")}
                </h2>
                <div className="guarantees">
                  {copy.guarantees.map((item, i) => (
                    <div key={item}>
                      <span className="guarantee-index micro">0{i + 1}</span>
                      <p>
                        <InlineCopy text={t(item)} />
                      </p>
                      <span className="guarantee-plus" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  ))}
                </div>
              </section>
              <figure className="testimonial">
                <span className="quote-mark" aria-hidden="true">
                  “
                </span>
                <blockquote>
                  {t(
                    copy.testimonial
                      .split('" - ')[0]
                      .replace(/^"/, "")
                      .replace(/"$/, ""),
                  )}
                </blockquote>
                <figcaption className="micro">
                  HENRIK O. <span>{t(" / PRIVATE CLIENT")}</span>
                </figcaption>
              </figure>
              <section id="private-access" className="chapter closing-chapter">
                <div className="chapter-label micro">
                  {t("04 / PRIVATE ACCESS")}
                </div>
                <h2>
                  {t("She knows what she wants.")}
                  <br />
                  <span>{t("Execute it intelligently.")}</span>
                </h2>
                <p>{t(copy.pitch)}</p>
                <a
                  href={routeFor(language, "vault-allocation")}
                  className="pill allocation-cta"
                >
                  {t(copy.cta)}
                  <Arrow diagonal />
                </a>
                <p className="cta-note micro">
                  {t("FIVE STEPS. ONE PRIVATE CONVERSATION.")}
                </p>
              </section>
            </div>
          </div>
          <div className="article-end shell">
            <span className="micro">{t("END OF PERSPECTIVE / VOL. 01")}</span>
            <img src="/kavex_logo.svg" width="54" height="54" alt="" />
            <span className="micro">KAVEX LABS</span>
          </div>
        </article>
      </main>
      <Footer language={language} />
    </>
  );
}
