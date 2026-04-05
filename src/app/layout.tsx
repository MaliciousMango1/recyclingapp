import type { Metadata } from "next";
import { TRPCProvider } from "~/components/providers";
import { Analytics } from "~/components/analytics";
import "~/app/globals.css";

export const metadata: Metadata = {
  title: "Athens Recycling Guide | Know Before You Throw",
  description:
    "Find out how to properly dispose of any item in Athens-Clarke County, Georgia. Search our database or get AI-powered answers for ACC-specific recycling and waste disposal.",
  keywords: ["Athens", "Georgia", "recycling", "waste", "ACC", "disposal", "CHaRM"],
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
