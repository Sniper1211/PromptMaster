import { GoogleGenAI } from "@google/genai";

export type AIProvider = 'gemini' | 'deepseek';

/**
 * Generates a preview response using the specified AI provider.
 */
export const generatePreview = async (prompt: string, provider: AIProvider = 'deepseek'): Promise<string> => {
  if (provider === 'deepseek') {
    return generateDeepSeekResponse(prompt);
  } else {
    return generateGeminiResponse(prompt);
  }
};

const generateGeminiResponse = async (prompt: string): Promise<string> => {
  // Use VITE_ prefix for client-side environment variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Missing VITE_GEMINI_API_KEY. Please set it in your environment variables.");
    throw new Error("Missing Gemini API Key");
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

  console.error("All Gemini models failed.");
  throw lastError;
};

const generateDeepSeekResponse = async (prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error("Missing VITE_DEEPSEEK_API_KEY. Please set it in your environment variables.");
    throw new Error("Missing DeepSeek API Key");
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response generated.";
  } catch (error: any) {
    console.error("DeepSeek generation failed:", error);
    throw error;
  }
};
