import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /We(?:&#x27;|')re Getting Married/);
  assert.match(html, /You’re Invited/);
  assert.match(html, /Isaac and Shaza together/);
  assert.doesNotMatch(html, /class="eyebrow"/);
  assert.match(html, /aria-label="Open the wedding invitation"/);
  assert.match(html, /Tap to open/);
  assert.doesNotMatch(html, /Open in Maps/);
  assert.doesNotMatch(html, /\[Venue Name\]/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the bank details route", async () => {
  const response = await render("/bank-details");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /BANK DETAILS/);
  assert.match(html, /Isaac Wassouf/);
});

test("server-renders the invitation-only route", async () => {
  const response = await render("/invitation-only");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /aria-label="Open the wedding invitation"/);
  assert.match(html, /Isaac &amp; Shaza/);
});

test("server-renders the ceremony-gifts route", async () => {
  const response = await render("/ceremony-gifts");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /aria-label="Open the wedding invitation"/);
  assert.match(html, /Isaac &amp; Shaza/);
});

test("server-renders the renamed ceremony routes", async () => {
  for (const path of ["/ceremony-invitation", "/ceremony.syria"]) {
    const response = await render(path);
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.match(html, /aria-label="Open the wedding invitation"/);
    assert.match(html, /Isaac &amp; Shaza/);
  }
});

