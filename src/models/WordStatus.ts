import mongoose from 'mongoose';

const wordStatusSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  wordId: { type: String, required: true },
  status: { type: String, enum: ['mastered', 'practice'], required: true },
}, { timestamps: true });

export const WordStatus = mongoose.model('WordStatus', wordStatusSchema);
