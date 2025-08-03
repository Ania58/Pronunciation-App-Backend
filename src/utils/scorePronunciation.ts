import stringSimilarity from 'string-similarity';
import { curatedWordList } from '../data/curatedWordListWithIds';
import fullWordList from '../data/wordListWithIds.json';

interface WordEntry {
  id?: string;
  word: string;
  ipa?: string;
}

function normalizeWordForComparison(word: string): string {
  return word.trim().toLowerCase().replace(/[^\w]/g, '');
}

function findWordEntryByWord(word: string): WordEntry | undefined {
  const normalized = normalizeWordForComparison(word);
  const allCurated = Object.values(curatedWordList).flat();
  const allWords = [...(fullWordList as WordEntry[]), ...allCurated];

  return allWords.find((entry) => 
    normalizeWordForComparison(entry.word) === normalized
  );
}

export function scorePronunciation(expected: string, transcript: string): number {
  const cleanExpected = expected.trim().toLowerCase().replace(/['’]/g, '');
  const cleanTranscript = transcript.trim().toLowerCase().replace(/['’]/g, '');

  const expectedEntry = findWordEntryByWord(expected.trim().toLowerCase());
  const transcriptEntry = findWordEntryByWord(transcript.trim().toLowerCase());

  console.log('[SCORING] Lookup ExpectedEntry:', expectedEntry?.word || '—');
  console.log('[SCORING] Lookup TranscriptEntry:', transcriptEntry?.word || '—');

  const ipaA = expectedEntry?.ipa?.replace(/[\/ˈˌ]/g, '').trim();
  const ipaB = transcriptEntry?.ipa?.replace(/[\/ˈˌ]/g, '').trim();

  console.log('[SCORING] Word:', cleanExpected, '| Transcript:', cleanTranscript);
  console.log('[SCORING] IPA Expected:', ipaA || '—', '| IPA Transcript:', ipaB || '—');

  if (ipaA && ipaB) {
    const ipaSimilarity = stringSimilarity.compareTwoStrings(ipaA, ipaB);
    console.log('[SCORING] IPA similarity score:', ipaSimilarity.toFixed(2));

    if (ipaSimilarity >= 0.95) return 10;
    if (ipaSimilarity >= 0.85) return 9;
    if (ipaSimilarity >= 0.7) return 8;
    if (ipaSimilarity >= 0.6) return 6;
    if (ipaSimilarity >= 0.45) return 4;
    if (ipaSimilarity >= 0.3) return 2;
    return 1;
  }

  const fallbackSim = stringSimilarity.compareTwoStrings(cleanExpected, cleanTranscript);
  console.log('[SCORING] Fallback similarity (word):', fallbackSim.toFixed(2));

  if (fallbackSim >= 0.95) return 10;
  if (fallbackSim >= 0.85) return 8;
  if (fallbackSim >= 0.75) return 7;
  if (fallbackSim >= 0.65) return 6;
  if (fallbackSim >= 0.5) return 5;
  if (fallbackSim >= 0.3) return 3;
  if (fallbackSim > 0.15) return 1;
  return 0;
}
