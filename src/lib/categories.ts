export const categoryConfig: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string; emoji: string; description: string }
> = {
  RECYCLE: {
    label: "Recyclable",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    emoji: "♻️",
    description: "Place in your blue recycling cart",
  },
  COMPOST: {
    label: "Compostable",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    emoji: "🌱",
    description: "Place in your yard waste cart",
  },
  LANDFILL: {
    label: "Landfill",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    emoji: "🗑️",
    description: "Place in your landfill cart",
  },
  HAZARDOUS: {
    label: "Hazardous",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    emoji: "⚠️",
    description: "Requires special handling — do NOT place in curbside carts",
  },
  SPECIAL_DROPOFF: {
    label: "Special Drop-off",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    emoji: "📍",
    description: "Take to a designated drop-off location",
  },
  REUSE: {
    label: "Reuse / Donate",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    emoji: "💜",
    description: "Consider donating or repurposing",
  },
};

export function getCategoryConfig(category: string) {
  return (
    categoryConfig[category] ?? {
      label: category,
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      emoji: "❓",
      description: "Check with ACC Solid Waste",
    }
  );
}
