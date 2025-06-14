import fs from 'fs';
import path from 'path';

const inputPath = path.join(__dirname, '../data/wordListWithIPA.json');
const outputPath = path.join(__dirname, '../data/wordListWithIds.json');

type Word = {
  word: string;
  ipa?: string;
  arpabet?: string;
  difficulty?: string;
  category?: string;
  language: string;
};

const raw = fs.readFileSync(inputPath, 'utf-8');
const words: Word[] = JSON.parse(raw);


const wordsWithIds = words.map((word, index) => ({
  id: `word-${(index + 1).toString().padStart(5, '0')}`,
  ...word
}));

fs.writeFileSync(outputPath, JSON.stringify(wordsWithIds, null, 2), 'utf-8');

console.log(`✅ Done: ${wordsWithIds.length} words saved to ${outputPath}`);
