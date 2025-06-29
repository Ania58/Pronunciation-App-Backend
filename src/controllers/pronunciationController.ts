import { Request, Response } from 'express';
import { PronunciationAttemptModel } from '../models/PronunciationAttempt';

export const submitPronunciationAttempt = async (req: Request, res: Response): Promise<void>   => {
  try {
    const { userId, wordId, audioUrl, score, feedback } = req.body;

    if (!userId || !wordId || !audioUrl) {
      res.status(400).json({ message: 'userId, wordId, and audioUrl are required' });
      return; 
    }

    const newAttempt = new PronunciationAttemptModel({
      userId,
      wordId,
      audioUrl,
      score: score ?? null,
      feedback: feedback ?? null,
    });

    await newAttempt.save();

    res.status(201).json({ message: 'Pronunciation attempt saved', attempt: newAttempt });
    return; 
  } catch (error) {
    console.error('Error saving pronunciation attempt:', error);
     res.status(500).json({ message: 'Server error' });
     return;
  }
};
