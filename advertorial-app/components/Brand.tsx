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

export function Header() {
  return (
    <header className="masthead">
      <a href="/" className="brand" aria-label="Kavex Labs home">
        <img src="/kavex_logo.svg" width="36" height="36" alt="" />
        <span>
          KAVEX <span className="brand-light">LABS</span>
        </span>
      </a>
      <span className="masthead-edition micro">THE SOURCING JOURNAL</span>
      <a className="pill pill-small" href="/vault-allocation">
        Request access <Arrow diagonal />
      </a>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <a href="/" className="brand" aria-label="Kavex Labs home">
        <img src="/kavex_logo.svg" width="28" height="28" alt="" />
        <span>KAVEX LABS</span>
      </a>
      <span className="micro">ENGINEERED DIRECTLY AT THE SOURCE.</span>
      <a href="/privacy">Privacy</a>
      <a href="/manifesto#top" className="back-top">
        Back to top ↑
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