test("keeps content editable and interaction requirements wired", async () => {
  const [page, invitationOnlyPage, ceremonyInvitationPage, ceremonyGiftsPage, bankPage, config, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/invitation-only/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ceremony-invitation/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ceremony-gifts/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bank-details/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/invitation-config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(config, /export const invitationConfig/);
  assert.match(invitationOnlyPage, /showProgram=\{false\}/);
  assert.match(invitationOnlyPage, /showRsvp/);
  assert.match(invitationOnlyPage, /rsvpBeforeGift/);
  assert.doesNotMatch(invitationOnlyPage, /showRsvp=\{false\}/);
  assert.match(ceremonyInvitationPage, /showGifts=\{false\}/);
  assert.match(ceremonyGiftsPage, /showProgram=\{false\}/);
  assert.match(ceremonyGiftsPage, /showRsvp=\{false\}/);
  assert.match(page, /showProgram = true/);
  assert.match(page, /showGifts = true/);
  assert.match(page, /showRsvp = true/);
  assert.match(page, /rsvpBeforeGift = false/);
  assert.match(page, /showRsvp && rsvpBeforeGift \? <RsvpCard/);
  assert.match(page, /showRsvp && !rsvpBeforeGift \? <RsvpCard/);
  assert.match(page, /showGifts \? \(/);
  assert.match(config, /date: "17\.10\.2026"/);
  assert.match(config, /poster: "\/landing-couple-frame-new\.png"/);
  assert.match(config, /src: "\/wedding-song\.mp3"/);
  assert.match(config, /startTime: 170/);
  assert.match(config, /endTime: 194/);
  assert.doesNotMatch(config, /youtubeVideoId/);
  assert.doesNotMatch(config, /mapUrl:/);
  assert.match(config, /arabicCeremony:/);
  assert.match(config, /englishCeremony:/);
  assert.match(config, /So they are no longer two, but one flesh/);
  assert.match(config, /timelineHeading: "Wedding Program"/);
  assert.match(config, /button: "CONFIRM ATTENDANCE"/);
  assert.match(config, /blessing: "إِذًا لَيْسَا بَعْدُ اثْنَيْنِ بَلْ جَسَدٌ وَاحِدٌ\. فَالَّذِي جَمَعَهُ اللهُ لَا يُفَرِّقُهُ إِنْسَانٌ"/);
  assert.match(config, /groomFamily: "السيد سامر وسوف وعائلته"/);
  assert.match(config, /brideFamily: "السيد سامي حناوي وعائلته"/);
  assert.match(config, /groomFamily: "Mr\. Samer Wassouf and his family"/);
  assert.match(config, /brideFamily: "Mr\. Sami Hennawi and his family"/);
  assert.match(config, /groomName: "اسحق"/);
  assert.match(config, /brideName: "شذى"/);
  assert.match(config, /venue: "كنيسة القديس جاورجيوس"/);
  assert.match(config, /venue: "في كنيسة القديس جاورجيوس في برلين"/);
  assert.match(config, /venue: "Saint George Church in Berlin"/);
  assert.match(config, /timelineHeading: "برنامج الزفاف"/);
  assert.match(config, /src: "\/landing-couple-frame-new\.png"/);
  assert.match(config, /poster: "\/landing-couple-frame-new\.png"/);
  assert.match(config, /english: "Ceremony"/);
  assert.match(config, /english: "Photos"/);
  assert.match(config, /english: "Lunch"/);
  assert.match(page, /key="landing"[\s\S]*initial=\{false\}[\s\S]*animate=\{\{ opacity: 1 \}\}/);
  assert.doesNotMatch(config, /icon: "car"|english: "Car"|السيارة/);
  assert.doesNotMatch(config, /locationHeading:/);
  assert.doesNotMatch(page, /wedding\.address/);
  assert.doesNotMatch(page, /arabic-dress-code/);
  assert.doesNotMatch(page, /personal-message/);
  assert.doesNotMatch(page, /maps-button/);
  assert.doesNotMatch(page, /location-card|location-heading/);
  assert.match(page, /supporting-card timeline-card w-full text-center/);
  assert.match(page, /src=\{assetPath\("\/wedding-program-ornament-transparent\.png"\)\}/);
  assert.match(page, /className="timeline-ornament-image"/);
  assert.match(page, /className="wedding-timeline"/);
  assert.match(page, /className="timeline-copy"/);
  assert.match(page, /className="timeline-node"/);
  assert.match(page, /className="timeline-step-content"/);
  assert.match(page, /useScroll/);
  assert.match(page, /useTransform/);
  assert.match(page, /className="timeline-progress"/);
  assert.match(page, /function TimelineStep/);
  assert.match(page, /offset: \["start 100%", "end 100%"\]/);
  assert.match(page, /index \* 0\.36/);
  assert.match(page, /\[0, 0\.58\], \[0, 1\]/);
  assert.match(page, /stiffness: 360/);
  assert.match(page, /\[0\.58, 1\.18, 1\]/);
  assert.match(page, /`timeline-icon timeline-icon-\$\{item\.icon\}`/);
  assert.doesNotMatch(page, /timeline-kicker/);
  assert.match(page, /className="supporting-card gift-card gift-card-cover/);
  assert.match(css, /\.timeline-card \+ \.gift-card-cover[\s\S]*margin-top:\s*-\.35rem/);
  assert.match(page, /src=\{assetPath\("\/gift-cover-card-arabic-details\.png"\)\}/);
  assert.match(page, /aria-label="التفاصيل"/);
  assert.match(page, /className="gift-cover-button"/);
  assert.match(page, /const BANK_DETAILS_HREF = process\.env\.NEXT_PUBLIC_BASE_PATH[\s\S]*\/bank-details\.html[\s\S]*"\/bank-details"/);
  assert.equal((page.match(/href=\{BANK_DETAILS_HREF\}/g) ?? []).length, 2);
  assert.doesNotMatch(page, /className="gift-cover-message"/);
  assert.doesNotMatch(page, /giftOpen|setGiftOpen|gift-details-message/);
  assert.doesNotMatch(page, /className="gift-message"/);
  assert.match(page, /className="supporting-card rsvp-card/);
  assert.match(page, /src=\{assetPath\("\/rsvp-confirm-attendance-final\.png"\)\}/);
  assert.match(page, /className="rsvp-card-button"/);
  assert.match(page, /docs\.google\.com\/forms\/d\/e\/1FAIpQLSe2EGqsYW_jGXh6ofT957yQLLdh44orRyo9310oWnLksTYVWg\/viewform\?usp=dialog/);
  assert.match(config, /حضوركم هو الهدية الأجمل بالنسبة لنا/);
  assert.match(config, /DE53 1805 0000 1190 7117 25/);
  assert.match(config, /WELADED1CBN/);
  assert.match(config, /DE11 1005 0000 1071 4190 79/);
  assert.match(config, /BELADEBEXXX/);
  assert.match(bankPage, /BANK DETAILS/);
  assert.match(bankPage, /navigator\.clipboard\.writeText/);
  assert.match(bankPage, /className="bank-copy-button"/);
  assert.match(bankPage, /window\.history\.back\(\)/);
  assert.match(css, /\.bank-detail-row strong[\s\S]*font-family:\s*"Avenir Next"[\s\S]*font-variant-numeric:\s*lining-nums tabular-nums/);
  assert.match(page, /<strong>\{arabic\.dateNumber\}<\/strong>/);
  assert.match(page, /<strong>\{arabic\.year\}<\/strong>/);
  assert.doesNotMatch(page, /<header>/);
  assert.doesNotMatch(page, /className="couple-names"/);
  assert.match(page, /useReducedMotion/);
  assert.match(page, /playsInline/);
  assert.match(page, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(page, /setState\("details"\)/);
  assert.match(page, /resetDetailsScrollRef\.current = true/);
  assert.match(page, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.doesNotMatch(page, /setState\("opening"\)|Opening…|aria-busy|disabled=\{opening\}/);
  assert.match(page, /type InvitationLanguage = "ar" \| "en"/);
  assert.match(page, /language === "en" \? "ltr" : "rtl"/);
  assert.match(page, /className="language-toggle"/);
  assert.match(page, /className="details-back-button"/);
  assert.match(page, /className="details-scroll-hint"/);
  assert.match(page, /window\.scrollY < 64/);
  assert.match(page, /\.details-shell \.supporting-card/);
  assert.match(page, /scrollIntoView/);
  assert.match(page, /onClick=\{returnToCover\}/);
  assert.match(page, /setState\("closed"\)/);
  assert.match(page, /Translate invitation to English/);
  assert.match(page, /translated-gift-card/);
  assert.match(page, /translated-rsvp-card/);
  assert.match(page, /window\.sessionStorage\.setItem\(LANGUAGE_KEY, next\)/);
  assert.match(page, /new URLSearchParams\(window\.location\.search\)\.get\("lang"\)/);
  assert.match(page, /language === "ar" \|\| language === "en"/);
  assert.match(page, /window\.sessionStorage\.setItem\(LANGUAGE_KEY, queryLanguage\)/);
  assert.match(page, /url\.searchParams\.set\("lang", language\)/);
  assert.match(page, /window\.history\.replaceState/);
  assert.match(page, /window\.addEventListener\("popstate", syncLanguageFromUrl\)/);
  assert.match(page, /className="blessing-arc-word"/);
  assert.doesNotMatch(page, /className="framed-portrait"/);
  assert.doesNotMatch(page, /className="portrait-window"/);
  assert.doesNotMatch(page, /className="portrait-photo"/);
  assert.match(page, /src=\{assetPath\("\/envelope-whole\.png"\)\}/);
  assert.match(page, /src=\{assetPath\("\/bible-cross-cutout\.png"\)\}/);
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
  assert.doesNotMatch(page, /envelope-opening-seam|opening-wash/);
  assert.doesNotMatch(css, /\.envelope-opening-seam|\.opening-wash/);
  assert.match(page, /function CeremonyMusic/);
  assert.match(page, /useRef<HTMLAudioElement>/);
  assert.match(page, /<audio/);
  assert.match(page, /assetPath\(invitation\.music\.src\)/);
  assert.match(page, /player\.currentTime = invitation\.music\.startTime/);
  assert.match(page, /player\.currentTime = invitation\.music\.endTime/);
  assert.match(page, /onTimeUpdate=\{stopAtEnd\}/);
  assert.doesNotMatch(page, /youtube-nocookie|enablejsapi|sendCommand/);
  assert.match(config, /volume: 17/);
  assert.match(css, /\.ceremony-music[\s\S]*opacity:\s*0/);
  assert.match(css, /Arabic Typesetting/);
  assert.match(css, /\.blessing-arc-word:nth-child\(1\)[\s\S]*translateY\(\.92em\) rotate\(13deg\)/);
  assert.match(css, /\.blessing-arc-word:nth-child\(13\)[\s\S]*translateY\(\.92em\) rotate\(-13deg\)/);
  assert.match(css, /var\(--ceremony-background-image\)/);
  assert.match(layout, /ceremony-background-ornate\.png/);
  assert.match(css, /aspect-ratio:\s*1620 \/ 2025/);
  assert.match(css, /--paper-texture:/);
  assert.match(css, /\.landing-image[\s\S]*object-fit:\s*contain[\s\S]*mix-blend-mode:\s*darken/);
  assert.match(css, /\.blessing-cross[\s\S]*width:\s*clamp\(1\.45rem, 6vw, 2\.15rem\)/);
  assert.match(css, /\.blessing-cross-image[\s\S]*opacity:\s*\.9/);
  assert.match(css, /background-size:\s*100% 100%/);
  assert.match(css, /background-blend-mode:\s*normal/);
  assert.match(css, /\.supporting-card[\s\S]*box-shadow:/);
  assert.match(css, /\.timeline-card[\s\S]*min-height:\s*100svh[\s\S]*background:\s*transparent/);
  assert.match(css, /\.timeline-card-content[\s\S]*position:\s*sticky[\s\S]*min-height:\s*100svh/);
  assert.match(css, /\.timeline-ornament[\s\S]*aspect-ratio:\s*3 \/ 1/);
  assert.match(css, /\.timeline-ornament-image[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.wedding-timeline::before[\s\S]*bottom:\s*1\.575rem[\s\S]*width:\s*2px/);
  assert.match(css, /\.timeline-progress[\s\S]*width:\s*3px[\s\S]*transform-origin:\s*50% 0%/);
  assert.match(css, /\.wedding-timeline li[\s\S]*grid-template-columns:\s*minmax\(0, 1fr\) 1px minmax\(0, 1fr\)/);
  assert.match(css, /\.timeline-step-content[\s\S]*display:\s*flex/);
  assert.match(css, /li:nth-child\(odd\) \.timeline-step-content[\s\S]*grid-column:\s*1/);
  assert.match(css, /li:nth-child\(even\) \.timeline-step-content[\s\S]*grid-column:\s*3/);
  assert.match(css, /\.timeline-icon[\s\S]*var\(--timeline-icons-image\)/);
  assert.match(layout, /wedding-timeline-icons-transparent\.png/);
  assert.match(css, /\.timeline-icon[\s\S]*width:\s*6\.2rem[\s\S]*height:\s*5\.3rem/);
  assert.match(css, /\.timeline-icon-church[\s\S]*background-position:\s*0 100%/);
  assert.match(css, /\.timeline-icon-camera[\s\S]*background-position:\s*100% 0/);
  assert.match(css, /\.timeline-icon-table[\s\S]*background-position:\s*0 0/);
  assert.doesNotMatch(css, /\.timeline-icon-car/);
  assert.match(css, /\.gift-card[\s\S]*background-image:[\s\S]*var\(--paper-texture\)/);
  assert.match(css, /\.gift-card-cover[\s\S]*aspect-ratio:\s*1/);
  assert.match(css, /\.gift-cover-image[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.bank-details-shell[\s\S]*min-height:\s*100svh/);
  assert.match(css, /\.bank-copy-button[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.rsvp-card[\s\S]*aspect-ratio:\s*3 \/ 2/);
  assert.match(css, /\.rsvp-card-image[\s\S]*object-fit:\s*contain/);
  assert.match(css, /\.rsvp-card-button[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.language-toggle[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.details-back-button[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.details-scroll-hint[\s\S]*animation:\s*details-scroll-hint-bob/);
  assert.match(css, /\.english-invitation[\s\S]*font-family:\s*"Avenir Next"/);
  assert.match(css, /\.english-blessing[\s\S]*font-size:\s*clamp\(\.58rem, 2\.35vw, \.74rem\)/);
  assert.match(css, /@font-face[\s\S]*font-family:\s*"Niconne"[\s\S]*Niconne-Regular\.ttf/);
  assert.match(css, /\.english-invitation \.arabic-couple-names[\s\S]*font-family:\s*"Niconne"/);
  assert.match(css, /\.english-timeline \.timeline-step-content[\s\S]*gap:\s*0/);
  assert.match(css, /\.english-timeline \.wedding-timeline li:nth-of-type\(1\) \.timeline-copy,[\s\S]*li:nth-of-type\(3\) \.timeline-copy[\s\S]*margin-left:\s*\.65rem/);
  assert.match(css, /\.english-timeline \.wedding-timeline li:nth-of-type\(2\) \.timeline-copy[\s\S]*margin-left:\s*-\.8rem/);
  assert.match(css, /@media \(max-width:\s*480px\)[\s\S]*\.english-timeline \.timeline-step-content[\s\S]*gap:\s*\.4rem/);
  assert.match(css, /@media \(max-width:\s*480px\)[\s\S]*\.english-timeline \.timeline-icon[\s\S]*width:\s*4\.85rem[\s\S]*height:\s*4\.15rem/);
  assert.match(css, /@media \(max-width:\s*480px\)[\s\S]*\.english-timeline \.wedding-timeline li:nth-of-type\(1\) \.timeline-copy,[\s\S]*li:nth-of-type\(3\) \.timeline-copy[\s\S]*margin-left:\s*0/);
  assert.match(css, /@media \(max-width:\s*480px\)[\s\S]*\.timeline-card\[lang="ar"\][\s\S]*li:nth-of-type\(2\) \.timeline-step-content[\s\S]*gap:\s*\.15rem/);
  assert.match(css, /\.translated-card-button[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.arabic-families[\s\S]*white-space:\s*nowrap/);
  assert.match(css, /\.ceremony-summary strong[\s\S]*font-weight:\s*700/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /og-invitation-20260825\.png/);
  assert.match(layout, /width: 900, height: 472/);
  assert.match(layout, /card: "summary_large_image"/);
  assert.match(packageJson, /"framer-motion"/);
});
