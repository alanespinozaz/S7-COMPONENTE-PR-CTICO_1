const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// "Base de datos" en memoria (temporal)
let usuarios = [];
let idCounter = 1;

// Rutas
app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.post("/usuarios", (req, res) => {
  const usuario = { id: idCounter++, ...req.body };
  usuarios.push(usuario);
  res.json(usuario);
});

app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = usuarios.findIndex((u) => u.id === id);
  if (index !== -1) {
    usuarios[index] = { id, ...req.body };
    res.json(usuarios[index]);
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  usuarios = usuarios.filter((u) => u.id !== id);
  res.json({ message: "Usuario eliminado" });
});

// Ruta raíz para evitar "No se puede obtener /"
app.get("/", (req, res) => {
  res.send("Servidor funcionando ✅");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
