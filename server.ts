import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Setup
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Influencer Data Collection & AI Scoring
  app.post("/api/influencers/score", async (req, res) => {
    const { handle, platform, metrics } = req.body;

    if (!handle || !platform || !metrics) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // In a real app, we would fetch data from Instagram/YouTube APIs here.
      // For this MVP, we'll use the provided metrics and let Gemini score them.

      const prompt = `
        Score this East African influencer based on the following metrics:
        Platform: ${platform}
        Handle: ${handle}
        Follower Count: ${metrics.followerCount}
        Engagement Rate: ${metrics.engagementRate}%
        Post Frequency: ${metrics.postFrequency} posts/week
        Growth Trajectory: ${metrics.growthTrajectory}%
        
        Provide a JSON response with:
        - score: overall performance score (0-100)
        - authenticityScore: audience authenticity (0-100)
        - consistencyScore: content consistency (0-100)
        - niche: array of relevant niche tags
        - reasoning: brief explanation of the score
      `;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              authenticityScore: { type: Type.NUMBER },
              consistencyScore: { type: Type.NUMBER },
              niche: { type: Type.ARRAY, items: { type: Type.STRING } },
              reasoning: { type: Type.STRING }
            },
            required: ["score", "authenticityScore", "consistencyScore", "niche", "reasoning"]
          }
        }
      });

      const result = JSON.parse(response.text);
      res.json(result);
    } catch (error) {
      console.error("AI Scoring Error:", error);
      res.status(500).json({ error: "Failed to score influencer" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
