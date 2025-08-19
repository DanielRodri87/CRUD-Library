const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const supabase = require("./supabaseClient");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================================
// ROTAS LIVROS
// ================================

// Inserir livro
app.post("/livros", async (req, res) => {
  try {
    const { titulo, autor, num_pag, ano_pub, image } = req.body;

    const { data, error } = await supabase
      .from("livros")
      .insert([{ titulo, autor, num_pag, ano_pub, image, flag_sucesso: "OK" }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Livro cadastrado!", data });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});

// Listar todos os livros (todos os campos)
app.get("/livros", async (req, res) => {
  const { data, error } = await supabase.from("livros").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// Exibir livros (somente id, titulo, autor)
app.get("/livros/exibir", async (req, res) => {
  const { data, error } = await supabase.from("livros").select("id, titulo, autor");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

// Editar livro pelo id
app.put("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, num_pag, ano_pub, image } = req.body;

    const { data, error } = await supabase
      .from("livros")
      .update({ titulo, autor, num_pag, ano_pub, image })
      .eq("id", id)
      .select("*");

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: "Livro não encontrado" });

    res.json({ message: "Livro atualizado!", data });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});

// Remover livro pelo id
app.delete("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("livros")
      .delete()
      .eq("id", id)
      .select("*");

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: "Livro não encontrado" });

    res.json({ message: "Livro removido!", data });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});

// ================================
// INICIAR SERVIDOR
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
