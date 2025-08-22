<template>
  <div class="biblioteca-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-container">
          <div class="horse-logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div class="title-container">
            <h1 class="title" :style="titleStyle">BIBLIOTECA</h1>   
          </div>
        </div>

        <div v-if="user" class="user-section">
          <span class="welcome-text">{{ user.email }}</span>
          <button @click="logout" class="logout-btn">Sair</button>
        </div>
      </div>
    </header>

    <!-- Verificação de login -->
    <div v-if="!user" class="not-logged">
      <p>Você não está logado.</p>
      <router-link to="/" class="back-link">Voltar para Login</router-link>
    </div>

    <!-- Conteúdo principal -->
    <main v-else class="main-content">
      <!-- Controles de navegação -->
      <nav class="nav-controls">
        <button 
          @click="mode = 'list'" 
          :class="['nav-btn', { active: mode === 'list' }]"
        >
          Home
        </button>
        <!-- <button 
          @click="$router.push('/cadastro')" 
          class="nav-btn"
        >
          Cadastrar Livro
        </button> -->
      </nav>

      <!-- Mensagem de feedback -->
      <div v-if="message" class="message" :class="getMessageType(message)">
        {{ message }}
      </div>

      <!-- LISTAGEM DE LIVROS -->
      <section v-if="mode === 'list'" class="books-section">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Carregando livros...</p>
        </div>
        
        <div v-else class="books-grid">
          <!-- Card para adicionar novo livro -->
          <div class="book-card add-card" @click="$router.push('/cadastro')">
            <div class="add-icon">+</div>
          </div>
          
          <!-- Cards dos livros -->
          <div v-for="livro in livros" :key="livro.id" class="book-card">
            <div class="book-options">
              <button @click="showOptions(livro.id)" class="options-btn">⋮</button>
              <div v-if="activeOptions === livro.id" class="options-menu">
                <button @click="prepareEdit(livro)" class="option-item">Editar</button>
                <button @click="deleteLivro(livro.id)" class="option-item delete">Excluir</button>
              </div>
            </div>
            
            <div class="book-cover">
              <div class="book-image" :style="{ 'background-image': `url(${livro.image})` }">
                <div class="book-year">{{ livro.ano_pub }}</div>
              </div>
            </div>
            
            <div class="book-info">
              <h3 class="book-title">{{ livro.titulo }}</h3>
              <p class="book-author">{{ livro.autor }}</p>
              <p class="book-pages">Páginas: {{ livro.num_pag }}</p>
            </div>
          </div>
        </div>

        <div v-if="!loading && livros.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <p>Nenhum livro encontrado.</p>
          <button @click="$router.push('/cadastro')" class="add-first-btn">Cadastrar primeiro livro</button>
        </div>
      </section>

      <!-- FORMULÁRIO DE EDIÇÃO -->
      <section v-if="mode === 'edit'" class="form-section">
        <h2>Editar Livro</h2>
        <Atualizar
          :form="form"
          :message="message"
          @editar-livro="editLivro"
          @cancelar="cancelForm"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Atualizar from "./Atualizar.vue";

const router = useRouter();
const livros = ref([]);
const loading = ref(true);
const user = ref(null);
const message = ref("");
const activeOptions = ref(null);

// controla a tela (list, add, edit)
const mode = ref("list");

// formulário usado em edit
const form = ref({
  id: "",
  titulo: "",
  autor: "",
  num_pag: "",
  ano_pub: "",
  image: "",
});

// Estilo do título
const titleStyle = computed(() => ({
  fontFamily: "'Inria Serif', serif",
  fontWeight: "bold",
  fontSize: "5rem"
}));

// Mostrar/esconder opções do livro
const showOptions = (livroId) => {
  activeOptions.value = activeOptions.value === livroId ? null : livroId;
};

// Esconder opções quando clicar fora
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.book-options')) {
      activeOptions.value = null;
    }
  });
});

// Determinar tipo da mensagem
const getMessageType = (msg) => {
  if (msg.includes('sucesso') || msg.includes('cadastrado') || msg.includes('atualizado') || msg.includes('removido')) {
    return 'success';
  } else if (msg.includes('erro') || msg.includes('Erro')) {
    return 'error';
  }
  return 'info';
};

