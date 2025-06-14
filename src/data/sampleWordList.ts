import fullData from './wordListWithIPA.json';
import fs from 'fs';

const wordArray = fullData as { word: string; arpabet: string; ipa: string }[];

const sample = wordArray.slice(0, 5000);

fs.writeFileSync('src/data/sample5000.json', JSON.stringify(sample, null, 2));
console.log('Sample data written to src/data/sample5000.json');

