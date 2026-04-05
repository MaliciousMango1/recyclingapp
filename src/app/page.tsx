import Link from "next/link";
import { SearchBar } from "~/components/search-bar";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center px-4 py-12">
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

      {/* Info Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <InfoCard
          emoji="🗑️"
          title="Curbside Pickup"
          description="Recycling and landfill carts are collected weekly on your scheduled day."
        />
        <InfoCard
          emoji="📍"
          title="CHaRM Facility"
          description="1005 College Station Rd — accepts electronics, paint, batteries, and more. Wed-Sat 8am-5pm."
        />
        <InfoCard
          emoji="📞"
          title="Bulk Pickup"
          description="Schedule large item pickup by calling ACC Solid Waste at 706-613-3512."
        />
      </div>

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

function InfoCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <span className="text-3xl">{emoji}</span>
      <h3 className="text-lg font-semibold text-gray-900 mt-2">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}
