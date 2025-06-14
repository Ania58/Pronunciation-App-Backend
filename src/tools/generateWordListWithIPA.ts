import fs from 'fs';
import path from 'path';
import { convertToIPA } from './arpabetToIpa';

const inputPath = path.join(__dirname, '../data/cmudict.json');
const outputPath = path.join(__dirname, '../data/wordListWithIPA.json');

const rawData = fs.readFileSync(inputPath, 'utf-8');
const wordList = JSON.parse(rawData);

const result = wordList.map((entry: { word: string; arpabet: string }) => ({
  word: entry.word,
  arpabet: entry.arpabet,
  ipa: convertToIPA(entry.arpabet),
  language: "en",
}));

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Saved ${result.length} words to wordListWithIPA.json`);
