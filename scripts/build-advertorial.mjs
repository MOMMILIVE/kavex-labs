import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.join(root, "advertorial-app");
const dist = path.join(root, "dist");
const digest = (file) =>
  createHash("sha256").update(readFileSync(file)).digest("hex");
const homepageBefore = digest(path.join(root, "index.html"));

execFileSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "build"],
  { cwd: app, stdio: "inherit" },
);
// Only this generated directory is replaced. Original site files are never written.
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
const excluded = new Set([
  ".git",
  ".agents",
  ".codex",
  ".vercel",
  "node_modules",
  "dist",
  "advertorial-app",
  "scripts",
  "tests",
  "test-results",
  "api",
  "components",
]);
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (
    excluded.has(entry.name) ||
    entry.name.startsWith(".") ||
    (!entry.isDirectory() &&
      !/\.(html|css|js|svg|ico|webmanifest|txt|xml)$/.test(entry.name))
  )
    continue;
  cpSync(path.join(root, entry.name), path.join(dist, entry.name), {
    recursive: true,
  });
}

// Export only the new pages and their own bundle; discard Next's generated 404.
for (const route of ["manifesto", "vault-allocation"]) {
  const file = path.join(app, "out", `${route}.html`);
  if (!existsSync(file)) throw new Error(`Missing exported route: ${route}`);
  cpSync(file, path.join(dist, `${route}.html`));
}
mkdirSync(path.join(dist, "advertorial"), { recursive: true });
cpSync(path.join(app, "out/_next"), path.join(dist, "advertorial/_next"), {
  recursive: true,
});
if (
  digest(path.join(root, "index.html")) !== homepageBefore ||
  digest(path.join(dist, "index.html")) !== homepageBefore
)
  throw new Error("Homepage integrity check failed");
console.log(
  "Added /manifesto and /vault-allocation. Homepage SHA-256 unchanged.",
);
