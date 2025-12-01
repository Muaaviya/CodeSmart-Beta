
import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";

type AIReport = {
    score: number;
    strengths: string[];
    improvements: string[];
    verdict: string;
};

function isValidReport(data: any): data is AIReport {
    return (
        typeof data?.score === "number" &&
        Array.isArray(data?.strengths) &&
        data.strengths.length === 3 &&
        Array.isArray(data?.improvements) &&
        data.improvements.length === 3 &&
        typeof data?.verdict === "string"
    );
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function generateReport(code: string, language: string): Promise<AIReport> {
    try {
        const generationConfig = {
            temperature: 0.3,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const parts = [
            {
                text: `
                    You are a senior software engineer with decades of experience in building, reviewing, and shipping production software systems.
                                
                    Analyze the following ${language} code and produce a professional evaluation report.
                                
                    CODE:
                    ${code}
                                
                    STRICT INSTRUCTIONS:
                    - Respond ONLY in valid JSON.
                    - Do NOT include markdown, explanations, or extra text.
                    - Do NOT wrap the JSON in code blocks.
                    - Ensure the JSON is valid and parsable.
                                
                    JSON OUTPUT FORMAT (must follow exactly):
                    {
                      "score": <integer between 0 and 10>,
                      "strengths": [
                        "Strength 1",
                        "Strength 2",
                        "Strength 3"
                      ],
                      "improvements": [
                        "Improvement 1",
                        "Improvement 2",
                        "Improvement 3"
                      ],
                      "verdict": "One-sentence professional summary"
                    }
                                
                    RULES:
                    - Score must reflect overall code quality.
                    - Strengths must be realistic and relevant.
                    - Improvements must be actionable and technical.
                    - Verdict should summarize quality + direction in one sentence.
                    `,
            },
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });

        const response = result.response;
        const reportText = response.text().trim();

        const parsed = JSON.parse(reportText);

        if (!isValidReport(parsed)) {
            throw new Error("AI returned invalid JSON structure");
        }

        return parsed;
    } catch (error) {
        console.error("Error generating report:", error);

        return {
            score: 0,
            strengths: [],
            improvements: [],
            verdict: "AI evaluation failed. Please retry.",
        };
    }
}
