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
