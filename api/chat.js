import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // --- 1. CONFIGURATION & DATA ---
  // We hardcode this data here to prevent "File Not Found" errors on the server
  const portfolioData = {
    "personal": {
      "name": "Ntokozo Ntombela",
      "role": "Data Engineer",
      "intro": "I am a Final-year ICT student and aspiring Data Engineer specializing in ETL pipelines, Cloud Analytics, and Automation."
    },
    "skills": [
      "Python", "SQL", "Apache Spark", "Azure Data Factory", 
      "Databricks", "Power BI", "Airflow", "ETL/ELT"
    ],
    "projects": [
      {
        "name": "Cloud-Scale Urban Mobility Analytics",
        "tools": "Azure Data Factory, SQL, Power BI",
        "desc": "End-to-end cloud pipeline analyzing urban traffic data."
      },
      {
        "name": "Job Market Analysis Pipeline",
        "tools": "Python, BeautifulSoup, Pandas",
        "desc": "Automated scraper and ETL pipeline to track job market trends."
      }
    ],
    "contact": {
      "email": "ntombelan098@gmail.com",
      "linkedin": "https://www.linkedin.com/in/ntokozo-ntombela-ba662235a/"
    }
  };

  // --- 2. SECURITY CHECKS ---
  // Only allow POST requests (sending messages)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // DEBUG: Check if the key exists on the server
  if (!apiKey) {
    console.error("❌ API Key is missing.");
    return res.status(200).json({ 
      reply: "⚠️ System Error: The API Key is missing in Vercel Settings. Please add GEMINI_API_KEY." 
    });
  }

  // --- 3. AI GENERATION LOGIC ---
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the Flash model for speed and free tier limits
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the AI portfolio assistant for Ntokozo Ntombela.
      
      Your Knowledge Base:
      ${JSON.stringify(portfolioData)}

      Instructions:
      1. Answer the user's question based strictly on the data above.
      2. Be friendly, professional, and concise.
      3. If asked about contact info, give the email.
      4. If asked about something not in the data, politely say you only know about Ntokozo's professional work.

      User Question: "${message}"
    `;

    // Send to Google
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Success! Send the answer back to the chat
    return res.status(200).json({ reply: text });

  } catch (error) {
    // --- 4. ERROR HANDLING ---
    console.error("Gemini API Error:", error);
    
    // Send the specific error to the chat so we can fix it
    return res.status(200).json({ 
      reply: `❌ Google API Error: ${error.message}. (Please check your Vercel logs or API Key)` 
    });
  }
}