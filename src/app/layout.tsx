import type { Metadata } from "next";
import { TRPCProvider } from "~/components/providers";
import { Analytics } from "~/components/analytics";
import "~/app/globals.css";

const siteUrl = "https://recycleathens.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Athens Recycling Guide | Know Before You Throw",
  description:
    "Find out how to properly dispose of any item in Athens-Clarke County, Georgia. Search our database or get AI-powered answers for ACC-specific recycling and waste disposal.",
  keywords: ["Athens", "Georgia", "recycling", "waste", "ACC", "disposal", "CHaRM"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Athens Recycling Guide | Know Before You Throw",
    description:
      "Find out how to properly dispose of any item in Athens-Clarke County, Georgia. Search our database for ACC-specific recycling and waste disposal instructions.",
    url: siteUrl,
    siteName: "Athens Recycling Guide",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Athens Recycling Guide | Know Before You Throw",
    description:
      "Find out how to properly dispose of any item in Athens-Clarke County, Georgia. ACC-specific recycling and waste disposal instructions.",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-green-50 to-white antialiased">
        <TRPCProvider>{children}</TRPCProvider>
        <Analytics />
      </body>
    </html>
  );
}
