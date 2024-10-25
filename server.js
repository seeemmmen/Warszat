// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb+srv://seeemmmen:Parol2017@web.omhac.mongodb.net/?retryWrites=true&w=majority&appName=Web");

// Определение схемы пользователя
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

const User = mongoose.model("User", userSchema);

// Middleware для обработки JSON
app.use(bodyParser.json());
// Установка корневой директории для статических файлов
app.use(express.static(__dirname));

// Маршрут для регистрации
app.post("/register", async (req, res) => {
  const { username, password ,email} = req.body;
  if (!username || !password || !email  ) {
    return res.status(400).json({ message: "Wpisz swoją nazwę użytkownika i hasło oraz adres e-mail" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword ,email});
    await newUser.save();
    res.status(201).json({ message: "Użytkownik zarejestrował się pomyślnie" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
