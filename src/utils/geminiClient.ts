const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!API_KEY) {
  throw new Error("Groq API key is missing");
}

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

async function groqRequest(prompt: string): Promise<string> {
  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq API error:", err);
    throw new Error("Groq API failed");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function generateGeminiResponse(
  prompt: string
): Promise<string[]> {
  const text = await groqRequest(`
Give ONLY a comma separated list of movie names.
No explanations.
No numbering.

User query: ${prompt}
  `);

  return text
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
}

export async function generateGeminiText(prompt: string): Promise<string> {
  return groqRequest(prompt);
}
