import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Define your Context (The "Brain")
const context = `
Name: Ntokozo Ntombela
Role: Aspiring Data Engineer & Final-Year ICT Student at Durban University of Technology
Email: ntombelan098@gmail.com
GitHub: https://github.com/ntokozo078
LinkedIn: https://www.linkedin.com/in/ntokozo-ntombela-ba662235a/
Skills: Python, SQL, Airflow, AWS, GCP, Spark, Docker, ETL/ELT
Projects: Job Market Pipeline, Cloud ETL (Airflow + BigQuery), E-commerce Data Warehouse
Goal: Become a Cloud Data Engineer
`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  // --- STRATEGY 1: TRY GOOGLE GEMINI (The Fast/Smart Way) ---
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `You are Ntokozo's professional AI assistant. 
      Use this profile context to answer: ${context}
      User Question: ${message}
      Answer concisely and professionally.`;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({ reply: text });

    } catch (error) {
      console.error("Gemini failed, switching to backup:", error.message);
      // Don't return error yet! We will let it fall through to Strategy 2.
    }
  }

  // --- STRATEGY 2: FALLBACK TO OPENROUTER (Your Original Code) ---
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const prompt = `You are Ntokozo's AI assistant. Answer briefly.
      Context: ${context}
      User: "${message}"`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ntokozo078.github.io',
          'X-Title': 'Ntokozo Portfolio'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`OpenRouter Error: ${response.status}`);
      
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      return res.status(200).json({ reply });

    } catch (error) {
      console.error("OpenRouter failed:", error.message);
    }
  }

  // --- STRATEGY 3: FINAL FAILSAFE ---
  return res.status(200).json({ 
    reply: "I'm currently updating my servers. Please contact Ntokozo directly at ntombelan098@gmail.com." 
  });
}