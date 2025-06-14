import { Request, Response } from 'express';
import { wordList } from '../data/wordList';

export const getSampleWords = (req: Request, res: Response) => {
  res.json(wordList);
};
