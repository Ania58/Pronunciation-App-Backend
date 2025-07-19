import fs from "fs";
import path from "path";

const inputPath = path.join(__dirname, "../data/wordListWithCategory.json");
const outputPath = path.join(__dirname, "../data/curatedWordList.ts");

type Word = {
  word: string;
  arpabet: string;
  ipa: string;
  language: string;
  category: string;
};

type EnrichedWord = Word & {
  difficulty: "easy" | "medium" | "hard";
};

const raw: Word[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

const categories = [
  "voiceless TH",
  "voiced TH",
  "schwa",
  "diphthongs",
  "stress",
  "consonant clusters",
  "vowels",
  "other",
];

function assignDifficulty(word: string, ipa: string): "easy" | "medium" | "hard" {
  const length = word.length;
  const phonemes = ipa.replace(/\//g, "").split(" ");

  const hardSounds = ["θ", "ð", "ŋ", "ʒ", "dʒ"];
  const mediumSounds = ["ə", "ʊ", "aʊ", "ɔ", "ɜ", "eə", "ɪə"];
  const diphthongs = ["aɪ", "eɪ", "oʊ", "ɔɪ", "aʊ", "ju"];

  if (hardSounds.some(s => ipa.includes(s))) return "hard";

  if (length <= 4 && !ipa.includes("ˈ") && phonemes.length <= 3) return "easy";

  if (length >= 9 || ipa.includes("ˈ") && phonemes.length > 4) return "hard";

  if (mediumSounds.some(s => ipa.includes(s)) || diphthongs.some(d => ipa.includes(d))) return "medium";

  return "medium";
}

function sanitizeWord(word: string): string {
  return word
    .replace(/[‘’‛´`]/g, "'")
    .replace(/[“”„"]/g, '"')
    .replace(/[^a-zA-Z0-9'’-]/g, "");
}

const finalSample: Word[] = [];
const perCategory = 300;

for (const category of categories) {
  const matches = raw.filter((word) => word.category === category);
  const shuffled = matches.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, perCategory);
  finalSample.push(...selected);

  console.log(
    `✅ Category "${category}": wanted ${perCategory}, got ${selected.length} (from ${matches.length} total)`
  );
}

const enriched: EnrichedWord[] = finalSample.map((entry) => ({
  ...entry,
  word: sanitizeWord(entry.word),
  difficulty: assignDifficulty(entry.word, entry.ipa),
}));

const header = 'import { Word } from "../types/Word";\n\n';
const body = "export const curatedWordList: Word[] = " + JSON.stringify(enriched, null, 2) + ";\n";
fs.writeFileSync(outputPath, header + body, "utf-8");

console.log(`✅ Final curatedWordList.ts created with ${enriched.length} words.`);
