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
    
    // Attempting the most standard model first
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are Ntokozo's portfolio assistant.
      DATA: ${JSON.stringify(portfolioData)}
      RULES:
      1. Keep response UNDER 20 WORDS.
      2. Do NOT use bold text.
      3. Be casual.
      User asked: "${message}"
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    
    // --- 🔍 DEBUGGER: LIST AVAILABLE MODELS ---
    try {
        // This manually asks Google: "What models ARE allowed for this key?"
        const listReq = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listReq.json();
        
        // Extract just the names
        const modelNames = listData.models 
            ? listData.models.map(m => m.name.replace('models/', '')) 
            : ["No models found (Check your API Key permissions)"];

        return res.status(200).json({ 
            reply: `❌ DEBUG MODE: The model failed. \n\n Here are the models your key CAN access: \n ${modelNames.join(", ")}` 
        });
    } catch (e) {
        return res.status(200).json({ reply: `❌ Critical Error: ${error.message}` });
    }
  }
};