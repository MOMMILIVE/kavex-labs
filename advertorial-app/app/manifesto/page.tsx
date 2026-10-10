import type { Metadata } from "next";
import { Header, Footer, Arrow, InlineCopy } from "../../components/Brand";
import { manifesto as copy } from "../../lib/manifesto";

export const metadata: Metadata = {
  title: "Engineered Status · The Manifesto",
  alternates: { canonical: "/manifesto" },
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
  const closingWords = "Engineered Status.";
  return (
    <>
      <Header />
      <main id="main">
        <article id="top">
          <div className="article-intro shell">
            <div className="edition-line micro">
              <span>
                <span className="status-dot" /> KAVEX PERSPECTIVES
              </span>
              <span>VOL. 01 &nbsp; / &nbsp; THE MANIFESTO</span>
            </div>
            <h1>
              {copy.headline.replace(closingWords, "")}
              <span>{closingWords}</span>
            </h1>
            <p className="standfirst">{copy.subhead}</p>
            <div className="byline">
              <div>
                <span className="byline-mark" aria-hidden="true">
                  MJ
                </span>
                <div>
                  <span>By: M. Jacob</span>
                  <span className="byline-role">Head of Sourcing</span>
                </div>
              </div>
              <span className="micro">READ TIME: 3 MIN</span>
              <a href="#the-protocol" className="micro">
                READ THE STORY <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <figure className="hero-figure shell">
            <div className="hero-image">
              <img
                src="/assets/cad_design.webp"
                width="1024"
                height="1024"
                alt="A Kavex engagement ring rendered as a precision CAD blueprint on an atelier monitor"
                fetchPriority="high"
              />
              <div className="hero-overlay">
                <span className="micro">THE BESPOKE ARCHITECT PROTOCOL</span>
                <p>
                  Precision.
                  <br />
                  Without the theatre.
                </p>
                <span className="micro hero-coordinate">
                  DESIGN → SOURCE → ENGINEER
                </span>
              </div>
              <span className="image-index micro">
                FIG. 01 / THE ARCHITECTURE
              </span>
            </div>
            <figcaption>
              <span>
                From a private vision to a precisely engineered setting.
              </span>
              <span className="micro">KAVEX LABS / ATELIER STUDY</span>
            </figcaption>
          </figure>
          <div className="reading-layout shell">
            <aside className="article-rail" aria-label="Article contents">
              <div className="rail-sticky">
                <span className="micro">IN THIS PERSPECTIVE</span>
                <nav>
                  <a href="#the-protocol">
                    <span>01</span> The protocol
                  </a>
                  <a href="#modern-wealth">
                    <span>02</span> Modern wealth
                  </a>
                  <a href="#the-guarantee">
                    <span>03</span> The guarantee
                  </a>
                  <a href="#private-access">
                    <span>04</span> Private access
                  </a>
                </nav>
                <div className="rail-signature">
                  <img src="/kavex_logo.svg" width="38" height="38" alt="" />
                  <p>
                    Direct access.
                    <br />
                    Singular vision.
                  </p>
                </div>
              </div>
            </aside>
            <div className="article-body">
              <section id="the-protocol" className="chapter">
                <div className="chapter-label micro">01 / THE PROTOCOL</div>
                <p className="opening">
                  <InlineCopy text={copy.body[0]} />
                </p>
                {copy.body.slice(1).map((paragraph, i) => (
                  <p key={i}>
                    <InlineCopy text={paragraph} />
                  </p>
                ))}
              </section>
              <div className="client-proof">
                <div className="proof-score">
                  4.9<span>/5</span>
                </div>
                <div>
                  <span className="proof-stars" aria-label="Rated 4.9 out of 5">
                    ★★★★★
                  </span>
                  <p>Rated 4.9/5 by 120+ Private Clients in Europe.</p>
                </div>
                <span className="micro">
                  PRIVATE CLIENTS.
                  <br />
                  EXCEPTIONAL STANDARDS.
                </span>
              </div>
              <section id="modern-wealth" className="chapter">
                <div className="chapter-label micro">
                  02 / THE MODERN WEALTH PROTOCOL
                </div>
                <h2>
                  The mathematics
                  <br />
                  of true luxury.
                </h2>
                {copy.wealth.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                <div
                  className="wealth-equation"
                  aria-label="Illustrative wealth comparison from the manifesto"
                >
                  <div>
                    <span className="micro">TRADITIONAL RETAIL</span>
                    <span className="equation-price old-price">
                      100,000<span>NOK</span>
                    </span>
                  </div>
                  <div>
                    <span className="micro">KAVEX LAB-GROWN</span>
                    <span className="equation-price">
                      45,000<span>NOK</span>
                    </span>
                  </div>
                  <div>
                    <span className="micro">THE DIFFERENCE</span>
                    <span className="equation-price">
                      55,000<span>NOK</span>
                    </span>
                  </div>
                </div>
              </section>
              <figure className="craft-figure">
                <img
                  src="/assets/gold_pour.webp"
                  alt="Molten gold being poured by a gloved jeweler in a dark workshop"
                  width="1024"
                  height="1024"
                  loading="lazy"
                />
                <figcaption>
                  <span className="micro">FIG. 02 / FORMED AT THE SOURCE</span>
                  <span>Every commission begins with intention.</span>
                </figcaption>
              </figure>
              <section id="the-guarantee" className="chapter">
                <div className="chapter-label micro">
                  03 / THE KAVEX GUARANTEE
                </div>
                <h2>
                  Nothing hidden.
                  <br />
                  Nothing compromised.
                </h2>
                <div className="guarantees">
                  {copy.guarantees.map((item, i) => (
                    <div key={item}>
                      <span className="guarantee-index micro">0{i + 1}</span>
                      <p>
                        <InlineCopy text={item} />
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
                  {copy.testimonial
                    .split('" - ')[0]
                    .replace(/^"/, "")
                    .replace(/"$/, "")}
                </blockquote>
                <figcaption className="micro">
                  HENRIK O. <span> / PRIVATE CLIENT</span>
                </figcaption>
              </figure>
              <section id="private-access" className="chapter closing-chapter">
                <div className="chapter-label micro">04 / PRIVATE ACCESS</div>
                <h2>
                  She knows what she wants.
                  <br />
                  <span>Execute it intelligently.</span>
                </h2>
                <p>{copy.pitch}</p>
                <a href="/vault-allocation" className="pill allocation-cta">
                  {copy.cta}
                  <Arrow diagonal />
                </a>
                <p className="cta-note micro">
                  FIVE STEPS. ONE PRIVATE CONVERSATION.
                </p>
              </section>
            </div>
          </div>
          <div className="article-end shell">
            <span className="micro">END OF PERSPECTIVE / VOL. 01</span>
            <img src="/kavex_logo.svg" width="54" height="54" alt="" />
            <span className="micro">KAVEX LABS</span>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
