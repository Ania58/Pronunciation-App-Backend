import stringSimilarity from 'string-similarity';

export function scorePronunciation(
  expected: string,
  transcript: string,
): number {
  const cleanA = expected.trim().toLowerCase();
  const cleanB = transcript.trim().toLowerCase();

  const similarity = stringSimilarity.compareTwoStrings(cleanA, cleanB);

  return Math.round(similarity * 10);
}
