import { Request, Response } from 'express';
import { PronunciationAttemptModel } from '../models/PronunciationAttempt';
import fetch from 'node-fetch';

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

export const getPronunciationAttempts = async (req: Request, res: Response): Promise<void> => {
  const { id: wordId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ message: 'Missing userId query parameter' });
    return;
  }

  try {
    const attempts = await PronunciationAttemptModel.find({ wordId, userId });
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching pronunciation attempts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePronunciationFeedback = async (req: Request, res: Response): Promise<void> => {
  const { id: attemptId } = req.params;
  const { feedback, score } = req.body;

  try {
    const attempt = await PronunciationAttemptModel.findById(attemptId);
    if (!attempt) {
      res.status(404).json({ message: 'Attempt not found' });
      return;
    }

    if (feedback) attempt.feedback = feedback;
    if (score !== undefined) attempt.score = score;

    await attempt.save();
    res.json({ message: 'Feedback updated', attempt });
    return;
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const deletePronunciationAttempt = async (req: Request, res: Response): Promise<void> => {
  const { id: attemptId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ message: 'Missing userId query parameter' });
    return;
  }

  try {
    const attempt = await PronunciationAttemptModel.findById(attemptId);

    if (!attempt) {
      res.status(404).json({ message: 'Attempt not found' });
      return;
    }

    if (attempt.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this attempt' });
      return;
    }

    await PronunciationAttemptModel.findByIdAndDelete(attemptId);
    res.json({ message: 'Attempt deleted' });
    return;
  } catch (error) {
    console.error('Error deleting attempt:', error);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const getUserPronunciationAttempts = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json( { message: 'Missing userId query parameter' });
    return;
  }

  try {
    const attempts = await PronunciationAttemptModel.find( {userId });
    res.json(attempts);
  } catch (error) {
    console.error('Error fetching user pronunciation attempts: ', error);
    res.status(500).json( { message: 'Server error' });
    return;
  }
};

export const transcribePronunciation = async (req: Request, res: Response): Promise<void> => {
  const { audioUrl } = req.body;

  if (!audioUrl) {
    res.status(400).json({ message: 'audioUrl is required' });
    return;
  }

  try {
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.buffer();

    const whisperRes = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        'Content-Type': 'audio/mpeg',
      },
      body: audioBuffer,
    });

    if (!whisperRes.ok) {
      const errorText = await whisperRes.text();
      throw new Error(`Whisper API error: ${errorText}`);
    }

    const result = await whisperRes.json() as { text: string };
    res.json({ transcription: result.text });

  } catch (error: any) {
    console.error('Transcription error:', error.message);
    res.status(500).json({ message: 'Error transcribing audio', error: error.message });
  }
};