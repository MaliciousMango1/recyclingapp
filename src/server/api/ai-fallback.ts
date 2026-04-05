import OpenAI from "openai";
import { env } from "~/env";

const client = new OpenAI({
  baseURL: env.AI_API_BASE_URL,
  apiKey: env.AI_API_KEY,
});

const SYSTEM_PROMPT = `You are a waste disposal expert specifically for Athens-Clarke County, Georgia. 
Your job is to tell residents how to properly dispose of items based on ACC's rules.

Athens-Clarke County key facts:
- Curbside recycling accepts: rigid plastics #1-7, glass bottles/jars, aluminum/steel cans, cardboard, paper
- Curbside recycling does NOT accept: plastic bags, styrofoam, shredded paper, electronics, hazardous waste
- The CHaRM facility (Community Hazardous and Reusable Materials) is at 1005 College Station Road
- CHaRM accepts: electronics, paint, chemicals, batteries, tires (limit 4), motor oil, and more
- CHaRM hours: Wed-Sat, 8am-5pm (check for current hours)
- Yard waste has separate collection in yard waste carts
- Bulk pickup can be scheduled by calling 706-613-3512
- ACC Solid Waste website: accgov.com/solidwaste

Respond with a JSON object only, no markdown or extra text:
{
  "category": "RECYCLE" | "COMPOST" | "LANDFILL" | "HAZARDOUS" | "SPECIAL_DROPOFF" | "REUSE",
  "instructions": "Specific disposal instructions for ACC residents",
  "tips": "Optional helpful tip or null",
  "confidence": "high" | "medium" | "low"
}

If you're unsure about ACC-specific rules, set confidence to "low" and give general guidance while suggesting the resident call ACC Solid Waste at 706-613-3512 to confirm.`;

export interface AIDisposalResult {
  category: string;
  instructions: string;
  tips: string | null;
  confidence: "high" | "medium" | "low";
}

const VALID_CATEGORIES = new Set([
  "RECYCLE", "COMPOST", "LANDFILL", "HAZARDOUS", "SPECIAL_DROPOFF", "REUSE",
]);

const VALID_CONFIDENCE = new Set(["high", "medium", "low"]);

export async function getAIDisposalAdvice(
  itemName: string
): Promise<AIDisposalResult | null> {
  try {
    // Sanitize input: strip anything that isn't alphanumeric, spaces, hyphens, or common punctuation
    const sanitized = itemName
      .replace(/[^\w\s\-'"/().,:;!?]/g, "")
      .slice(0, 200);

    if (sanitized.length < 1) return null;

    const completion = await client.chat.completions.create({
      model: env.AI_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `How should a resident of Athens-Clarke County, GA dispose of: ${sanitized}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    // Strip markdown code fences if present
    const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Validate the response shape
    if (
      typeof parsed.instructions !== "string" ||
      parsed.instructions.length === 0 ||
      !VALID_CATEGORIES.has(parsed.category)
    ) {
      console.error("AI fallback returned invalid shape:", parsed);
      return null;
    }

    return {
      category: parsed.category,
      instructions: parsed.instructions.slice(0, 2000),
      tips: typeof parsed.tips === "string" ? parsed.tips.slice(0, 1000) : null,
      confidence: VALID_CONFIDENCE.has(parsed.confidence) ? parsed.confidence : "low",
    };
  } catch (error) {
    console.error("AI fallback error:", error);
    return null;
  }
}
