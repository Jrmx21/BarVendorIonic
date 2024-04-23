// server.js
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'RestauranteDB'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
  db.query(query, [username, password], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error en el servidor' });
      throw err;
    }
    if (result.length > 0) {
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  });
});

app.get('/productos', (req, res) => {
    const query = `SELECT * FROM productos`;
    db.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Error en el servidor' });
        throw err;
      }
      res.json(result);
    });
  });
  
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
