// src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [form, setForm] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    genero: "",
    ciudad: ""
  });
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.dni || !form.nombres || !form.apellidos || !form.fecha_nacimiento || !form.genero || !form.ciudad) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (editId) {
      await fetch(`http://localhost:4000/usuarios/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:4000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ cedula: "", nombres: "", apellidos: "", fecha_nacimiento: "", genero: "", ciudad: "" });
    const data = await fetch("http://localhost:4000/usuarios").then((res) => res.json());
    setUsuarios(data);
  };

  const handleEdit = (usuario) => {
    setForm(usuario);
    setEditId(usuario.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/usuarios/${id}`, { method: "DELETE" });
    const data = await fetch("http://localhost:4000/usuarios").then((res) => res.json());
    setUsuarios(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">Gestión de Usuarios</h2>

      {/* FORMULARIO */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Cedula"
            name="dni"
            value={form.dni}
            onChange={handleChange}
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Nombres"
            name="nombres"
            value={form.nombres}
            onChange={handleChange}
          />
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Apellidos"
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
          />
          <input
            type="date"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            name="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={handleChange}
          />

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genero"
                value="Masculino"
                checked={form.genero === "Masculino"}
                onChange={handleChange}
              />
              Masculino
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genero"
                value="Femenino"
                checked={form.genero === "Femenino"}
                onChange={handleChange}
              />
              Femenino
            </label>
          </div>

          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
          >
            <option value="">Seleccione Ciudad</option>
            <option value="Quito">Quito</option>
            <option value="Guayaquil">Guayaquil</option>
            <option value="Cuenca">Cuenca</option>
            <option value="Milagro">Milagro</option>
          </select>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition"
          >
            {editId ? "Actualizar" : "Guardar"}
          </button>
        </form>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4 text-purple-700 text-center">Lista de Usuarios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-center">
            <thead>
              <tr className="bg-purple-200">
                <th className="border px-4 py-2">Cedula</th>
                <th className="border px-4 py-2">Nombres</th>
                <th className="border px-4 py-2">Apellidos</th>
                <th className="border px-4 py-2">Fecha Nacimiento</th>
                <th className="border px-4 py-2">Género</th>
                <th className="border px-4 py-2">Ciudad</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-purple-50 transition">
                  <td className="border px-4 py-2">{u.dni}</td>
                  <td className="border px-4 py-2">{u.nombres}</td>
                  <td className="border px-4 py-2">{u.apellidos}</td>
                  <td className="border px-4 py-2">{u.fecha_nacimiento}</td>
                  <td className="border px-4 py-2">{u.genero}</td>
                  <td className="border px-4 py-2">{u.ciudad}</td>
                  <td className="border px-4 py-2 flex justify-center gap-2">
                    <button
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 transition"
                      onClick={() => handleEdit(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      onClick={() => handleDelete(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
