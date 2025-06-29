import { Request, Response } from 'express';
import { WordStatus } from '../models/WordStatus';

export const updateWordStatus = async (req: Request, res: Response) => {
  const { id: wordId } = req.params;
  const { status, userId } = req.body;

  if (!['mastered', 'practice'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const existing = await WordStatus.findOne({ wordId, userId });

    if (existing) {
      existing.status = status;
      await existing.save();
      return res.json({ message: 'Status updated', wordId, status });
    } else {
      const newStatus = new WordStatus({ wordId, userId, status });
      await newStatus.save();
      return res.status(201).json({ message: 'Status created', wordId, status });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
