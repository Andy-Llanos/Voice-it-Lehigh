import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { Sentiment, SentimentAnalysisResult } from "../types";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Helper function to call AWS Bedrock model.
 */
const invokeModel = async (prompt: string, modelId: string): Promise<string> => {
  try {
    const command = new InvokeModelCommand({
      modelId,
      contentType: "text/plain",
      body: new TextEncoder().encode(prompt),
    });

    const response = await client.send(command);
    const output = new TextDecoder().decode(response.body);
    return output;
  } catch (error) {
    console.error("AWS Bedrock error:", error);
    return "";
  }
};

export const checkProfanity = async (text: string): Promise<boolean> => {
  const prompt = `Detect if the following text contains any inappropriate or offensive language. Respond with only "true" or "false".
  Text: "${text}"`;

  const modelId = "anthropic.claude-3-sonnet-20240229-v1:0"; // Or another suitable Bedrock model
  const output = await invokeModel(prompt, modelId);

  return output.trim().toLowerCase() === "false"; // true = safe, false = contains profanity
};


/**
 * Analyzes the sentiment of text using Bedrock.
 */
export const analyzeSentiment = async (text: string): Promise<SentimentAnalysisResult> => {
  const prompt = `Analyze the following feedback text and respond in JSON with two keys: 
  "sentiment" (POSITIVE, NEGATIVE, or NEUTRAL) and "summary" (a short summary). 
  Feedback: "${text}"`;

  const modelId = "anthropic.claude-3-sonnet-20240229-v1:0"; // Example model
  const jsonText = await invokeModel(prompt, modelId);

  try {
    const result = JSON.parse(jsonText);

    const sentiment =
      Object.values(Sentiment).find(s => s.toLowerCase() === result.sentiment?.toLowerCase()) ||
      Sentiment.NEUTRAL;

    return { sentiment, summary: result.summary || "No summary generated." };
  } catch (error) {
    console.error("Error parsing sentiment JSON:", error);
    return { sentiment: Sentiment.NEUTRAL, summary: "Could not analyze sentiment." };
  }
};
