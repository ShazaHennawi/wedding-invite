import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the closed wedding invitation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Isaac &amp; Shaza — Wedding Invitation<\/title>/i);
  assert.match(html, /Isaac &amp; Shaza/);
  assert.match(html, /Together with our families/);
  assert.match(html, /Elegant embossed bridal portrait artwork/);
  assert.doesNotMatch(html, /class="eyebrow"/);
  assert.match(html, /aria-label="Open the wedding invitation"/);
  assert.match(html, /Tap to open/);
  assert.doesNotMatch(html, /Open in Maps/);
  assert.doesNotMatch(html, /\[Venue Name\]/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps content editable and interaction requirements wired", async () => {
  const [page, config, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/invitation-config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(config, /export const invitationConfig/);
  assert.match(config, /date: "17\.10\.2026"/);
  assert.match(config, /poster: "\/landing-portrait-art\.png"/);
  assert.doesNotMatch(config, /mapUrl:/);
  assert.doesNotMatch(config, /message:/);
  assert.match(config, /arabicCeremony:/);
  assert.match(config, /blessing: "أيُّـــها الربّ إلهُنا بالمجدِ والكرامَة كلّلهُما"/);
  assert.match(config, /groomFamily: "سامر وسوف وعائلته"/);
  assert.match(config, /brideFamily: "سامي حناوي وعائلته"/);
  assert.match(config, /groomName: "اسحق"/);
  assert.match(config, /brideName: "شذى"/);
  assert.match(config, /venue: "كنيسة القديس جاورجيوس"/);
  assert.doesNotMatch(page, /wedding\.address/);
  assert.doesNotMatch(page, /arabic-dress-code/);
  assert.doesNotMatch(page, /personal-message/);
  assert.doesNotMatch(page, /maps-button/);
  assert.doesNotMatch(page, /<header>/);
  assert.doesNotMatch(page, /className="couple-names"/);
  assert.match(page, /useReducedMotion/);
  assert.match(page, /playsInline/);
  assert.match(page, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(page, /disabled=\{opening\}/);
  assert.match(page, /setState\("details"\)/);
  assert.match(page, /dir="rtl"/);
  assert.match(page, /lang="ar"/);
  assert.match(page, /src="\/envelope-whole\.png"/);
  assert.match(page, /src="\/ornate-cross\.png"/);
  assert.match(page, /className="names-cross"/);
  assert.doesNotMatch(page, /className="ceremony-cross"/);
  assert.doesNotMatch(page, /<i aria-hidden="true">&amp;<\/i>/);
  assert.match(css, /\.whole-envelope-image[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.envelope[\s\S]*aspect-ratio:\s*1\.337 \/ 1[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.whole-envelope-art[\s\S]*width:\s*132\.4%/);
  assert.match(css, /Arabic Typesetting/);
  assert.match(css, /ceremony-background\.png/);
  assert.match(css, /aspect-ratio:\s*1890 \/ 2363/);
  assert.match(css, /--paper-texture:/);
  assert.match(css, /\.landing-image[\s\S]*mix-blend-mode:\s*multiply/);
  assert.match(css, /\.names-cross-image[\s\S]*mix-blend-mode:\s*screen/);
  assert.match(css, /background-size:\s*150% 108%/);
  assert.match(css, /background-blend-mode:\s*normal/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /openGraph:/);
  assert.match(packageJson, /"framer-motion"/);
});
