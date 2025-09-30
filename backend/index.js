
// backend/index.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Conexión a SQLite
const db = new sqlite3.Database('./usuarios.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT NOT NULL,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    fecha_nacimiento TEXT NOT NULL,
    genero TEXT NOT NULL,
    ciudad TEXT NOT NULL
  )`);
});

// Crear usuario
app.post('/usuarios', (req, res) => {
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;
  if (!dni || !nombres || !apellidos || !fecha_nacimiento || !genero || !ciudad) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  db.run(`INSERT INTO usuarios (dni, nombres, apellidos, fecha_nacimiento, genero, ciudad) VALUES (?, ?, ?, ?, ?, ?)`,
    [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, dni, nombres, apellidos, fecha_nacimiento, genero, ciudad });
    });
});

// Listar usuarios
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Actualizar usuario
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { dni, nombres, apellidos, fecha_nacimiento, genero, ciudad } = req.body;
  db.run(`UPDATE usuarios SET dni=?, nombres=?, apellidos=?, fecha_nacimiento=?, genero=?, ciudad=? WHERE id=?`,
    [dni, nombres, apellidos, fecha_nacimiento, genero, ciudad, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Usuario actualizado' });
    });
});

// Eliminar usuario
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM usuarios WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Usuario eliminado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
