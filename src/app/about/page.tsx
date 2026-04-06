import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Athens Recycling Guide",
  description:
    "Learn about the Athens Recycling Guide, how our data is sourced, and important disclaimers about waste disposal in Athens-Clarke County.",
  openGraph: {
    title: "About | Athens Recycling Guide",
    description:
      "Learn about the Athens Recycling Guide, how our data is sourced, and important disclaimers about waste disposal in Athens-Clarke County.",
    url: "https://recycleathens.com/about",
  },
  alternates: {
    canonical: "https://recycleathens.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-green-600 hover:text-green-700 font-medium"
      >
        ← Back to search
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
        About Athens Recycling Guide
      </h1>
      <p className="text-gray-600 mb-10">
        A free community tool to help Athens-Clarke County residents dispose of
        waste properly.
      </p>

      {/* What is this */}
      <Section title="What is this?">
        <p>
          Athens Recycling Guide is a free, community-built tool that helps
          residents of Athens-Clarke County, Georgia figure out how to properly
          dispose of household items. Just type in what you need to throw away
          and you'll get clear, ACC-specific instructions — whether it goes in
          your recycling cart, landfill cart, yard waste cart, or needs to be
          taken to a special drop-off location.
        </p>
      </Section>

      {/* How it works */}
      <Section title="How does it work?">
        <p>
          We maintain a curated database of common items with disposal
          instructions verified against Athens-Clarke County Solid Waste
          Department guidelines. When you search for an item, we first check our
          verified database. If we don't have an exact match, we use fuzzy
          matching to find similar items. If that doesn't work either, an AI
          system generates an answer based on ACC's published rules and
          guidelines.
        </p>
        <p className="mt-3">
          AI-generated answers are clearly labeled so you know when you're
          getting a verified answer versus an AI suggestion. We regularly review
          AI-generated responses and add frequently searched items to our
          verified database.
        </p>
      </Section>

      {/* Data sources */}
      <Section title="Where does the data come from?">
        <p>
          Our disposal instructions are sourced from publicly available
          resources published by Athens-Clarke County, including:
        </p>
        <ul className="mt-3 space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>
              <a
                href="https://www.accgov.com/solidwaste"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
              >
                ACC Solid Waste Department
              </a>{" "}
              — curbside collection rules and schedules
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>
              <a
                href="https://www.accgov.com/7618/Recycling"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
              >
                ACC Recycling Program
              </a>{" "}
              — accepted materials and recycling guidelines
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>
              <a
                href="https://www.accgov.com/charm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline"
              >
                CHaRM Facility
              </a>{" "}
              — Community Hazardous and Reusable Materials center at 1005
              College Ave
            </span>
          </li>
        </ul>
      </Section>

      {/* Important disclaimer */}
      <div className="my-10 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
        <h2 className="text-lg font-bold text-amber-800 mb-3">
          ⚠️ Important Disclaimer
        </h2>
        <div className="space-y-3 text-amber-900">
          <p>
            <strong>
              This is not an official Athens-Clarke County government website.
            </strong>{" "}
            This is an independent community project and is not affiliated with,
            endorsed by, or maintained by Athens-Clarke County Unified Government
            or the ACC Solid Waste Department.
          </p>
          <p>
            While we make every effort to keep our information accurate and
            up-to-date, ACC policies, accepted materials, facility hours, and
            collection schedules may change without notice. We cannot guarantee
            that all information on this site is current or complete.
          </p>
          <p>
            <strong>When in doubt, always contact ACC Solid Waste directly:</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:7066133512"
                className="underline font-medium"
              >
                706-613-3512
              </a>
            </li>
            <li>
              <strong>Website:</strong>{" "}
              <a
                href="https://www.accgov.com/solidwaste"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                accgov.com/solidwaste
              </a>
            </li>
            <li>
              <strong>CHaRM Facility:</strong> 1005 College Ave,
              Athens, GA 30605
            </li>
          </ul>
          <p>
            Improper disposal of hazardous materials can be dangerous. If you
            are unsure about how to dispose of a hazardous item, please contact
            ACC Solid Waste or visit the CHaRM facility rather than relying
            solely on this tool.
          </p>
        </div>
      </div>

      {/* AI disclaimer */}
      <Section title="About AI-generated answers">
        <p>
          Some search results are generated by an AI system when an item isn't
          in our verified database. These answers are always clearly marked with
          a yellow banner and a confidence level. AI-generated answers are based
          on ACC's published guidelines but have not been individually verified
          by a human.
        </p>
        <p className="mt-3">
          We log AI-generated searches and regularly review them. Popular
          searches are verified against ACC resources and added to our curated
          database. If you see an AI-generated answer that seems wrong, please
          let us know using the "Report an issue" option on the result.
        </p>
      </Section>

      {/* Privacy */}
      <Section title="Privacy">
        <p>
          We log search queries to improve our database and identify items that
          need to be added. We do not collect personal information, require
          accounts, or use tracking cookies. Search logs contain only the search
          term and a timestamp — nothing that identifies you personally.
        </p>
      </Section>

      {/* Report issues */}
      <Section title="Found incorrect information?">
        <p>
          If you find disposal instructions on this site that are outdated or
          incorrect, we want to know. Accurate information is our top priority.
          Please{" "}
          <a
            href="https://github.com/MaliciousMango1/recyclingapp/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline"
          >
            open an issue on GitHub
          </a>
          .
        </p>
      </Section>

      {/* Roadmap */}
      <Section title="What's coming next">
        <p>
          This project is actively being developed. Here are some features
          we're planning to add:
        </p>
        <ul className="mt-3 space-y-2 text-gray-700">
          <li className="flex gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>
              <strong>Automated data verification</strong> — A system that
              periodically checks ACC's published guidelines against our
              database and flags any changes, so disposal instructions stay
              accurate without manual review.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>
              <strong>Photo identification</strong> — Snap a photo of an item
              and let an AI vision model identify it and tell you how to
              dispose of it. No more guessing what type of plastic something
              is.
            </span>
          </li>
        </ul>
        <p className="mt-3">
          Have an idea for a feature?{" "}
          <a
            href="https://github.com/MaliciousMango1/recyclingapp/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline"
          >
            Open an issue on GitHub
          </a>{" "}
          and let us know.
        </p>
      </Section>

      {/* Credits */}
      <Section title="Credits">
        <p>
          Built with care for the Athens, GA community. This is an open-source
          project — contributions, corrections, and suggestions are always
          welcome.
        </p>
      </Section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 pb-8">
        <p>
          Athens Recycling Guide is not affiliated with Athens-Clarke County
          Unified Government.
        </p>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}
