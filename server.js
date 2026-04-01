// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY; // берём ключ из переменной окружения Render

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Запрос к OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    res.json({ message: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка подключения к ИИ 😢" });
  }
});

// Поддержка Render (или локально)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));