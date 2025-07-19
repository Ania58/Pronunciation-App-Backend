const arpabetToIpaMap: { [symbol: string]: string } = {
  "AA": "ɑ",  "AE": "æ",  "AH": "ʌ",  "AO": "ɔ",  "AW": "aʊ",
  "AY": "aɪ", "B": "b",   "CH": "tʃ", "D": "d",   "DH": "ð",
  "EH": "ɛ",  "ER": "ɝ",  "EY": "eɪ", "F": "f",   "G": "ɡ",
  "HH": "h",  "IH": "ɪ",  "IY": "i",  "JH": "dʒ", "K": "k",
  "L": "l",   "M": "m",   "N": "n",   "NG": "ŋ",  "OW": "oʊ",
  "OY": "ɔɪ", "P": "p",   "R": "ɹ",   "S": "s",   "SH": "ʃ",
  "T": "t",   "TH": "θ",  "UH": "ʊ",  "UW": "u",  "V": "v",
  "W": "w",   "Y": "j",   "Z": "z",   "ZH": "ʒ"
};

export function convertToIPA(arpabet: string): string {
  const symbols = arpabet.split(" ");

  const ipa = symbols.map((sym) => {
    const stress = sym.match(/[0-2]$/); 
    const base = sym.replace(/[0-2]$/, '');

    let ipaSymbol = arpabetToIpaMap[base] || base;

    if (base === "AH" && stress?.[0] === "0") {
      ipaSymbol = "ə";
    }

    if (stress) {
      if (stress[0] === "1") ipaSymbol = "ˈ" + ipaSymbol;
      else if (stress[0] === "2") ipaSymbol = "ˌ" + ipaSymbol;
    }

    return ipaSymbol;
  });

  return `/${ipa.join(' ')}/`;
}

