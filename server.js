// server.js
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // если Node.js < 18, установи через npm i node-fetch

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI ключ из переменных окружения Render
const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты дружелюбный AI помощник." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ reply: "Ошибка сервера 😢" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Ошибка сервера 😢" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});