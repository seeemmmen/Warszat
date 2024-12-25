// server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser'); // Dodajemy cookie-parser do obsługi ciasteczek
const req = require("express/lib/request");
const res = require("express/lib/response");

const app = express();
const PORT = 3000;
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: 'rotbartsemen@zohomail.eu', // Zastąp swoją nazwą użytkownika Yahoo
    pass: 'Parol2017' // Zastąp hasłem aplikacji Yahoo
  }
});
app.use(session({
  secret: 'warsztat', // Секретный ключ для подписи сессий
  resave: false,      // Не пересохранять сессию, если она не изменялась
  saveUninitialized: false, // Не сохранять сессии, которые не были инициализированы
  cookie: {
    httpOnly: true,   // Ограничить доступ к cookie только через HTTP(S), защита от XSS
    secure: true,    // Установить в true, если используется HTTPS
    maxAge: 30 * 24 * 60 * 60 * 1000 // Время жизни cookie: 30 дней
  }
}));

mongoose.connect("mongodb+srv://seeemmmen:Parol2017@web.omhac.mongodb.net/?retryWrites=true&w=majority&appName=Web");

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  name: String,         // Имя
  lastname: String,     // Фамилия
  gender: String,       // Пол
  address: String,      // Адрес
  bio: String,          // Биография
  phone: String,        // Телефон
  birthdate: Date       // Дата рождения
});







const commentSchema = new mongoose.Schema({
  username: String,
  comment: String,
  rating: { type: Number, min: 1, max: 5 }, 
  timestamp: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);





const User = mongoose.model("User", userSchema);
const SECRET_KEY = "your_secret_key"; // Klucz do generowania tokenów JWT

// Middleware do obsługi JSON
app.use(bodyParser.json());
// Ustawienie katalogu głównego do plików statycznych
app.use(express.static(__dirname));
// Trasa logowania
app.use(cookieParser()); // Do obsługi ciasteczek

// Trasa logowania





app.post("/comments", async (req, res) => {
  const { comment, rating } = req.body;

  // Check if the user is logged in by checking session
  if (!req.session.user) {
      return res.status(403).json({ message: "You must be logged in to comment." });
  }

  const username = req.session.user.username;

  // Validation: Ensure comment and rating are provided
  if (!comment || !rating) {
      return res.status(400).json({ message: "Comment and rating are required." });
  }

  try {
      const newComment = new Comment({ username, comment, rating });
      await newComment.save();

      // Send a success response
      res.status(200).json({ message: "Comment saved successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Error posting comment", error });
  }
});

app.get("/comments", async (req, res) => {
  try {
      // Fetch the comments from the database
      const comments = await Comment.find();

      // Check if the user is logged in and get the username from the session
      const user = req.session.user ? req.session.user.username : null;

      // Send both the comments and the username (user) as a JSON response
      res.json({ comments, user });
  } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Error fetching comments", error });
  }
});





app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Wpisz swoją nazwę użytkownika i hasło" });
  }

  try {
    const user = await User.findOne({ username });
    var result=0;
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY); // Generujemy token JWT
        req.session.user = { 
          username: user.username, 
          email:user.email,
          name:user.name,
          lastname:user.lastname,
          bio:user.bio,
          gender:user.gender,
          address:user.address

        };
        result=1;
        // Ustawiamy token jako cookie httpOnly
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: true, // Ustaw na true dla HTTPS
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dni w milisekundach
        });
        return res.status(200).json({ message: "Pomyślne logowanie"});
      } else {
        return res.status(401).json({ message: "Nieprawidłowe hasło"});
      }
    } else {
      return res.status(401).json({ message: "Nie znaleziono użytkownika" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Błąd serwera" });
  }
});

// Middleware do weryfikacji tokena z ciasteczek
// Dodajemy to middleware dla tras, które wymagają autoryzacji

