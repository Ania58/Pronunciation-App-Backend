import fs from "fs";
import path from "path";

const inputPath = path.join(__dirname, "../data/wordListWithIPA.json");
const outputPath = path.join(__dirname, "../data/wordListWithCategory.json");

type Word = {
  word: string;
  arpabet: string;
  ipa: string;
  language: string;
};

type LabeledWord = Word & {
  category: string;
};

const raw = JSON.parse(fs.readFileSync(inputPath, "utf-8")) as Word[];
console.log("First 10 IPA values:");
raw.slice(0, 10).forEach((word) => console.log(word.ipa));


const categoryCounts: Record<string, number> = {
  "voiceless TH": 0,
  "voiced TH": 0,
  "schwa": 0,
  "diphthongs": 0,
  "stress": 0,
  "consonant clusters": 0,
  "vowels": 0,
  "other": 0,
};

function assignCategory(ipa: string): string {
  const cleaned = ipa.replace(/\//g, "");
  const symbols = cleaned.split(" ");
  const joined = symbols.join("");

  const hasStressMark = symbols.some(s => s.includes("ˈ") || s.includes("ˌ"));

  if (symbols.includes("θ")) return "voiceless TH";
  if (symbols.includes("ð")) return "voiced TH";

  if (symbols.includes("ə")) return "schwa";

  if (joined.match(/ɔɪ|aʊ|eɪ|aɪ|oʊ|ju|ɪə|ʊə|eə|ei|ai|au/)) return "diphthongs";

  const vowelSymbols = new Set(["æ", "ɑ", "ɛ", "ɪ", "ʊ", "ɔ", "e", "i", "iː", "u", "uː", "ɒ"]);
  if (symbols.some((s) => vowelSymbols.has(s))) return "vowels";

  if (joined.match(/st|tr|dr|sk|kl|kr|pl|pr|bl|br|gl|gr|tw|sp|sw|sm|sn|fl|fr|sl|spl|spr|str|skr/)) {
    return "consonant clusters";
  }

  if (hasStressMark) return "stress";

  return "other";
}


const labeled: LabeledWord[] = raw.map((word) => {
  const category = assignCategory(word.ipa);
  categoryCounts[category] += 1;
  return {
    ...word,
    category,
  };
});

fs.writeFileSync(outputPath, JSON.stringify(labeled, null, 2), "utf-8");

console.log(`✅ Saved ${labeled.length} words with assigned categories.`);
console.log("✅ Distribution by category:");
console.table(categoryCounts);

