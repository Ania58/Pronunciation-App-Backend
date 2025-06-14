export interface Word {
  word: string;
  ipa: string;
  language: string; 
  difficulty?: "easy" | "medium" | "hard";
  category?: string; 
}
