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
  assert.match(html, /Isaac and Shaza together/);
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
  assert.match(config, /poster: "\/landing-couple-frame\.png"/);
  assert.match(config, /youtubeVideoId: "6W3-rHzCqkY"/);
  assert.doesNotMatch(config, /mapUrl:/);
  assert.doesNotMatch(config, /message:/);
  assert.match(config, /arabicCeremony:/);
  assert.match(config, /blessing: "إِذًا لَيْسَا بَعْدُ اثْنَيْنِ بَلْ جَسَدٌ وَاحِدٌ\. فَالَّذِي جَمَعَهُ اللهُ لَا يُفَرِّقُهُ إِنْسَانٌ"/);
  assert.match(config, /groomFamily: "السيد سامر وسوف وعائلته"/);
  assert.match(config, /brideFamily: "السيد سامي حناوي وعائلته"/);
  assert.match(config, /groomName: "اسحق"/);
  assert.match(config, /brideName: "شذى"/);
  assert.match(config, /venue: "كنيسة القديس جاورجيوس"/);
  assert.match(config, /timelineHeading: "برنامج الزفاف"/);
  assert.match(config, /src: "\/landing-couple-frame\.png"/);
  assert.match(config, /poster: "\/landing-couple-frame\.png"/);
  assert.match(config, /english: "Ceremony"/);
  assert.match(config, /english: "Photos"/);
  assert.match(config, /english: "Lunch"/);
  assert.doesNotMatch(config, /icon: "car"|english: "Car"|السيارة/);
  assert.doesNotMatch(config, /locationHeading:/);
  assert.doesNotMatch(config, /حضوركم هو الهدية الأجمل بالنسبة لنا/);
  assert.doesNotMatch(page, /wedding\.address/);
  assert.doesNotMatch(page, /arabic-dress-code/);
  assert.doesNotMatch(page, /personal-message/);
  assert.doesNotMatch(page, /maps-button/);
  assert.doesNotMatch(page, /location-card|location-heading/);
  assert.match(page, /className="supporting-card timeline-card/);
  assert.match(page, /className="wedding-timeline"/);
  assert.match(page, /className="timeline-copy"/);
  assert.match(page, /className="timeline-node"/);
  assert.match(page, /className="timeline-step-content"/);
  assert.match(page, /useScroll/);
  assert.match(page, /useTransform/);
  assert.match(page, /className="timeline-progress"/);
  assert.match(page, /function TimelineStep/);
  assert.match(page, /offset: \["start 85%", "end 15%"\]/);
  assert.match(page, /index \* 0\.15/);
  assert.match(page, /\[0, 0\.78\], \[0, 1\]/);
  assert.match(page, /stiffness: 240/);
  assert.match(page, /\[0\.58, 1\.18, 1\]/);
  assert.match(page, /`timeline-icon timeline-icon-\$\{item\.icon\}`/);
  assert.doesNotMatch(page, /timeline-kicker/);
  assert.match(page, /<strong>\{arabic\.dateNumber\}<\/strong>/);
  assert.match(page, /<strong>\{arabic\.year\}<\/strong>/);
  assert.doesNotMatch(page, /<header>/);
  assert.doesNotMatch(page, /className="couple-names"/);
  assert.match(page, /useReducedMotion/);
  assert.match(page, /playsInline/);
  assert.match(page, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(page, /disabled=\{opening\}/);
  assert.match(page, /setState\("details"\)/);
  assert.match(page, /dir="rtl"/);
  assert.match(page, /lang="ar"/);
  assert.match(page, /className="blessing-arc-word"/);
  assert.doesNotMatch(page, /className="framed-portrait"/);
  assert.doesNotMatch(page, /className="portrait-window"/);
  assert.doesNotMatch(page, /className="portrait-photo"/);
  assert.match(page, /src="\/envelope-whole\.png"/);
  assert.match(page, /src="\/bible-cross-cutout\.png"/);
  assert.match(page, /className="blessing-cross"/);
  assert.match(page, /className="names-amp"/);
  assert.doesNotMatch(page, /className="names-cross"/);
  assert.doesNotMatch(page, /className="ceremony-cross"/);
  assert.doesNotMatch(page, /<i aria-hidden="true">&amp;<\/i>/);
  assert.match(css, /\.whole-envelope-image[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.envelope[\s\S]*aspect-ratio:\s*1\.337 \/ 1[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.whole-envelope-art[\s\S]*width:\s*132\.4%/);
  assert.doesNotMatch(page, /className="envelope-card"/);
  assert.doesNotMatch(page, /card-monogram|card-date/);
  assert.match(page, /className="envelope-opening-seam"/);
  assert.match(css, /\.envelope-opening-seam[\s\S]*linear-gradient/);
  assert.match(page, /function CeremonyMusic/);
  assert.match(page, /youtube-nocookie\.com\/embed/);
  assert.match(page, /autoplay=1/);
  assert.match(page, /enablejsapi=1/);
  assert.match(page, /func: "setVolume"/);
  assert.match(config, /volume: 22/);
  assert.match(css, /\.ceremony-music[\s\S]*opacity:\s*0/);
  assert.match(css, /Arabic Typesetting/);
  assert.match(css, /\.blessing-arc-word:nth-child\(1\)[\s\S]*translateY\(\.92em\) rotate\(13deg\)/);
  assert.match(css, /\.blessing-arc-word:nth-child\(13\)[\s\S]*translateY\(\.92em\) rotate\(-13deg\)/);
  assert.match(css, /ceremony-background\.png/);
  assert.match(css, /aspect-ratio:\s*1890 \/ 2363/);
  assert.match(css, /--paper-texture:/);
  assert.match(css, /\.landing-image[\s\S]*object-fit:\s*contain[\s\S]*mix-blend-mode:\s*normal/);
  assert.match(css, /\.blessing-cross[\s\S]*width:\s*clamp\(1\.45rem, 6vw, 2\.15rem\)/);
  assert.match(css, /\.blessing-cross-image[\s\S]*opacity:\s*\.9/);
  assert.match(css, /background-size:\s*100% 100%/);
  assert.match(css, /background-blend-mode:\s*normal/);
  assert.match(css, /\.supporting-card[\s\S]*box-shadow:/);
  assert.match(css, /\.timeline-card[\s\S]*min-height:\s*180svh[\s\S]*background:\s*transparent/);
  assert.match(css, /\.timeline-card-content[\s\S]*position:\s*sticky[\s\S]*min-height:\s*100svh/);
  assert.match(css, /\.wedding-timeline::before[\s\S]*bottom:\s*1\.575rem[\s\S]*width:\s*1px/);
  assert.match(css, /\.timeline-progress[\s\S]*width:\s*2px[\s\S]*transform-origin:\s*50% 0%/);
  assert.match(css, /\.wedding-timeline li[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) 1px minmax\(0, 1fr\)/);
  assert.match(css, /\.timeline-step-content[\s\S]*display:\s*flex/);
  assert.match(css, /li:nth-child\(odd\) \.timeline-step-content[\s\S]*grid-column:\s*1/);
  assert.match(css, /li:nth-child\(even\) \.timeline-step-content[\s\S]*grid-column:\s*3/);
  assert.match(css, /\.timeline-icon[\s\S]*wedding-timeline-icons-transparent\.png/);
  assert.match(css, /\.timeline-icon[\s\S]*width:\s*5\.15rem[\s\S]*height:\s*4\.4rem/);
  assert.match(css, /\.timeline-icon-church[\s\S]*background-position:\s*0 100%/);
  assert.match(css, /\.timeline-icon-camera[\s\S]*background-position:\s*100% 0/);
  assert.match(css, /\.timeline-icon-table[\s\S]*background-position:\s*0 0/);
  assert.doesNotMatch(css, /\.timeline-icon-car/);
  assert.match(css, /\.arabic-families[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /\.ceremony-summary strong[\s\S]*font-weight:\s*700/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /openGraph:/);
  assert.match(packageJson, /"framer-motion"/);
});
