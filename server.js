// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;
const transporter = nodemailer.createTransport({
  service: "Yahoo",
  auth: {
    user: 'warsztatpl@yahoo.com', // Replace with your Yahoo email
    pass: 'Parol2017pl' // Replace with your Yahoo app password
  }
});
mongoose.connect("mongodb+srv://seeemmmen:Parol2017@web.omhac.mongodb.net/?retryWrites=true&w=majority&appName=Web");

// Определение схемы пользователя
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  name: String,         // Имя
  lastname: String,     // Фамилия
  gender: String,       // Пол
  address: String,      // Адрес
  bio: String           // Биография
});

const User = mongoose.model("User", userSchema);
const SECRET_KEY = "your_secret_key"; // Для генерации JWT токенов

// Middleware для обработки JSON
app.use(bodyParser.json());
// Установка корневой директории для статических файлов
app.use(express.static(__dirname));
// Маршрут для логина
// server.js
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Wpisz swoją nazwę użytkownika i hasło" });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (isMatch) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({ message: "Pomyślne logowanie", token });
      } else {
        return res.status(401).json({ message: "Nieprawidłowe hasło" });
      }
    } else {
      return res.status(401).json({ message: "Nie znaleziono użytkownika" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Błąd serwera" });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user; 
      next();
  });
};
// Маршрут для регистрации
app.post("/register", async (req, res) => {
  const { username, password ,email} = req.body;
  const user = await User.findOne({ username });
  if(user){
    return res.status(400).json({ message: "Takij użytkownik już jest" });
  }
  if (!username || !password || !email  ) {
    return res.status(400).json({ message: "Wpisz swoją nazwę użytkownika i hasło oraz adres e-mail" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword ,email});
    await newUser.save();



    // Отправка уведомления на почту
    const mailOptions = {
      from: 'warsztatpl@yahoo.com',
      to: email,
      subject: 'Warsztat',
      text: `Спасибо за регистрацию, ${username}!`
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });




    res.status(201).json({ message: "Użytkownik zarejestrował się pomyślnie" });
    
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera" });
  }
});



app.post("/about-me", authenticateToken, async (req, res) => {
  const { name, lastname, gender, address, bio } = req.body;

  try {
      const user = await User.findOne({ username: req.user.username });
      if (!user) {
          return res.status(404).json({ message: "Пользователь не найден" });
      }
      
      user.name = name;
      user.lastname = lastname;
      user.gender = gender;
      user.address = address;
      user.bio = bio;
      await user.save();

      res.status(200).json({ message: "Информация обновлена успешно" });
  } catch (error) {
      res.status(500).json({ message: "Ошибка сервера" });
  }
});



app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});