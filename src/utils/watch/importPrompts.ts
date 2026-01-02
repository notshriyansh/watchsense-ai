export const buildImportTitlesPrompt = (rawText: string) => `
You are cleaning a list of movie titles provided by a user.

Input (may contain noise, bullets, numbering):
${rawText}

Return ONLY a clean JSON array of movie titles.
No explanations.
No extra text.

Example:
["Inception", "Parasite", "Whiplash"]
`;
