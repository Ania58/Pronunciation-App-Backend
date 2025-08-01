import axios from 'axios';

export const getFeedbackFromGPT = async ({
  word,
  transcription,
  score,
}: {
  word: string;
  transcription: string;
  score: number;
}) => {
  try {
    const formatWordForPrompt = (word: string) => {
      return word.startsWith("'") ? word : `"${word}"`;
    };

    const prompt = `A student attempted to pronounce the word ${formatWordForPrompt(word)}. The AI transcribed it as ${formatWordForPrompt(transcription)}. The pronunciation score is ${score}/10.

    Give short, encouraging feedback (max 2–3 sentences). Mention the word ${formatWordForPrompt(word)}, and adjust your tone based on the score:
    - If the score is 9 or 10, praise the student with enthusiasm.
    - If the score is 6–8, mention it's good but could be improved slightly.
    - If the score is below 6, point out one helpful improvement.

    Be kind, positive, and supportive.`;

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
