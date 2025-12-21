import { GoogleGenAI } from "@google/genai";

/**
 * Generates a preview response using the Gemini API.
 * Follows @google/genai strict initialization and usage guidelines.
 */
export const generatePreview = async (prompt: string): Promise<string> => {
  // Use VITE_ prefix for client-side environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Missing VITE_GEMINI_API_KEY. Please set it in your environment variables.");
    throw new Error("Missing API Key");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-1.5-pro-001',
    'gemini-1.5-pro-002',
    'gemini-pro',
    'gemini-1.0-pro'
  ];

  let lastError;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        }
      });

      // Access the text property directly on the response object
      return response.text || "No response generated.";
    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message || error);
      lastError = error;
      // Continue to next model
    }
  }

  console.error("All models failed.");
  throw lastError;
};