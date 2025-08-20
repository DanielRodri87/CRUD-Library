<template>
  <div class="container">
    <!-- Lado esquerdo com ícone -->
    <div class="lado-esquerdo">
      <img :src="fundo" alt="Fundo" class="fundo" />
      <img :src="bookIcon" alt="Livro" class="book-icon" />
    </div>
  <div class="barra-meio">
    <div class="linha"></div>
  </div>

    <!-- Lado direito com formulário -->
    <div class="lado-direito">
      <h2>Cadastrar Livro</h2>
      <form @submit.prevent="addLivro" class="formulario">
        <label>
          Título
          <input v-model="form.titulo" placeholder="Informe o título" required />
        </label>

        <label>
          Autor
          <input v-model="form.autor" placeholder="Informe o autor" required />
        </label>

        <label>
          Páginas
          <input v-model.number="form.num_pag" placeholder="Informe a quantidade de páginas" type="number" min="1" required />
        </label>

        <label>
          Ano
          <input v-model.number="form.ano_pub" placeholder="Informe o ano de publicação" type="number" min="0" required />
        </label>

        <label>
          URL da Capa
          <input v-model="form.image" placeholder="Informe a URL da capa" type="url" required />
        </label>

        <button type="submit">Cadastrar</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import bookIcon from '../../assets/bookicon.png'; // <-- Importação correta da imagem
import fundo from '../../assets/fundo.png'; // <-- Importação correta da imagem

const form = ref({
  titulo: "",
  autor: "",
  num_pag: null,
  ano_pub: null,
  image: "",
});

const message = ref("");

const addLivro = async () => {
  try {
    const res = await fetch("http://localhost:3000/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (res.ok) {
      message.value = data.message || "Livro cadastrado com sucesso!";
      resetForm();
    } else {
      message.value = data.error || "Erro ao cadastrar livro.";
    }
  } catch {
    message.value = "Erro ao conectar ao servidor.";
  }
};

const resetForm = () => {
  form.value = { titulo: "", autor: "", num_pag: null, ano_pub: null, image: "" };
};
</script>

<style scoped>
/* Mantém o mesmo CSS do seu código anterior */
.container {
display: flex;
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background-color: #f6f5f2;
box-shadow: 0 6px 18px rgba(0,0,0,0.1);
z-index: 9999;
}

.lado-esquerdo {
  position: relative; /* <- importante para limitar o fundo */
  background-color: #A9927D;
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* evita que o fundo “vaze” */
}

.lado-direito {
 
flex: 190px;
padding: 40px 40px 190px 190px;
display: flex;
flex-direction: column;

}
.fundo {
  position: absolute;
  top: -10;
  left: 0;
  left: -30%;
  width: 180%;   /* aumenta o tamanho em relação ao container */
  height: 180%;
  object-fit: cover;
  z-index: 0; /* atrás do ícone */
  transform: scale(1.1); /* aumenta visualmente */
  opacity: 0.45;
}

.book-icon {
  width: 350px;
  height: auto;
  z-index: 1; /* ícone acima do fundo */
}



.lado-direito h2 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #22333b;
}
.barra-meio {
  position: absolute;
  top: 25%;
  bottom: 25%;
  left: 50%;
  width: 520px; /* aumentada a largura */
  left: calc(50% - 350px); /* move metade da largura para a esquerda */
  right: 54%;
  background: #f6f5f2;
  z-index: 0;
  transform: translateX(-50%);
  pointer-events: none;
  border-top-left-radius: 154px;
  border-bottom-left-radius: 154px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.formulario label {
  display: flex;
  max-width: 450px;
  width: 100%;
  flex-direction: column;
  font-weight: 600;
  color: #22333b;
}

.formulario input {
  margin-top: 6px;
  padding: 12px;
  border: 1.5px solid #22333b;

  font-size: 16px;
  transition: border-color 0.2s;
}

.formulario input:focus {
  border-color: #6c63ff;
  outline: none;
}

.formulario button {
  margin-top: 20px;
  padding: 14px; 
  max-width: 450px;
  background-color: #22333b;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  
  cursor: pointer;
  transition: background 0.2s;
}

.formulario button:hover {
  background-color: #5952d4;
}

.message {
  margin-top: 12px;
  color: #d9534f;
}
</style>
