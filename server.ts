import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// =====================================================
// LOAD ENVIRONMENT VARIABLES
// =====================================================

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// =====================================================
// PRAVAH - GEMINI AI CONFIGURATION
// =====================================================

// Change only this line to switch between supported Gemini models.
const GEMINI_MODEL = "gemini-3.6-flash";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) {
    console.warn("PRAVAH: GEMINI_API_KEY is missing.");
    return null;
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    console.log("PRAVAH Gemini AI: Connected Successfully");
    console.log(`PRAVAH Gemini Model: ${GEMINI_MODEL}`);
  }

  return aiClient;
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    system:
      "PRAVAH - AI Dam Break Flood Prediction & Disaster Management System",
    geminiConfigured: Boolean(GEMINI_API_KEY),
    geminiModel: GEMINI_MODEL,
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// GEMINI CHAT ENDPOINT
// =====================================================

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      context = {},
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        reply:
          "PRAVAH AI is currently unavailable because the Gemini API key is not configured. Please check the .env file.",
        mode: "offline",
      });
    }

    // =================================================
    // SYSTEM INSTRUCTION
    // =================================================

    const systemInstruction = `
You are PRAVAH AI, an intelligent Dam Safety, Flood Prediction,
and Disaster Management Assistant for India.

PRAVAH stands for Predictive Risk Assessment & Vigilance for Aquatic Hazards.

Your responsibilities:

1. Explain dam water levels and reservoir conditions.
2. Analyze flood risks using available telemetry and weather data.
3. Explain rainfall, discharge, and river conditions.
4. Provide emergency evacuation instructions.
5. Help users find shelters and safe routes.
6. Assist dam engineers, disaster management officials, NDRF, SDRF, CWC, and citizens.
7. Support Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and English.
8. Provide clear and concise answers.
9. Prioritize human safety during emergencies.
10. Never invent real-time emergency data.
11. If live information is unavailable, clearly mention that.

Current System Context:
${JSON.stringify(context)}

Answer the user's question accurately and professionally.
If an immediate danger is detected, clearly recommend emergency action.
`;

    // =================================================
    // CONVERSATION HISTORY
    // =================================================

    const contents = [
      ...history.map((h: any) => ({
        role:
          h.role === "assistant" || h.role === "model"
            ? "model"
            : "user",
        parts: [
          {
            text: h.content || h.text || "",
          },
        ],
      })),
      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    // =================================================
    // GEMINI API REQUEST
    // =================================================

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        maxOutputTokens: 1000,
      },
    });

    const reply = response.text || "No response generated.";

    console.log("PRAVAH Gemini Response Generated");

    return res.json({
      reply,
      mode: "live",
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    return res.status(500).json({
      error: error?.message || "Failed to process AI query",
      reply:
        "PRAVAH AI is temporarily unavailable. Please try again shortly.",
      mode: "error",
    });
  }
});

// =====================================================
// GEMINI AI RISK ANALYSIS
// =====================================================

app.post("/api/gemini/risk-analysis", async (req, res) => {
  try {
    const {
      damData,
      weatherData,
      terrainData,
    } = req.body;

    const ai = getGenAI();

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API is not configured.",
        mode: "offline",
      });
    }

    const prompt = `
Analyze the following dam hydrology and meteorological parameters.

Dam Data:
${JSON.stringify(damData)}

Weather Data:
${JSON.stringify(weatherData)}

Terrain/Catchment Data:
${JSON.stringify(terrainData)}

Generate a structured Explainable AI Flood Risk Analysis.

Include:

1. Executive Summary
2. Flood Risk Level
3. Three Primary Hydrological Risk Drivers
4. Estimated Peak Breach Discharge Arrival Window
5. Four Operational Directives for Dam Safety Units
6. Recommended Actions for NDRF / SDRF Teams
7. Public Safety Recommendations

Do not invent live measurements.
Clearly distinguish between simulated data and actual observations.
`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `
You are the Chief AI Hydrological Specialist supporting
the Central Water Commission (CWC) and National Disaster Management Authority (NDMA).

Provide technically rigorous but understandable assessments.
Prioritize public safety and operational clarity.
        `,
        temperature: 0.3,
        maxOutputTokens: 1500,
      },
    });

    return res.json({
      analysis: response.text || "No analysis generated.",
      mode: "live",
      model: GEMINI_MODEL,
    });
  } catch (error: any) {
    console.error("Gemini Risk Analysis Error:", error);

    return res.status(500).json({
      error: error?.message || "Risk analysis failed",
    });
  }
});

// =====================================================
// VITE DEVELOPMENT / PRODUCTION SERVER
// =====================================================

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: "spa",
      });

      app.use(vite.middlewares);

      console.log("Vite Development Server Enabled");
    } else {
      const distPath = path.join(process.cwd(), "dist");

      app.use(express.static(distPath));

      app.use((req, res, next) => {
        if (req.path.startsWith("/api")) {
          return next();
        }

        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==========================================");
      console.log("PRAVAH COMMAND SERVER");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(
        `Gemini AI: ${GEMINI_API_KEY ? "CONNECTED" : "NOT CONFIGURED"}`
      );
      console.log(`Gemini Model: ${GEMINI_MODEL}`);
      console.log("==========================================");
    });
  } catch (error) {
    console.error("Server Startup Error:", error);
  }
}

startServer();