// Trasa rejestracji
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const user = await User.findOne({ username });
  if(user){
    return res.status(400).json({ message: "Tak użytkownik już istnieje" });
  }
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Wpisz swoją nazwę użytkownika, hasło oraz adres e-mail" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    // Wysyłanie powiadomienia na e-mail
    const mailOptions = {
      from: 'rotbartsemen@zohomail.eu',
      to: email,
      subject: 'Warsztat',
      html: `
  <!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dziękujemy za rejestrację</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 20px;
            line-height: 1.6;
        }
        .email-body h2 {
            color: #007bff;
            margin-top: 0;
        }
        .email-footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Dziękujemy za rejestrację!</h1>
        </div>
        <div class="email-body">
            <h2>Witaj! ${username}</h2>
            <p>Dziękujemy za rejestrację na naszej platformie. Jesteśmy zachwyceni, że do nas dołączyłeś/aś!</p>
            <p>Aby rozpocząć korzystanie z naszego serwisu, kliknij poniższy przycisk:</p>
            <p>Jeśli masz jakieś pytania, skontaktuj się z nami, odpowiemy najszybciej, jak to możliwe!</p>
            <p>Pozdrawiamy,<br>Zespół „Repair”</p>
        </div>
        <div class="email-footer">
            <p>© 2023 Warsztat „Repair”. Wszystkie prawa zastrzeżone.</p>
            <p>Jeśli nie rejestrowałeś/aś się na naszej platformie, zignoruj tę wiadomość.</p>
        </div>
    </div>
</body>
</html>

  `,
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email wysłany: ' + info.response);
      }
    });

    res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera" });
  }
});


app.post("/send-email", async (req, res) => {
  const { firstname, lastname, address, gender, bio } = req.body;
  console.log(req.session.user);
  // Проверьте, что все поля заполнены
  if (!firstname || !lastname || !address || !gender || !bio) {
      return res.status(400).json({ message: "Wszystkie pola muszą zostać wypełnione!" });
  }

  const mailOptions = {
      from: 'rotbartsemen@zohomail.eu',
      to: 'rotbartsemen@zohomail.eu', // Замените на ваш email
      subject: 'Nowe informacje z formularza',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #f9f9f9;">
        <p><strong>Imię:</strong> ${firstname}</p>
        <p><strong>Nazwizko:</strong> ${lastname}</p>
        <p><strong>Ulica:</strong> ${address}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Wiadomość:</strong></p>
        <div style="padding: 10px; background: #fff; border: 1px solid #eee; border-radius: 5px;">
          ${bio.replace(/\n/g, "<br>")}
        </div>
        <hr style="margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #aaa;">Warsztat.inc.</p>
      </div>
    `,
  };

  try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "E-mail został pomyślnie wysłany!" });
  } catch (error) {
      console.error("Ошибка отправки email:", error);
      res.status(500).json({ message: "Nie udało się wysłać wiadomości e-mail." });
  }
});
app.get("/account", (req, res) => {
  var result = 0; 
  if (req.session.user) {
      res.status(200).json(req.session.user);
  } else {
      res.status(401).json({ message: "Brak danych użytkownika. Zaloguj się!" });
  }
});

app.put("/account/update", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Proszę się zalogować." });
  }

  const { username } = req.session.user;
  const { name, lastname, gender, address, bio, phone, birthdate } = req.body;
  var check = 0; 

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { name, lastname, gender, address, bio, phone, birthdate },
      { new: true } // Zwraca zaktualizowany obiekt
    );

    if (updatedUser) {
      req.session.user = {
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.name,
        lastname: updatedUser.lastname,
        gender: updatedUser.gender,
        address: updatedUser.address,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        birthdate: updatedUser.birthdate
      };
      res.status(200).json({ message: "Informacje zostały zaktualizowane " + req.session.user.username, user: req.session.user, chekin: check });
    } else {
      res.status(404).json({ message: "Użytkownik nie został znaleziony." });
    }
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera.", error });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
      if (err) {
          console.error("Błąd podczas usuwania sesji:", err);
          return res.status(500).json({ message: "Nie udało się usunąć sesji." });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Sesja została pomyślnie usunięta." });
  });
});


app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});
