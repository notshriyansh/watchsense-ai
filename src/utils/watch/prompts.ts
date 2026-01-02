import type { WatchProgress } from "./watchTypes";

export const buildDropOffPrompt = (item: WatchProgress, overview: string) => `
You are a personal streaming assistant.

User started watching "${item.title}".
Progress: ${item.progressPercent}%.
They haven't watched it for several days.

Movie overview:
${overview}

Decide:
- Should the user continue watching?
- Or is it okay to drop it?

Give a short, honest explanation (2–3 lines).
No spoilers.
`;

export const buildVerdictPrompt = (item: WatchProgress, overview: string) => `
You are a personal streaming assistant.

User started watching "${item.title}".
Progress: ${item.progressPercent}%.
Has not watched for several days.

Movie overview:
${overview}

Respond in STRICT JSON format:
{
  "verdict": "CONTINUE" | "DROP",
  "reason": "short explanation (2 lines max)"
}

No extra text.
`;
