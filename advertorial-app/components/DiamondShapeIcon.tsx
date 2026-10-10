// Face-up cut diagrams, drawn as vectors to stay crisp at every display size.
const cuts: Record<string, { outline: string; facets: string }> = {
  Oval: {
    outline: "M50 10C66 10 79 28 79 50S66 90 50 90 21 72 21 50 34 10 50 10Z",
    facets: "M50 10 64 21 76 36 79 50 76 64 64 79 50 90 36 79 24 64 21 50 24 36 36 21Z M50 27 63 34 68 50 63 66 50 73 37 66 32 50 37 34Z M50 10V27 M64 21 63 34 76 36 68 50 79 50 M76 64 63 66 64 79 50 73 50 90 M36 79 37 66 24 64 32 50 21 50 M24 36 37 34 36 21 50 27",
  },
  Round: {
    outline: "M50 12A38 38 0 1 1 50 88A38 38 0 1 1 50 12Z",
    facets: "M50 12 65 15 77 23 85 35 88 50 85 65 77 77 65 85 50 88 35 85 23 77 15 65 12 50 15 35 23 23 35 15Z M40 26H60L74 40V60L60 74H40L26 60V40Z M50 12 40 26 35 15 M65 15 60 26 77 23 74 40 85 35 M88 50 74 40 M88 50 74 60 85 65 M77 77 60 74 65 85 M50 88 60 74 M50 88 40 74 35 85 M23 77 26 60 15 65 M12 50 26 60 M12 50 26 40 15 35 M23 23 40 26",
  },
  Emerald: {
    outline: "M31 10H69L81 22V78L69 90H31L19 78V22Z",
    facets: "M34 18H66L73 25V75L66 82H34L27 75V25Z M37 27H63L64 28V72L63 73H37L36 72V28Z M31 10 34 18 37 27 M69 10 66 18 63 27 M81 22 73 25 64 28 M81 78 73 75 64 72 M69 90 66 82 63 73 M31 90 34 82 37 73 M19 78 27 75 36 72 M19 22 27 25 36 28",
  },
  Radiant: {
    outline: "M31 10H69L81 22V78L69 90H31L19 78V22Z",
    facets: "M38 29H62L68 38V62L62 71H38L32 62V38Z M31 10 38 29 50 10 62 29 69 10 M81 22 62 29 81 42 68 38 81 58 68 62 81 78 62 71 69 90 M50 90 62 71 M50 90 38 71 31 90 M19 78 38 71 19 58 32 62 19 42 32 38 19 22 38 29 M32 38 38 29 M68 62 62 71",
  },
  Pear: {
    outline: "M50 8C44 22 20 41 20 61C20 79 33 92 50 92S80 79 80 61C80 41 56 22 50 8Z",
    facets: "M50 8 35 34 23 49 20 61 27 79 50 92 73 79 80 61 77 49 65 34Z M50 31 63 51 64 67 50 77 36 67 37 51Z M50 8V31 M35 34 37 51 23 49 M20 61 37 51 M20 61 36 67 27 79 50 77 50 92 M73 79 64 67 80 61 63 51 77 49 M65 34 63 51",
  },
};

export default function DiamondShapeIcon({ shape }: { shape: string }) {
  const cut = cuts[shape];
  return (
    <svg
      className="diamond-shape-icon"
      width="44"
      height="56"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {cut ? (
        <>
          <path d={cut.outline} strokeWidth="1.8" />
          <path d={cut.facets} strokeWidth="1.2" opacity=".65" />
        </>
      ) : (
        <>
          <circle cx="50" cy="50" r="33" strokeWidth="1.5" opacity=".65" />
          <path d="M50 24 57 43 76 50 57 57 50 76 43 57 24 50 43 43Z" strokeWidth="1.8" />
          <path d="M50 12V17M88 50H83M50 88V83M12 50H17" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}
