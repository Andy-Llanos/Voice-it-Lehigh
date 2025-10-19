
import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment, SentimentAnalysisResult } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you would not expose this in the client. This is for demonstration.
  // The key is expected to be in the environment.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Checks if the provided text contains profanity or inappropriate language.
 * @param text The text to analyze.
 * @returns A boolean indicating if the text is safe.
 */
export const checkProfanity = async (text: string): Promise<boolean> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following text for profanity, hate speech, or bullying intended for a university feedback platform. Respond with only a single word: 'safe' if it is clean, or 'unsafe' if it is inappropriate. Text: "${text}"`,
    });
    
    const resultText = response.text.trim().toLowerCase();
    return resultText === 'safe';
  } catch (error) {
    console.error("Error checking profanity:", error);
    // Fail safe: if API fails, assume it's unsafe to be cautious.
    return false;
  }
};

/**
 * Analyzes the sentiment of the provided text.
 * @param text The text to analyze.
 * @returns An object with sentiment and a summary.
 */
export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the sentiment of the following feedback text. Provide a one-sentence summary. Feedback: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              enum: [Sentiment.POSITIVE, Sentiment.NEGATIVE, Sentiment.NEUTRAL],
              description: "The sentiment of the feedback.",
            },
            summary: {
              type: Type.STRING,
              description: "A concise one-sentence summary of the feedback.",
            },
          },
          required: ["sentiment", "summary"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Ensure the sentiment value from API matches our enum
    const sentiment = Object.values(Sentiment).find(s => s.toLowerCase() === result.sentiment.toLowerCase()) || Sentiment.NEUTRAL;

    return { sentiment, summary: result.summary };

  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return {
      sentiment: Sentiment.NEUTRAL,
      summary: "Could not analyze sentiment.",
    };
  }
};
