// api/chat.js
const { fetch } = require('undici');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;

  // Your portfolio context
  const context = `
Name: Ntokozo Ntombela
Role: Aspiring Data Engineer & Final-Year ICT Student at Durban University of Technology
Email: ntombelan098@gmail.com
GitHub: https://github.com/ntokozo078
LinkedIn: https://www.linkedin.com/in/ntokozo-ntombela-ba662235a/
Skills: Python, SQL, Airflow, AWS, GCP, Spark, Docker, ETL/ELT
Projects: Job Market Pipeline, Cloud ETL (Airflow + BigQuery), E-commerce Data Warehouse
Goal: Become a Cloud Data Engineer
  `.trim();

  const prompt = `You are Ntokozo's AI assistant. Answer briefly and professionally.
User: "${message}"
Context: ${context}
Response:`

  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('AI Error: Missing OPENROUTER_API_KEY');
      return res.status(500).json({ reply: 'Sorry! I’m having trouble connecting.' });
    }

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

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('AI Error: HTTP', response.status, errText);
      throw new Error(`OpenRouter request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "I'm not sure. Ask about Ntokozo's projects or skills.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ reply: 'Sorry! I’m having trouble connecting.' });
  }
};