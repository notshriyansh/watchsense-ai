const VECTOR_SIZE = 48;

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

const hashWord = (word: string) => {
  let hash = 0;
  for (const char of word) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % VECTOR_SIZE;
};

export const embedText = (text: string): number[] => {
  const vector = Array(VECTOR_SIZE).fill(0);

  tokenize(text).forEach((word) => {
    vector[hashWord(word)] += 1;
  });

  const magnitude =
    Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;

  return vector.map((value) => value / magnitude);
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let aMag = 0;
  let bMag = 0;

  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    aMag += a[i] * a[i];
    bMag += b[i] * b[i];
  }

  if (!aMag || !bMag) return 0;
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
};
