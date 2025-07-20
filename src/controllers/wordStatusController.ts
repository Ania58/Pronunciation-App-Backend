import { Request, Response } from 'express';
import { WordStatus } from '../models/WordStatus';
import { AuthenticatedRequest } from '../middleware/verifyToken';

export const updateWordStatus = async (req: Request, res: Response): Promise<void> => {
  const { id: wordId } = req.params;
  const { status } = req.body;
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!['mastered', 'practice'].includes(status)) {
    res.status(400).json({ message: 'Invalid status value' });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const existing = await WordStatus.findOne({ wordId, userId });

    if (existing) {
      existing.status = status;
      await existing.save();
      res.json({ message: 'Status updated', wordId, status });
    } else {
      const newStatus = new WordStatus({ wordId, userId, status });
      await newStatus.save();
      res.status(201).json({ message: 'Status created', wordId, status });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllStatuses = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const statuses = await WordStatus.find({ userId });

    const mapped: Record<string, 'mastered' | 'practice'> = {};
    for (const entry of statuses) {
      mapped[entry.wordId] = entry.status;
    }

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteWordStatus = async (req: Request, res: Response): Promise<void> => {
  const { id: wordId } = req.params;
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const deleted = await WordStatus.findOneAndDelete({ wordId, userId });
    if (!deleted) {
      res.status(404).json({ message: 'Status not found' });
      return;
    }

    res.json({ message: `Status for word ${wordId} deleted` });
  } catch (error) {
    console.error('Error deleting status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

