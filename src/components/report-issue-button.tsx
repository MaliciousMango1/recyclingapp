"use client";

import { useState } from "react";
import { api } from "~/lib/trpc";

interface ReportIssueButtonProps {
  itemName: string;
  itemSlug: string | null;
}

const reportTypes = [
  { value: "incorrect", label: "Incorrect info", description: "The disposal instructions are wrong" },
  { value: "outdated", label: "Outdated", description: "This info has changed since it was last verified" },
  { value: "missing", label: "Missing details", description: "Important information is missing" },
  { value: "other", label: "Other", description: "Something else is wrong" },
];

export function ReportIssueButton({ itemName, itemSlug }: ReportIssueButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState("incorrect");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const report = api.items.reportIssue.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setDescription("");
        setReportType("incorrect");
      }, 3000);
    },
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
      >
        🚩 Report an issue with this info
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
        <strong>Thanks!</strong> Your report has been submitted. We'll review it
        and update the information if needed.
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white/80 border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 text-sm">
          Report an issue with "{itemName}"
        </h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>

      {/* Report type */}
      <div className="flex flex-wrap gap-2 mb-3">
        {reportTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setReportType(type.value)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              reportType === type.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
            title={type.description}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's wrong? Be as specific as possible so we can fix it."
        rows={3}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                   focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-200
                   placeholder:text-gray-400"
      />

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">
          No personal information is collected with this report.
        </p>
        <button
          onClick={() =>
            report.mutate({
              itemSlug,
              itemName,
              reportType: reportType as any,
              description: description.trim(),
            })
          }
          disabled={description.trim().length < 5 || report.isPending}
          className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg font-medium
                     hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {report.isPending ? "Submitting..." : "Submit Report"}
        </button>
      </div>

      {report.error && (
        <p className="mt-2 text-xs text-red-600">
          Something went wrong. Please try again or open an issue on GitHub.
        </p>
      )}
    </div>
  );
}
