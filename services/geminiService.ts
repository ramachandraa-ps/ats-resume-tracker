import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to convert File to Base64 string
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const SYSTEM_PROMPT = `
You are an expert Resume Evaluator and ATS (Applicant Tracking System) specialist. 
Your goal is to educate students on how ATS systems read their resumes.
You are strict but fair. You do not judge the person, only the document's effectiveness for a machine.

Analyze the provided resume and return a structured JSON response.
Evaluate based on:
1. Formatting (simple fonts, no columns, standard headers).
2. Keywords (action verbs, hard skills).
3. Structure (Contact info, Education, Experience, Skills sections).
4. Content impact (metrics, clarity).

Provide a numeric score (0-100) where:
- 0-40: Poor (Not machine readable, major issues)
- 41-60: Needs Improvement (Missing sections, bad formatting)
- 61-80: Good (Readable, some keyword gaps)
- 81-100: Excellent (Optimized for ATS)

Important: Return ONLY valid JSON matching the schema.
`;

export const analyzeResume = async (file: File): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-flash-latest"; // Using a fast, multimodal capable model

  const filePart = await fileToGenerativePart(file);

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [
        filePart,
        {
          text: "Analyze this resume for ATS compatibility. Focus on structure, keywords, and formatting."
        }
      ]
    },
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
          summary: { type: Type.STRING, description: "2-3 sentence executive summary of the analysis" },
          formatting: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              issues: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          keywords: {
            type: Type.OBJECT,
            properties: {
              found: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 5 strong keywords found" },
              missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested missing industry keywords based on context" }
            }
          },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["present", "missing", "incomplete"] },
                feedback: { type: Type.STRING }
              }
            }
          },
          improvements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["critical", "important", "minor"] },
                text: { type: Type.STRING }
              }
            }
          }
        },
        required: ["overallScore", "summary", "formatting", "keywords", "sections", "improvements"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Failed to parse analysis results.");
  }
};
