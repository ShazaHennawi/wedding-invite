import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bank Details — Isaac & Shaza",
  description: "Wedding gift bank details for Isaac and Shaza.",
  openGraph: {
    title: "Bank Details — Isaac & Shaza",
    description: "Wedding gift bank details for Isaac and Shaza.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Bank Details — Isaac & Shaza",
    description: "Wedding gift bank details for Isaac and Shaza.",
    images: [],
  },
};

export default function BankDetailsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
