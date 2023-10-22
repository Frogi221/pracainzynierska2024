const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const salt = 10;

const app = express();
app.use(cors(
    {
        origin: "http://localhost:3000", // Adres URL twojego frontendu
        methods: "POST, GET, PUT, DELETE",
        credentials: true,
    }));
app.use(express.json());
app.use(cookieParser());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) =>{
        if(err) return res.json({Error: "Error for hashing password"});

        const values = [
            req.body.name,
            req.body.email,
            hash
        ];

        db.query(sql, [values], (err, data) =>{
            if(err) {
                return res.json("Error");
            }
            return res.json(data);
        });
    });
});
/*
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password ], (err, data) =>{
        if(err) {
            console.error(err);
            return res.json("Eror");
        }
        console.log(data);
        if(data.length > 0){

            return res.json("Success");
        } else {
            return res.json("Failed")
        }
    })
})
*/
app.post('/login', (req, res) =>{
    const sql = `SELECT * FROM login where email = ?`;
    db.query(sql, [req.body.email], (err, data) => {
        if(err) return res.json({Error: "Login error in server"});
        if(data.length > 0) {
            bcrypt.hash(req.body.password.toString(), data[0].password, (err, response) => {
                if(err) return res.json({Error: "Password compare error"});
                if(response) {
                    const name = data[0].name
                    const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json("Success");
                } else {
                    return res.json({Error: "Password not matched"});
                }
            })
        } else {
            return res.json({Error: "No email existed"});
        }
    });
});


app.post('/zdarzenie', (req, res) => {
    const sql = "INSERT INTO zdarzenia (`data`,`godzina`,`lokalizacja`,`opis`) VALUES (?)";
    const values = [
        req.body.data,
        req.body.godzina,
        req.body.lokalizacja,
        req.body.opis,
    ]
    db.query(sql, [values], (err, data) =>{
        if(err) {
            return res.json("Eror");
        }
        return res.json(data);
    })
})

app.get("/zdarzenia", (req, res) => {
    const sql = "SELECT * FROM zdarzenia"; // Zmień na odpowiednie zapytanie SQL
    db.query(sql, (err, result) => {
      if (err) {
        console.log("Błąd podczas pobierania zdarzeń: " + err);
        res.status(500).json("Błąd");
        return;
      }
      console.log("Pobrano zdarzenia z bazy danych");
      res.status(200).json(result);
    });
  });

  app.get("/uzytkownicy", (req, res) => {
    const sql = "SELECT id, name, email FROM login";
    db.query(sql, (err, result) => {
      if (err) {
        console.log("Błąd podczas pobierania użytkowników: " + err);
        res.status(500).json("Błąd");
        return;
      }
      console.log("Pobrano użytkowników z bazy danych");
      res.status(200).json(result);
    });
  });

  app.delete('/uzytkownicy/:id', (req, res) => {
    const userId = req.params.id;

    const sql = "DELETE FROM login WHERE id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Błąd serwera" });
        }
        return res.json({ Message: "Użytkownik został usunięty" });
    });
});

app.delete('/zdarzenia/:id', (req, res) => {
    const zdarzenieId = req.params.id;

    const sql = "DELETE FROM zdarzenia WHERE id = ?";
    db.query(sql, [zdarzenieId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Błąd serwera" });
        }
        return res.json({ Message: "Zdarzenie zostało usunięte" });
    });
});

  

app.listen(8081, ()=>{
    console.log("listening")
})