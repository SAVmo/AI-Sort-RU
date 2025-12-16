import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates or edits an image based on a text prompt and an optional reference image.
 * Uses the "nano banana" (gemini-2.5-flash-image) model.
 */
export const generateImageContent = async (
  prompt: string,
  base64ImageContext?: string
): Promise<{ text: string; image?: string }> => {
  try {
    const parts: any[] = [];

    // If we have an existing image, we send it to the model to "edit" or use as reference
    if (base64ImageContext) {
      // Ensure we strip the data URL prefix if it exists before sending to API
      const cleanBase64 = base64ImageContext.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
      
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png', // Assuming PNG for simplicity/compatibility
        },
      });
    }

    // Add the text prompt
    parts.push({
      text: prompt,
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      // Note: nano banana models do not support responseMimeType or responseSchema
    });

    let resultText = "";
    let resultImage = undefined;

    // Parse response to find text and image parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          resultText += part.text;
        }
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          // Construct a displayable data URL
          resultImage = `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }

    return { text: resultText, image: resultImage };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};