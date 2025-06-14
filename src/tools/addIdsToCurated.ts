import fs from 'fs';
import path from 'path';

const inputPath = path.join(__dirname, '../data/curatedWordList.ts');
const outputPath = path.join(__dirname, '../data/curatedWordListWithIds.ts');

import { curatedWordList as originalList } from '../data/curatedWordList';

const withIds = originalList.map((entry, index) => ({
  ...entry,
  id: `curated-${(index + 1).toString().padStart(5, '0')}`
}));

const header = 'import { Word } from "../types/Word";\n\n';
const exportLine = 'export const curatedWordList: Word[] = ';

fs.writeFileSync(
  outputPath,
  header + exportLine + JSON.stringify(withIds, null, 2) + ';\n',
  'utf-8'
);

console.log(`✅ Done: ${withIds.length} entries saved to ${outputPath}`);
