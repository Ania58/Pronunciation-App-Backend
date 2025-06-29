import mongoose, { Schema, Document } from 'mongoose';

export interface PronunciationAttempt extends Document {
  userId: string;
  wordId: string;
  audioUrl: string;
  score?: number;              
  feedback?: string;           
  createdAt: Date;
}

const PronunciationAttemptSchema = new Schema<PronunciationAttempt>({
  userId: { type: String, required: true },
  wordId: { type: String, required: true },
  audioUrl: { type: String, required: true },
  score: { type: Number },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const PronunciationAttemptModel = mongoose.model<PronunciationAttempt>(
  'PronunciationAttempt',
  PronunciationAttemptSchema
);
