import fs from 'fs';
import path from 'path';

const inputPath = path.join(__dirname, 'cmudict-0.7b.txt');
const outputPath = path.join(__dirname, 'cmudict.json');

const lines = fs.readFileSync(inputPath, 'utf-8').split('\n');

const result = [];

for (const line of lines) {
  if (line.startsWith(';;;') || line.trim() === '') continue;

  const [rawWord, ...rest] = line.trim().split(/\s+/);
  const pronunciation = rest.join(' ');

  // Remove (1), (2) suffixes from words like WORD(1), WORD(2)
  const word = rawWord.replace(/\(\d+\)$/, '').toLowerCase();

  result.push({ word, arpabet: pronunciation });
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Saved ${result.length} entries to cmudict.json`);
