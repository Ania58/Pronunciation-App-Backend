import { Request, Response } from 'express';
import { wordList } from '../data/wordList';

export const getSampleWords = (req: Request, res: Response) => {
const { language, difficulty, category } = req.query;

let filteredWords = wordList;

if (language) {
  filteredWords = filteredWords.filter(word => word.language.toLowerCase() === (language as string).toLowerCase());
};

if (difficulty) {
  filteredWords = filteredWords.filter(word => word.difficulty?.toLowerCase() === (difficulty as string).toLowerCase());
};

if (category) {
  filteredWords = filteredWords.filter(word => word.category?.toLowerCase() === (category as string).toLowerCase());
};

  res.json(filteredWords);
};
