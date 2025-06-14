import fs from "fs";
import path from "path";

const inputPath = path.join(__dirname, "../data/wordListWithIPA.json");
const outputPath = path.join(__dirname, "../data/curatedWordList.ts");

type Word = {
  word: string;
  arpabet: string;
  ipa: string;
  language: string;
};

type EnrichedWord = Word & {
  difficulty: "easy" | "medium" | "hard";
  category: string;
};

const raw: Word[] = JSON.parse(fs.readFileSync(inputPath, "utf-8"));


const sampleSize = 5000;
const sampled: Word[] = [];

const used = new Set();
while (sampled.length < sampleSize) {
  const index = Math.floor(Math.random() * raw.length);
  if (!used.has(index)) {
    sampled.push(raw[index]);
    used.add(index);
  }
}


function assignCategory(ipa: string): string {
  if (ipa.includes("θ")) return "voiceless TH";
  if (ipa.includes("ð")) return "voiced TH";
  if (ipa.includes("ə")) return "schwa";
  if (ipa.includes("ɔɪ") || ipa.includes("aʊ") || ipa.includes("eɪ") || ipa.includes("aɪ")) return "diphthongs";
  if (ipa.includes("ˈ")) return "stress";
  if (ipa.includes("ŋ") || ipa.includes("kst") || ipa.includes("sts")) return "consonant clusters";
  if (ipa.match(/[æɑɛ]/)) return "vowels";
  return "other";
}

function assignDifficulty(word: string, ipa: string): "easy" | "medium" | "hard" {
  const length = word.length;

  if (ipa.includes("θ") || ipa.includes("ð") || ipa.includes("ŋ") || ipa.includes("ʒ")) return "hard";
  if (ipa.includes("ə") || ipa.includes("ʊ") || ipa.includes("aʊ") || ipa.includes("ɔ")) return "medium";
  if (length <= 4 && !ipa.includes("ˈ")) return "easy";
  if (length >= 9 || ipa.includes("ˈ")) return "hard";

  return "medium";
}

const enriched: EnrichedWord[] = sampled.map((entry) => ({
  ...entry,
  difficulty: assignDifficulty(entry.word, entry.ipa),
  category: assignCategory(entry.ipa),
}));


const header = 'import { Word } from "../types/Word";\n\n';
const body = "export const curatedWordList: Word[] = " + JSON.stringify(enriched, null, 2) + ";\n";

fs.writeFileSync(outputPath, header + body);
console.log(`✅ Created ${enriched.length} curated entries with real categories and difficulty.`);
