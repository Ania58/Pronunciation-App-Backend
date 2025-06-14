import { Request, Response } from 'express';
import { Word } from '../types/Word';

export const getSampleWords = (req: Request, res: Response) => {
  const words: Word[] = [
    { word: "cat", ipa: "/kæt/", language: "en", difficulty: "easy", category: "vowels" },
    { word: "thought", ipa: "/θɔːt/", language: "en", difficulty: "medium", category: "vowels" },
    { word: "record", ipa: "/ˈrek.ɔːd/", language: "en", difficulty: "hard", category: "stress" }
  ];

  res.json(words);
};
