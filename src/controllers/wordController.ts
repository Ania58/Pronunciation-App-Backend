import { Request, Response } from 'express';
import { Word } from '../types/Word';
import { curatedWordList } from '../data/curatedWordList';
import fullWordList from '../data/wordListWithIPA.json';


export const getSampleWords = (req: Request, res: Response) => {
const { language, difficulty, category } = req.query;

let filteredWords = curatedWordList;

if (language) {
  filteredWords = filteredWords.filter((word: Word) => word.language.toLowerCase() === (language as string).toLowerCase());
};

if (difficulty) {
  filteredWords = filteredWords.filter((word: Word) => word.difficulty?.toLowerCase() === (difficulty as string).toLowerCase());
};

if (category) {
  filteredWords = filteredWords.filter((word: Word) => word.category?.toLowerCase() === (category as string).toLowerCase());
};

  res.json(filteredWords);
};

export const getAllWords = (req: Request, res: Response) => {
  res.json(fullWordList);
};

export const getWordByText = (req: Request, res: Response): void => {
  const { word } = req.params;
  const lower = word.toLowerCase();

  const result = (fullWordList as Word[]).find((entry) => entry.word.toLowerCase() === lower);

  if (!result) {
    res.status(404).json({ message: "Word not found" });
    return;
  }

  res.json(result);
};

export const searchWords = (req: Request, res: Response) :void => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
   res.status(400).json({ message: 'Query parameter is required' });
    return;
  }

  const lower = query.toLowerCase();

  const matches = (fullWordList as Word[]).filter((entry) =>
    entry.word.toLowerCase().startsWith(lower)
  ).slice(0, 50); 

  res.json(matches);
};