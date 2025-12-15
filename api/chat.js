const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function (req, res) {
  // --- 1. YOUR KNOWLEDGE BASE ---
  const portfolioData = {
    "personal": {
      "name": "Ntokozo Ntombela",
      "role": "Data Engineer",
      "summary": "ICT Graduate specializing in ETL pipelines, Azure, and Databricks."
    },
    "education": {
      "degree": "BICT at DUT (Graduated 2025)",
      "modules": "Business Intelligence, Machine Learning, and Software Engineering."
    },
    "skills": [
      "Python", "SQL", "Azure Data Factory", "Databricks", "Spark", "Power BI"
    ],
    "projects": [
      "DevPulse (Job Tracker)",
      "SA Job Market Pipeline", 
      "AI Lyric Video Generator",
      "Databricks Sales Pipeline"
    ],
    "certifications": [
      "Azure Data Fundamentals (DP-900)",
      "Databricks Fundamentals",
      "IBM Spark Fundamentals"
    ],
    "contact": "ntombelan098@gmail.com"
  };

  // --- 2. SERVER LOGIC ---
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "⚠️ System Error: API Key is missing." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ FIX: Using "gemini-1.5-flash-001" (The specific stable version number)
    // This is safer than "latest" or generic names.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

    // --- 3. INSTRUCTIONS ---
    const systemPrompt = `
      You are Ntokozo's portfolio assistant.
      
      DATA: ${JSON.stringify(portfolioData)}

      RULES:
      1. Keep response UNDER 20 WORDS.
      2. Do NOT use bold text (no asterisks).
      3. Do NOT write paragraphs.
      4. If asked about a project, mention ONE project briefly and ask: "Want to hear about another?"
      5. Be casual and chatty.

      User asked: "${message}"
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(200).json({ 
      reply: `❌ AI Error: ${error.message}` 
    });
  }
};