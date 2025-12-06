document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the Chat Widget HTML dynamically
    const chatWidget = document.createElement('div');
    chatWidget.className = 'ai-assistant';
    chatWidget.innerHTML = `
      <div class="assistant-header">
        <span>Ntokozo's AI 🤖</span>
        <button class="close-btn">&times;</button>
      </div>
      <div class="chat-box" id="chat-box">
        <p class="bot-msg"><b>Bot:</b> Hi! I'm powered by Gemini. Ask me about Ntokozo's projects, skills, or certifications.</p>
      </div>
      <div class="chat-input">
        <input type="text" id="user-input" placeholder="e.g., What is his tech stack?">
        <button class="send-btn" id="send-btn">➤</button>
      </div>
    `;
    
    // Add to the webpage
    document.body.appendChild(chatWidget);
  
    // 2. Select Elements
    const closeBtn = chatWidget.querySelector('.close-btn');
    const sendBtn = chatWidget.querySelector('#send-btn');
    const userInput = chatWidget.querySelector('#user-input');
    const chatBox = chatWidget.querySelector('#chat-box');
  
    // 3. Toggle Chat Visibility (Optional: You might want a trigger button elsewhere)
    closeBtn.addEventListener('click', () => {
      chatWidget.style.display = 'none';
      // Tip: You might want to create a small "Open Chat" button to bring it back!
    });
  
    // 4. Helper to add messages to the screen
    function addMessage(sender, text) {
      const msgDiv = document.createElement('p');
      msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
    }
  
    // 5. The Main Logic: Sending the message
    async function sendMessage() {
      const msg = userInput.value.trim();
      if (!msg) return;
  
      // A. Show User Message
      addMessage('You', msg);
      userInput.value = '';
  
      // B. Show "Thinking..."
      const loadingMsg = document.createElement('p');
      loadingMsg.innerHTML = `<i>Bot is thinking...</i>`;
      chatBox.appendChild(loadingMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
  
      try {
        // C. Call the Vercel API (Backend)
        // Note: using relative path '/api/chat' works automatically on Vercel
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg })
        });
  
        if (!response.ok) throw new Error('Network response was not ok');
  
        const data = await response.json();
        
        // D. Remove "Thinking..." and show real response
        chatBox.removeChild(loadingMsg);
        addMessage('Bot', data.reply);
  
      } catch (err) {
        // E. Fallback (Offline Mode / Error Handling)
        console.error("AI Error:", err);
        chatBox.removeChild(loadingMsg);
  
        // Simple keyword fallback if API fails
        let reply = "I'm having trouble reaching the server.";
        const lower = msg.toLowerCase();
        
        if (lower.includes('skill') || lower.includes('stack')) {
            reply = "I work with Python, SQL, Airflow, AWS, GCP, and Spark (Offline Mode).";
        } else if (lower.includes('project')) {
            reply = "I've built Job Market Pipelines and Cloud ETL systems (Offline Mode).";
        } else if (lower.includes('contact') || lower.includes('email')) {
            reply = "You can reach Ntokozo at ntombelan098@gmail.com (Offline Mode).";
        }
        
        addMessage('Bot', reply);
      }
    }
  
    // 6. Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  });