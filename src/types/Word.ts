export interface Word {
  word: string;
  ipa: string;
  arpabet: string; 
  language: string; 
  difficulty?: "easy" | "medium" | "hard";
  category?: string; 
}
