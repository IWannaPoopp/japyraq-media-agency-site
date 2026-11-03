// Вставляет готовый HTML страницы в dist/index.html, чтобы поисковики и ИИ-боты
// видели текст сайта без выполнения JavaScript.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "dist", "index.html");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const html = fs.readFileSync(htmlPath, "utf-8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("root marker not found in dist/index.html");

fs.writeFileSync(htmlPath, html.replace(marker, `<div id="root">${render()}</div>`));
fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log("prerendered dist/index.html");
