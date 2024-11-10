import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response.text()) {
      throw new Error('Empty response from Gemini API');
    }
    
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key configuration');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      throw new Error(`Gemini API error: ${error.message}`);
    }
    
    throw new Error('Failed to generate content with Gemini');
  }
}