"use client";

import Script from "next/script";

/**
 * Generic analytics script loader.
 * Works with any analytics provider that uses a script tag with a site ID:
 *   - Umami:    script.js + data-website-id
 *   - Plausible: script.js (no site ID needed, uses domain)
 *   - Fathom:   script.js + data-site
 *   - Matomo:   tracking.js + data-site-id
 *   - etc.
 *
 * Set these env vars in your .env:
 *   NEXT_PUBLIC_ANALYTICS_SCRIPT_URL - URL to the tracking script
 *   NEXT_PUBLIC_ANALYTICS_SITE_ID    - Your site/website ID (optional for some providers)
 *
 * Leave both blank to disable analytics entirely.
 */
export function Analytics() {
  const scriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
  const siteId = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID;

  if (!scriptUrl) return null;

  return (
    <Script
      src={scriptUrl}
      {...(siteId && { "data-website-id": siteId })}
      strategy="afterInteractive"
    />
  );
}
