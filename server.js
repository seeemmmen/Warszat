// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser'); // Dodajemy cookie-parser do obsługi ciasteczek

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
mongoose.connect("mongodb+srv://seeemmmen:Parol2017@cluster0.y8ytq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  name: String,         // Imię
  lastname: String,     // Nazwisko
  gender: String,       // Płeć
  address: String,      // Adres
  bio: String           // Biografia
});

const User = mongoose.model("User", userSchema);
const SECRET_KEY = "your_secret_key"; // Klucz do generowania tokenów JWT

// Middleware do obsługi JSON
app.use(bodyParser.json());
// Ustawienie katalogu głównego do plików statycznych
app.use(express.static(__dirname));
// Trasa logowania
app.use(cookieParser()); // Do obsługi ciasteczek

// Trasa logowania
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Wpisz swoją nazwę użytkownika i hasło" });
  }

  try {
    const user = await User.findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY); // Generujemy token JWT

        // Ustawiamy token jako cookie httpOnly
        res.cookie("authToken", token, {
          httpOnly: true,
          secure: true, // Ustaw na true dla HTTPS
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dni w milisekundach
        });

        return res.status(200).json({ message: "Pomyślne logowanie" });
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



app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});
