import { Request, Response } from 'express';
import { Word } from '../types/Word';
import { curatedWordList } from '../data/curatedWordListWithIds';
import fullWordList from '../data/wordListWithIds.json';


export const getSampleWords = (req: Request, res: Response) => {
const { language, difficulty, category, page = "1", limit = "50" } = req.query;

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

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  const paginated = filteredWords.slice(start, end);

  res.json({
    total: filteredWords.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(filteredWords.length / limitNum),
    results: paginated,
  });
};

export const getAllWords = (req: Request, res: Response) => {
  const { page = "1", limit = "50", sort = "word", order = "asc", query = "" } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const sortKey = sort as keyof Word;
  const sortOrder = order === "desc" ? -1 : 1;
  const searchTerm = (query as string).toLowerCase();

  let filtered = fullWordList as Word[];

  if (query) {
    filtered = filtered.filter(w => w.word.toLowerCase().includes(searchTerm));
  }
  if (searchTerm) {
    filtered = filtered.filter(w => w.word.toLowerCase().startsWith(searchTerm));
  }

  
  filtered.sort((a, b) => {
    const aVal = (a[sortKey] ?? '').toString().toLowerCase();
    const bVal = (b[sortKey] ?? '').toString().toLowerCase();
    return aVal.localeCompare(bVal) * sortOrder;
  });

  
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginated = filtered.slice(start, end);

  res.json({
    total: filtered.length,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(filtered.length / limitNum),
    results: paginated,
  });
};

export const getWordByText = (req: Request, res: Response): void => {
  const { word } = req.params;
  const lower = word.toLowerCase();

  const result = (fullWordList as Word[]).find((entry) => entry.word.toLowerCase() === lower);

  if (!result) {
    res.status(404).json({ message: "Word not found" });
    return;
  }

  res.json({
  ...result,
  audioUrl: `https://api.dictionaryapi.dev/media/pronunciations/en/${result.word}-us.mp3`
  });
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

export const getRandomWord = (req: Request, res: Response): void => {
  const list = fullWordList as Word[];
  const random = list[Math.floor(Math.random() * list.length)];
  res.json(random);
};

export const getWordById = (req: Request, res: Response): void => {
  const { id } = req.params;

  const allWords = [...curatedWordList, ...(fullWordList as Word[])];

  const result = allWords.find((entry) => entry.id === id);

  if (!result) {
    res.status(404).json({ message: "Word with given ID not found" });
    return;
  }

  res.json({
    ...result,
    audioUrl: `https://api.dictionaryapi.dev/media/pronunciations/en/${result.word}-us.mp3`
  });
};

