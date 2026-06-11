import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI functions will fall back to local responses.");
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    aiEnabled: !!ai,
    message: "NESA L5SWD Study Companion Server up and running." 
  });
});

// Endpoint: Dynamic AI Questions Generator
app.post("/api/gemini/quiz", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "AI service is inactive. Please configure your GEMINI_API_KEY under Settings > Secrets to generate dynamic quizzes."
    });
  }

  const { moduleId, moduleName, quantity = 5 } = req.body;

  try {
    const prompt = `
      You are an elite TVET examiner in Rwanda specializing in high-school and technical institute examinations under NESA.
      Generate exactly ${quantity} high-quality, realistic national exam questions in JSON format for the Level 5 Software Development (L5SWD) syllabus.
      Focus on the specific module: "${moduleName}" (Module ID: "${moduleId}").
      The question set should evaluate core concepts, practical syntax, technical systems, or real-world problem scenarios.
      For each question, provide a detailed, clear explanation citing references, standard code syntax, or industry conventions where relevant.

      Choose a mix of question types: either multiple choice ("multiple_choice") or short answer ("short_answer").
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are NESA's chief syllabus engineer for L5 Software Development. Deliver rigorous, accurate, Rwandan-syllabus-aligned questions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["questions"],
          properties: {
            questions: {
              type: Type.ARRAY,
              description: "List of generated questions",
              items: {
                type: Type.OBJECT,
                required: ["id", "type", "questionText", "correctAnswer", "explanation"],
                properties: {
                  id: { type: Type.STRING, description: "A unique short id, e.g., 'ai_q_01'" },
                  type: { type: Type.STRING, description: "Must be either 'multiple_choice' or 'short_answer'" },
                  questionText: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    description: "An array of 4 string options, required only for multiple_choice",
                    items: { type: Type.STRING } 
                  },
                  correctAnswer: { 
                    type: Type.STRING, 
                    description: "For multiple_choice, it must match one of the exact text strings in options. For short_answer, a brief 1-5 word expected keyword or phrase." 
                  },
                  explanation: { type: Type.STRING, description: "Detailed summary explaining why the answer is correct with code snippets if needed." }
                }
              }
            }
          }
        }
      }
    });

    const bodyText = response.text ? response.text.trim() : "{}";
    const data = JSON.parse(bodyText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate AI quiz", details: error.message });
  }
});

// Endpoint: Interactive Study Buddy AI Mentor
app.post("/api/gemini/chat", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "AI Study Buddy is currently offline. Define the GEMINI_API_KEY in secrets to communicate."
    });
  }

  const { message, history = [], moduleContext } = req.body;

  try {
    const formattedHistory = history.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = `
      You are "Kivu", a highly supportive and expert AI Study Buddy for Rwandan students preparing for their L5 Software Development (L5SWD) NESA TVET Exams.
      You are highly encouraging, clean, and focus purely on providing clear, accurate technical guidance.
      You explain complex topics simply, write syntax-clean snippets in Java/SQL/JavaScript/Shell and follow the NESA curriculum guidelines.
      Keep responses comprehensive yet highly formatted using Markdown with readable spacing, bold highlights, and code blocks.
      Current module in context: ${moduleContext || "General L5SWD Syllabus"}.
    `;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      },
      history: formattedHistory
    });

    const response = await chat.sendMessage({
      message: message
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ error: "Failed to query AI Study Buddy", details: error.message });
  }
});

// Integration with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In development mode, mount Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
