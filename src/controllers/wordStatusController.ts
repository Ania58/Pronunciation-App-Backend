import { Request, Response } from 'express';
import { WordStatus } from '../models/WordStatus';

export const updateWordStatus = async (req: Request, res: Response): Promise<void>  => {
  const { id: wordId } = req.params;
  const { status, userId } = req.body;

  if (!['mastered', 'practice'].includes(status)) {
     res.status(400).json({ message: 'Invalid status value' });
     return;
  }

  if (!userId) {
    res.status(400).json({ message: 'Missing userId' });
    return; 
  }

  try {
    const existing = await WordStatus.findOne({ wordId, userId });

    if (existing) {
      existing.status = status;
      await existing.save();
      res.json({ message: 'Status updated', wordId, status });
      return; 
    } else {
      const newStatus = new WordStatus({ wordId, userId, status });
      await newStatus.save();
       res.status(201).json({ message: 'Status created', wordId, status });
       return;
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
    return; 
  }
};
