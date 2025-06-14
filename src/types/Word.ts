export interface Word {
  id?: string;
  word: string;
  ipa: string;
  arpabet: string; 
  language: string; 
  difficulty?: "easy" | "medium" | "hard";
  category?: string; 
}
