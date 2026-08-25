import type { Metadata } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const [repositoryOwner = "ShazaHennawi", repositoryName = "wedding-invite"] =
  process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const siteUrl = isGitHubPages
  ? `https://${repositoryOwner}.github.io/${repositoryName}/`
  : process.env.NEXT_PUBLIC_SITE_URL ?? "https://isaac-shaza-wedding.sasha149.chatgpt.site/";
const pageUrl = new URL(isGitHubPages ? "ceremony.syria.html" : "ceremony.syria", siteUrl).toString();
const imageUrl = new URL("og-invitation-20260825.png", siteUrl).toString();
const title = "ceremony.syria — Isaac & Shaza";
const description = "You are invited to celebrate the wedding ceremony of Isaac and Shaza.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: pageUrl,
    siteName: "Isaac & Shaza Wedding Invitation",
    type: "website",
    images: [{
      url: imageUrl,
      width: 900,
      height: 472,
      alt: "Ivory wedding invitation envelope with ornate embossed details",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
};

export default function CeremonySyriaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
