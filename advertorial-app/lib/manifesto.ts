import { readFileSync } from "node:fs";
import path from "node:path";

// The supplied Markdown is the copy source. Layout instructions are not rendered.
const source = readFileSync(
  path.join(process.cwd(), "content/03_Advertorial_Copy_and_Layout.md"),
  "utf8",
);
function section(label: string) {
  const marker = `**[${label}]**`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing manifesto section: ${label}`);
  const rest = source.slice(start + marker.length);
  const next = rest.indexOf("**[");
  return (next < 0 ? rest : rest.slice(0, next)).trim();
}

export const manifesto = {
  headline: section("Dynamic Headline"),
  subhead: section("Subhead"),
  body: section("Body").split(/\n\s*\n/),
  wealth: section("The Modern Wealth Protocol")
    .replace(" Smart money doesn't", "\n\nSmart money doesn't")
    .split(/\n\s*\n/),
  guarantees: section("The Kavex Guarantee")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.replace(/^\*\s+/, "")),
  testimonial: section("Social Proof Break")
    .replace(/^>\s*\*/, "")
    .replace(/\*$/, ""),
  pitch: section("The Pitch"),
  cta: "REQUEST VAULT ALLOCATION",
};
