import { GoogleGenAI } from "@google/genai";

/**
 * Generates a preview response using the Gemini API.
 * Follows @google/genai strict initialization and usage guidelines.
 */
export const generatePreview = async (prompt: string): Promise<string> => {
  // Always use the required initialization pattern for GoogleGenAI with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    // Access the text property directly on the response object
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};