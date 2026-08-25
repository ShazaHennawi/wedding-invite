import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-static";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const [repositoryOwner = "ShazaHennawi", repositoryName = "wedding-invite"] =
  process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const siteUrl = isGitHubPages
  ? `https://${repositoryOwner}.github.io/${repositoryName}/`
  : process.env.NEXT_PUBLIC_SITE_URL ?? "https://isaac-shaza-wedding.sasha149.chatgpt.site/";
const imageUrl = new URL("og-invitation-20260825.png", siteUrl).toString();
const title = "Isaac & Shaza — Wedding Invitation";
const description = "You are invited to celebrate the wedding of Isaac and Shaza.";
const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Isaac & Shaza Wedding Invitation",
    type: "website",
    images: [{ url: imageUrl, width: 900, height: 472, alt: "Ivory wedding invitation envelope with ornate embossed details" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      style={{
        "--ceremony-background-image": `url("${assetBasePath}/ceremony-background-ornate.png")`,
        "--timeline-icons-image": `url("${assetBasePath}/wedding-timeline-icons-transparent.png")`,
      } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
