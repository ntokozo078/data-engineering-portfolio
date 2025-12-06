// test-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function checkModels() {
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.error("❌ No API Key found in .env.local");
    return;
  }

  console.log("🔑 Testing Key:", key.substring(0, 10) + "...");

  try {
    const genAI = new GoogleGenerativeAI(key);
    // This fetches the specific model list allowed for YOUR key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // We try to access the API metadata
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ SUCCESS! Here are the models valid for your key:");
      console.log("---------------------------------------------------");
      data.models.forEach(m => {
        // Only show chat models
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`👉 ${m.name.replace('models/', '')}`);
        }
      });
      console.log("---------------------------------------------------");
      console.log("Use one of the names above in your api/chat.js file!");
    } else {
      console.error("❌ ERROR response from Google:", data);
    }

  } catch (error) {
    console.error("❌ Failed to connect:", error.message);
  }
}

checkModels();