import axios from 'axios';

export const getFeedbackFromGPT = async ({
  word,
  transcription,
}: {
  word: string;
  transcription: string;
}) => {
  try {
    const prompt = `A student attempted to pronounce the word "${word}". The AI transcribed it as "${transcription}". Give short, encouraging feedback (max 2–3 sentences). Mention the word "${word}", briefly highlight any pronunciation issues, and suggest one way to improve. Be positive and supportive.`;


    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/Mistral-7B-Instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('[GPT FEEDBACK ERROR]', err);
    return null;
  }
};
