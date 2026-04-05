"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";
import { SearchResult } from "./search-result";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const searchMutation = api.items.search.useMutation();
  const siteSettings = api.items.getSiteSettings.useQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length === 0) return;
    searchMutation.mutate({ query: query.trim() });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='What do you need to throw away? (e.g. "pizza box")'
          className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 
                     focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 
                     shadow-sm transition-all duration-200 placeholder:text-gray-400"
          aria-label="Search for an item to recycle or dispose of"
        />
        <button
          type="submit"
          disabled={searchMutation.isPending || query.trim().length === 0}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-green-600 
                     text-white rounded-xl font-medium hover:bg-green-700 transition-colors 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searchMutation.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching
            </span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Quick search suggestions */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {["Pizza box", "Batteries", "Plastic bags", "Paint", "Old TV"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuery(suggestion);
              searchMutation.mutate({ query: suggestion });
            }}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full 
                       hover:bg-gray-200 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Results */}
      {searchMutation.data && (
        <div className="mt-8">
          <SearchResult
            result={searchMutation.data}
            query={query}
            showVerifiedDates={siteSettings.data?.showVerifiedDates ?? true}
          />
        </div>
      )}

      {searchMutation.error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          Something went wrong. Please try again or call ACC Solid Waste at 706-613-3512.
        </div>
      )}
    </div>
  );
}
