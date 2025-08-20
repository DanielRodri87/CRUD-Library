<template>
  <div>
    <h2>📚 Biblioteca</h2>

    <div v-if="!user">
      <p>Você não está logado.</p>
      <router-link to="/">Voltar para Login</router-link>
    </div>

    <div v-else>
      <p>Bem-vindo, {{ user.email }}</p>
      <button @click="logout">Sair</button>
      <hr />

      <!-- Botão para cadastrar -->
      <button @click="mode = 'add'">Cadastrar Livro</button>
      <button v-if="mode !== 'list'" @click="mode = 'list'">Home</button>

      <hr />

      <!-- LISTAR -->
      <div v-if="mode === 'list'">
        <h3>Lista de Livros</h3>
        <div v-if="loading">Carregando livros...</div>
        <div v-else>
          <div v-if="livros.length === 0">Nenhum livro encontrado.</div>

          <ul>
            <li v-for="livro in livros" :key="livro.id">
              <h4>{{ livro.titulo }}</h4>
              <p>Autor: {{ livro.autor }}</p>
              <p>Páginas: {{ livro.num_pag }}</p>
              <img :src="livro.image" alt="Capa do livro" width="100" />

              <div>
                <button @click="prepareEdit(livro)">Atualizar</button>
                <button @click="deleteLivro(livro.id)">Remover</button>
              </div>
              <hr />
            </li>
          </ul>
        </div>
      </div>

      <!-- CADASTRAR -->
      <div v-if="mode === 'add'">
        <h3>Cadastrar Livro</h3>
        <form @submit.prevent="addLivro">
          <input v-model="form.titulo" placeholder="Título" required />
          <input v-model="form.autor" placeholder="Autor" required />
          <input v-model.number="form.num_pag" placeholder="Páginas" type="number" required />
          <input v-model="form.ano_pub" placeholder="Ano de Publicação" required />
          <input v-model="form.image" placeholder="URL da Imagem" required />
          <button type="submit">Cadastrar</button>
        </form>
        <p v-if="message">{{ message }}</p>
      </div>

      <!-- EDITAR -->
      <div v-if="mode === 'edit'">
        <h3>Editar Livro</h3>
        <form @submit.prevent="editLivro">
          <input v-model="form.titulo" placeholder="Título" required />
          <input v-model="form.autor" placeholder="Autor" required />
          <input v-model.number="form.num_pag" placeholder="Páginas" type="number" required />
          <input v-model="form.ano_pub" placeholder="Ano de Publicação" required />
          <input v-model="form.image" placeholder="URL da Imagem" required />
          <button type="submit">Salvar Alterações</button>
        </form>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const livros = ref([]);
const loading = ref(true);
const user = ref(null);
const message = ref("");

// controla a tela (list, add, edit)
const mode = ref("list");

// formulário usado em add/edit
const form = ref({
  id: "",
  titulo: "",
  autor: "",
  num_pag: "",
  ano_pub: "",
  image: "",
});

// carregar livros
const loadLivros = async () => {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:3000/livros");
    const data = await res.json();
    if (res.ok) livros.value = data;
  } catch (err) {
    console.error("Erro ao buscar livros:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) {
    router.push("/");
    return;
  }
  user.value = JSON.parse(savedUser);
  await loadLivros();
});

// cadastrar livro
const addLivro = async () => {
  try {
    const res = await fetch("http://localhost:3000/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (res.ok) {
      message.value = data.message;
      await loadLivros();
      resetForm();
      mode.value = "list";
    } else {
      message.value = data.error;
    }
  } catch (err) {
    message.value = "Erro ao conectar ao servidor";
  }
};

// preparar edição
const prepareEdit = (livro) => {
  form.value = { ...livro };
  mode.value = "edit";
};

// editar livro
const editLivro = async () => {
  try {
    const res = await fetch(`http://localhost:3000/livros/${form.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    const data = await res.json();
    if (res.ok) {
      message.value = data.message;
      await loadLivros();
      resetForm();
      mode.value = "list";
    } else {
      message.value = data.error;
    }
  } catch (err) {
    message.value = "Erro ao conectar ao servidor";
  }
};

// remover livro
const deleteLivro = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/livros/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      message.value = data.message;
      await loadLivros();
    } else {
      message.value = data.error;
    }
  } catch (err) {
    message.value = "Erro ao conectar ao servidor";
  }
};

const resetForm = () => {
  form.value = { id: "", titulo: "", autor: "", num_pag: "", ano_pub: "", image: "" };
};

const logout = () => {
  localStorage.removeItem("user");
  router.push("/");
};
</script>
