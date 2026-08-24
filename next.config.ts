import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const [repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const basePath = isGitHubPages && repositoryName ? `/${repositoryName}` : "";
const assetPrefix = isGitHubPages && repositoryOwner && repositoryName
  ? `https://${repositoryOwner}.github.io/${repositoryName}`
  : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        assetPrefix,
        trailingSlash: false,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
