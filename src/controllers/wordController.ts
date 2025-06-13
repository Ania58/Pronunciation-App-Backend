import { Request, Response } from 'express';

export const getSampleWords = (req: Request, res: Response) => {
  res.json([
    { word: "cat", ipa: "/kæt/" },
    { word: "thought", ipa: "/θɔːt/" },
    { word: "record", ipa: "/ˈrek.ɔːd/" }
  ]);
};
