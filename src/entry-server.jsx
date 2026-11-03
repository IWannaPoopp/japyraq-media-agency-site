import React from "react";
import { renderToString } from "react-dom/server";
import App from "./main.jsx";
import { LANGS, content } from "./content.js";

export { LANGS, content };

export function render(lang = "ru") {
  return renderToString(<App lang={lang} />);
}
