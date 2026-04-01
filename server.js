// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// Берём ключ из переменной окружения Render
const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("Пользовательское сообщение:", userMessage);
    console.log("API ключ присутствует?", !!API_KEY);

    if (!API_KEY) {
      console.error("API ключ отсутствует!");
      return res.status(500).json({ message: "Ошибка подключения к ИИ: отсутствует ключ" });
    }

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
    console.log("Ответ OpenAI:", data);

    // Проверяем наличие ответа
    if (data.error) {
      console.error("Ошибка OpenAI:", data.error);
      return res.status(500).json({ message: `Ошибка OpenAI: ${data.error.message}` });
    }

    if (!data.choices || !data.choices[0].message) {
      return res.status(500).json({ message: "Пустой ответ от OpenAI" });
    }

    res.json({ message: data.choices[0].message.content });
  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ message: "Ошибка подключения к ИИ 😢" });
  }
});

// Поддержка Render (или локально)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));