import { Request, Response } from 'express';
import { PronunciationAttemptModel } from '../models/PronunciationAttempt';
import fullWordList from '../data/wordListWithIds.json';
import { curatedWordList } from '../data/curatedWordListWithIds';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { getFeedbackFromGPT } from '../services/gptFeedback';
import { scorePronunciation } from '../utils/scorePronunciation'; 
import { PronunciationAttempt } from '../models/PronunciationAttempt';
import { AuthenticatedRequest } from '../middleware/verifyToken';


import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});


export const submitPronunciationAttempt = async (req: Request, res: Response): Promise<void>   => {
  try {
    const { wordId, audioUrl, score, feedback } = req.body;
    const userId = (req as AuthenticatedRequest).user?.uid;

    if (!wordId || !audioUrl) {
      res.status(400).json({ message: 'wordId, and audioUrl are required' });
      return; 
    }

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: No user ID found' });
      return; 
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const attemptsToday = await PronunciationAttemptModel.countDocuments({
      userId,
      createdAt: { $gte: today },
    });

    const DAILY_LIMIT = 20;
    if (attemptsToday >= DAILY_LIMIT) {
      res
        .status(429)
        .json({ message: `Daily limit of ${DAILY_LIMIT} attempts reached. Try again tomorrow.` });
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
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID found' });
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
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID found' });
    return;
  }

  try {
    const attempt = await PronunciationAttemptModel.findById(attemptId);
    if (!attempt) {
      res.status(404).json({ message: 'Attempt not found' });
      return;
    }

    if (attempt.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to update this attempt' });
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
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID found' });
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

    const url = attempt.audioUrl;
    const fileNameWithExt = url.split('/').pop(); 
    const fileName = fileNameWithExt?.split('.')[0]; 
    const publicId = `audios/${fileName}`;

    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      console.log(`[CLOUDINARY] Deleted: ${publicId}`);
    } catch (cloudErr) {
      console.warn(`[CLOUDINARY] Failed to delete ${publicId}:`, cloudErr);
    }

    await PronunciationAttemptModel.findByIdAndDelete(attemptId);

    res.json({ message: 'Attempt and audio deleted' });
  } catch (error) {
    console.error('Error deleting attempt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserPronunciationAttempts = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json( { message: 'Unauthorized: No user ID found' });
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
  const { id: attemptId } = req.params;
  const userId = (req as AuthenticatedRequest).user?.uid;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized: No user ID found' });
    return;
  }

  if (!audioUrl) {
    res.status(400).json({ message: 'audioUrl is required' });
    return;
  }

  const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!assemblyApiKey) {
    res.status(500).json({ message: 'Server misconfigured: Missing AssemblyAI key' });
    return;
  }

  try {
    console.log('[DEBUG] Sending audio to AssemblyAI:', audioUrl);

    const { data: startRes } = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url: audioUrl },
      {
        headers: {
          authorization: assemblyApiKey,
          'content-type': 'application/json',
        },
      }
    );

    const transcriptId = startRes.id;
    console.log('[DEBUG] Transcript ID:', transcriptId);

    let status = 'queued';
    let transcriptText = '';

    while (status !== 'completed' && status !== 'error') {
      await new Promise((r) => setTimeout(r, 2000));

      const { data: pollRes } = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: assemblyApiKey,
          },
        }
      );

      status = pollRes.status;
      console.log('[DEBUG] Current status:', status);

      if (status === 'completed') {
        transcriptText = pollRes.text;
      } else if (status === 'error') {
        throw new Error(pollRes.error || 'Unknown AssemblyAI error');
      }
    }

    const attempt = await PronunciationAttemptModel.findById(attemptId);
    if (!attempt) {
      res.status(404).json({ message: 'Attempt not found' });
      return;
    }

    if (attempt.userId !== userId) {
      res.status(403).json({ message: 'Not authorized to transcribe this attempt' });
      return;
    }

    console.log('Attempt wordId:', attempt.wordId);

    const wordId = attempt.wordId;

    const wordEntry = (fullWordList as any[]).find(w => w.id === wordId) || (curatedWordList as any[]).find(w => w.id === wordId);
   
    if (!wordEntry) {
      console.warn(`[WARNING] No word entry found for ID: ${wordId}`);
      res.status(404).json({ message: `No matching word found for wordId: ${wordId}` });
      return;
    }

    const expectedWord = wordEntry.word;


    const score = scorePronunciation(expectedWord, transcriptText); 

    const gptFeedback = await getFeedbackFromGPT({ word: expectedWord, transcription: transcriptText });
    
    let finalFeedback = gptFeedback;

    if (!finalFeedback) {
      const cleanTranscript = transcriptText?.toLowerCase().replace(/[^\w\s]|_/g, '').trim();
      const cleanExpected = expectedWord?.toLowerCase().replace(/[^\w\s]|_/g, '').trim();

      finalFeedback = `Your pronunciation was transcribed as: "${cleanTranscript}".\nExpected word: "${cleanExpected}".\n\n`;

      if (cleanTranscript === cleanExpected) {
        finalFeedback += `✅ Excellent! Your pronunciation matches the target word. Great job!`;
      } else if (cleanTranscript.length === cleanExpected.length) {
        finalFeedback += `🧐 Very close! You might have minor pronunciation differences. Try to articulate each sound clearly.`;
      } else if (cleanTranscript.startsWith(cleanExpected[0])) {
        finalFeedback += `👂 It seems you're on the right track. Focus on finishing the word with clarity and confidence.`;
      } else {
        finalFeedback += `❗The beginning of the word differs. Practice starting with the correct sound — especially the initial consonants.`;
      }

      finalFeedback += `\n\nKeep practicing — you're improving with every attempt! 🎯`;
    }


    let updatedAttempt : PronunciationAttempt | null = null;
    if (attemptId) {
      updatedAttempt = await PronunciationAttemptModel.findByIdAndUpdate(
        attemptId,
        { feedback: finalFeedback, score },
        { new: true }
      );
    }

    res.status(200).json({
      transcription: transcriptText,
      feedback: finalFeedback,
      score,
      ...(updatedAttempt && { updatedAttempt }),
    });

  } catch (err: any) {
    console.error('[FATAL ERROR]', err.message || err);
    res.status(500).json({ message: 'Transcription failed', error: err.message || err });
  }
};
