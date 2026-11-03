// Собирает готовый HTML для каждой языковой версии (/, /kz/, /en/),
// чтобы поисковики и ИИ-боты видели текст сайта без выполнения JavaScript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE = "https://www.japyraq.media";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const { render, LANGS, content } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error("root marker not found in dist/index.html");

const escape = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function setMeta(html, attr, key, value) {
  const re = new RegExp(`(<meta\\s+${attr}="${key.replace(".", "\\.")}"\\s+content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta ${key} not found`);
  return html.replace(re, `$1${escape(value)}$2`);
}

const alternates = [
  ...Object.values(LANGS).map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${SITE}${l.path}" />`),
  `<link rel="alternate" hreflang="x-default" href="${SITE}/" />`
].join("\n    ");

for (const [code, lang] of Object.entries(LANGS)) {
  const { meta } = content[code];
  let html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${meta.htmlLang}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE}${lang.path}" />\n    ${alternates}`);
  html = setMeta(html, "name", "description", meta.description);
  html = setMeta(html, "property", "og:url", SITE + lang.path);
  html = setMeta(html, "property", "og:title", meta.ogTitle);
  html = setMeta(html, "property", "og:description", meta.ogDescription);
  html = setMeta(html, "property", "og:locale", meta.locale);
  html = html.replace(marker, `<div id="root">${render(code)}</div>`);

  const outDir = path.join(dist, lang.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`prerendered ${lang.path}`);
}

fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
