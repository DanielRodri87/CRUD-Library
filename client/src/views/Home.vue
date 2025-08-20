<template>
  <div>
    <h2>📚 Lista de Livros</h2>

    <div v-if="!user">
      <p>Você não está logado.</p>
      <router-link to="/">Voltar para Login</router-link>
    </div>

    <div v-else>
      <p>Bem-vindo, {{ user.email }}</p>
      <button @click="logout">Sair</button>

      <div v-if="loading">Carregando livros...</div>
      <div v-else>
        <div v-if="livros.length === 0">Nenhum livro encontrado.</div>

        <ul>
          <li v-for="livro in livros" :key="livro.id">
            <h3>{{ livro.titulo }}</h3>
            <p>Autor: {{ livro.autor }}</p>
            <p>Páginas: {{ livro.num_pag }}</p>
            <img :src="livro.image" alt="Capa do livro" width="100" />
            <hr />
          </li>
        </ul>
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

onMounted(async () => {
  // verifica se tem usuário no localStorage
  const savedUser = localStorage.getItem("user");
  if (!savedUser) {
    router.push("/"); // se não tiver, volta pro login
    return;
  }

  user.value = JSON.parse(savedUser);

  try {
    const res = await fetch("http://localhost:3000/livros");
    const data = await res.json();

    if (res.ok) {
      livros.value = data;
    }
  } catch (err) {
    console.error("Erro ao buscar livros:", err);
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  localStorage.removeItem("user");
  router.push("/");
};
</script>
