// script.js
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

function addMessage(message, sender) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  chatInput.value = "";

  try {
    const response = await fetch("https://ai-showcase-8jao.onrender.com/chat", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    addMessage(data.message, "bot"); // <- исправлено: server.js возвращает "message"
  } catch (error) {
    addMessage("Ошибка подключения к ИИ 😢", "bot");
  }
});