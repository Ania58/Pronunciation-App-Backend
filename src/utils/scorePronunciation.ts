import stringSimilarity from 'string-similarity';

export function scorePronunciation(
  expected: string,
  transcript: string,
): number {
 
  const cleanA = expected.trim().toLowerCase().replace(/[^\w\s']/g, '');
  const cleanB = transcript.trim().toLowerCase().replace(/[^\w\s']/g, '');

  const similarity = stringSimilarity.compareTwoStrings(cleanA, cleanB);

  if (similarity >= 0.95) return 10;
  if (similarity >= 0.85) return 8;
  if (similarity >= 0.75) return 7;
  if (similarity >= 0.65) return 6;
  if (similarity >= 0.5) return 5;
  if (similarity >= 0.3) return 3;
  if (similarity > 0) return 1;
  return 0;
}
