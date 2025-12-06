// AI Assistant Logic
document.addEventListener('DOMContentLoaded', () => {
  const chatWidget = document.createElement('div');
  chatWidget.className = 'ai-assistant';
  chatWidget.innerHTML = `
    <div class="assistant-header">
      <span>Ask me anything! 🤖</span>
      <button class="close-btn">&times;</button>
    </div>
    <div class="chat-box" id="chat-box">
      <p><b>Bot:</b> Hi! Ask me about Ntokozo's skills, projects, or certifications.</p>
    </div>
    <div class="chat-input">
      <input type="text" id="user-input" placeholder="e.g., What projects has Ntokozo done?">
      <button class="send-btn" id="send-btn"><i class="fas fa-paper-plane"></i></button>
    </div>
  `;
  document.body.appendChild(chatWidget);

  const closeBtn = document.querySelector('.close-btn');
  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  closeBtn.addEventListener('click', () => {
    chatWidget.style.display = 'none';
  });

  function addMessage(sender, text) {
    chatBox.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;

    addMessage('You', msg);
    userInput.value = '';

    let reply = "Thinking...";
    addMessage('Bot', reply);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });

      const data = await response.json();
      chatBox.lastChild.remove(); // remove "Thinking..."
      addMessage('Bot', data.reply || "I couldn't get a response. Try again!");
    } catch (err) {
      chatBox.lastChild.remove();
      // Fallback reply
      const lower = msg.toLowerCase();
      if (lower.includes('skill')) {
        reply = "I work with Python, SQL, Airflow, AWS, GCP, Spark, and ETL pipelines.";
      } else if (lower.includes('project')) {
        reply = "I've built a Job Market Pipeline, Cloud ETL on GCP, and an E-commerce Data Warehouse.";
      } else if (lower.includes('cert')) {
        reply = "I'm certified in Google Data Engineering, AWS Data Analytics, and Databricks Lakehouse.";
      } else {
        reply = "I'm Ntokozo's AI assistant! Ask about his data engineering work.";
      }
      addMessage('Bot', reply);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});