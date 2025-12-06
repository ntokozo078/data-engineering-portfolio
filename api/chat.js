import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // --- 1. HARDCODED DATA (Safe Mode) ---
  const portfolioData = {
    "personal": {
      "name": "Ntokozo Ntombela",
      "role": "Data Engineer",
      "summary": "Final-year ICT student and aspiring Data Engineer specializing in ETL pipelines, Cloud Analytics, and Automation."
    },
    "skills": [
      "Python", "SQL", "Apache Spark", "Azure Data Factory", "Databricks", 
      "Power BI", "Medallion Architecture", "Airflow"
    ],
    "projects": [
      {
        "name": "Cloud-Scale Urban Mobility Analytics",
        "tech": "Azure Data Factory, SQL, Power BI",
        "desc": "An end-to-end cloud pipeline analyzing urban traffic data."
      },
      {
        "name": "Job Market Analysis Pipeline",
        "tech": "Python, BeautifulSoup, Pandas",
        "desc": "Automated scraper and ETL pipeline to track job market trends."
      }
    ],
    "contact": {
      "email": "ntombelan098@gmail.com",
      "linkedin": "https://www.linkedin.com/in/ntokozo-ntombela-ba662235a/"
    }
  };

  // --- 2. CONFIG CHECKS ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ API Key is missing.");
    return res.status(200).json({ 
      reply: "⚠️ System Error: The API Key is missing in Vercel Settings." 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ FIX: Use the specific pinned version 'gemini-1.5-flash-001'
    // This is more stable than the generic aliases.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    const systemPrompt = `
      You are the AI portfolio assistant for Ntokozo Ntombela.
      Knowledge Base: ${JSON.stringify(portfolioData)}
      
      Instructions:
      1. Answer ONLY using the provided data.
      2. Be friendly and professional.
      3. If asked for contact info, provide the email.
      
      User Question: "${message}"
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // If even this fails, we send a helpful debug message
    return res.status(200).json({ 
      reply: `❌ Google Error: ${error.message}. (Try visiting https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey} to see which models are active for your key)` 
    });
  }
}