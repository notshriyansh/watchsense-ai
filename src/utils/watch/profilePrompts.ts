import type { WatchProgress } from "./watchTypes";

export const buildProfilePrompt = (watchHistory: WatchProgress[]) => `
Analyze the user's watching behavior.

Return the response in EXACTLY this structure:

TITLE: (short creative label)

WATCHING TRAITS:
- Bullet point 1
- Bullet point 2
- Bullet point 3

DROP-OFF BEHAVIOR:
(1–2 sentences)

COMMITMENT STYLE:
(1–2 sentences)

WHAT THIS MEANS FOR RECOMMENDATIONS:
(1–2 sentences)

Base your analysis ONLY on this data:
${watchHistory
  .map((w) => `${w.title} – ${w.status} (${w.progressPercent}%)`)
  .join("\n")}
`;
