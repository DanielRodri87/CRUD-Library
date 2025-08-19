const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão Supabase
const supabaseUrl = "https://rzxbiyksprouzsowwnwn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eGJpeWtzcHJvdXpzb3d3bnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MzU2MDYsImV4cCI6MjA3MTExMTYwNn0.buBHjAIYGr8V_P9GFPGtI0_1dWsFXevMxMUepVuchu0";
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota para inserir livros
app.post("/livros", async (req, res) => {
  try {
    const { titulo, autor, num_pag, ano_pub } = req.body;

    const { data, error } = await supabase
      .from("livros")
      .insert([{ titulo, autor, num_pag, ano_pub, flag_sucesso: "OK" }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Livro cadastrado!", data });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor: " + err.message });
  }
});

// Rota para listar livros
app.get("/livros", async (req, res) => {
  const { data, error } = await supabase.from("livros").select("*");

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});
