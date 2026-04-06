import Link from "next/link";
import { SearchBar } from "~/components/search-bar";
import { DidYouKnow } from "~/components/did-you-know";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Athens Recycling Guide",
      url: "https://recycleathens.com",
      description:
        "Find out how to properly dispose of any item in Athens-Clarke County, Georgia.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://recycleathens.com/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      name: "Athens Recycling Guide",
      url: "https://recycleathens.com",
      description:
        "A free community tool to help Athens-Clarke County residents dispose of waste properly.",
      areaServed: {
        "@type": "City",
        name: "Athens",
        containedInPlace: {
          "@type": "State",
          name: "Georgia",
        },
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="flex flex-col items-center px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Nav */}
      <nav className="w-full max-w-4xl flex justify-end gap-4 mb-6 text-sm">
        <Link
          href="/about"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          About
        </Link>
      </nav>

      {/* Hero */}
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          ♻️ Athens Recycling Guide
        </h1>
        <p className="text-lg text-gray-600">
          Not sure where it goes? Search for any item and get ACC-specific
          disposal instructions instantly.
        </p>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Did You Know */}
      <DidYouKnow />

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-400 pb-8">
        <p>
          Built for Athens, GA. Data sourced from{" "}
          <a
            href="https://www.accgov.com/solidwaste"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            ACC Solid Waste Department
          </a>
          .
        </p>
        <p className="mt-1">
          Not an official ACC government site.{" "}
          <Link href="/about" className="underline hover:text-gray-600">
            Learn more
          </Link>{" "}
          · When in doubt, call 706-613-3512.
        </p>
      </footer>
    </main>
  );
}