// Mostrar mensagem temporária
const showMessage = (text) => {
  message.value = text;
  setTimeout(() => {
    message.value = "";
  }, 3000);
};

// carregar livros
const loadLivros = async () => {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:3000/livros");
    const data = await res.json();
    if (res.ok) {
      livros.value = data;
    } else {
      showMessage("Erro ao carregar livros");
    }
  } catch (err) {
    console.error("Erro ao buscar livros:", err);
    showMessage("Erro ao conectar com o servidor");
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

// preparar edição
const prepareEdit = (livro) => {
  form.value = { ...livro };
  mode.value = "edit";
  activeOptions.value = null;
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
      showMessage(data.message || "Livro atualizado com sucesso!");
      await loadLivros();
      resetForm();
      mode.value = "list";
    } else {
      showMessage(data.error || "Erro ao atualizar livro");
    }
  } catch (err) {
    showMessage("Erro ao conectar ao servidor");
  }
};

// remover livro
const deleteLivro = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este livro?")) return;
  
  activeOptions.value = null;
  try {
    const res = await fetch(`http://localhost:3000/livros/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(data.message || "Livro removido com sucesso!");
      await loadLivros();
    } else {
      showMessage(data.error || "Erro ao remover livro");
    }
  } catch (err) {
    showMessage("Erro ao conectar ao servidor");
  }
};

const resetForm = () => {
  form.value = {
    id: "",
    titulo: "",
    autor: "",
    num_pag: "",
    ano_pub: "",
    image: ""
  };
};

const cancelForm = () => {
  resetForm();
  mode.value = "list";
};

const logout = () => {
  localStorage.removeItem("user");
  router.push("/");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inria+Serif:wght@300;400;700&display=swap');

/* Reset global para eliminar margens e bordas */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

.biblioteca-container {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f7fa 0%, #f5f7fa 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

.header {
  background: #B8A18A;
  color: white;
  padding: 2.5rem 0 3.5rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  margin: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.horse-logo {
  width: 120px;
  height: 150px;
  display: flex;
}

.horse-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  flex: 1;
}

.title-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.title {
  margin: 0;
  transition: all 0.3s ease;
  font-family: 'Inria Serif', serif;
  font-weight: bold;
  font-size: 5rem; 
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  opacity: 0.9;
}

.logout-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.5rem 3rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.3);
}

.not-logged {
  text-align: center;
  padding: 4rem 2rem;
}

.back-link {
  color: #B8A18A;
  text-decoration: none;
  font-weight: 500;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.nav-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.nav-btn {
  padding: 0.75rem 2rem;
  border: 2px solid #B8A18A;
  background: white;
  color: #B8A18A;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-btn:hover,
.nav-btn.active {
  background: #B8A18A;
  color: white;
}

.message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #B8A18A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
}

.book-card {
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  cursor: pointer;
  border: 2px dashed #ccc;
  background: #ffffff;
}

.add-card:hover {
  border-color: #B8A18A;
  background: #f5f5f5;
}

.add-icon {
  font-size: 3rem;
  color: #ccc;
}

.add-card:hover .add-icon {
  color: #B8A18A;
}

.book-options {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.options-btn {
  background: rgba(255,255,255,0.9);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
  transition: all 0.3s ease;
}

.options-btn:hover {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  overflow: hidden;
  min-width: 100px;
}

.option-item {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
}

.option-item:hover {
  background: #f5f5f5;
}

.option-item.delete:hover {
  background: #ffe6e6;
  color: #dc3545;
}

.book-cover {
  position: relative;
  margin-bottom: 1rem;
}

.book-image {
  width: 100%;
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  position: relative;
}

.book-year {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.book-info {
  text-align: center;
}

.book-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.book-author {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.book-pages {
  margin: 0;
  color: #999;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.add-first-btn {
  background: #B8A18A;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.add-first-btn:hover {
  background: #9D8977;
}

.form-section {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.form-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 0 1rem;
  }
  
  .user-section {
    position: static;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .nav-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .title {
    font-size: 3rem !important;
  }
}
</style>