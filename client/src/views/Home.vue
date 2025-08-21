.horse-logo {
  width: 50px;
  height: 50px;
  font-size: 2rem;
}<template>
  <div class="biblioteca-container">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-container">
          <div class="horse-logo">🐴</div>
          <div class="title-container">
            <h1 class="title" :style="titleStyle">BIBLIOTECA</h1>
            <div class="typography-controls">
              <button @click="showTypographyPanel = !showTypographyPanel" class="typography-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9,4V7H14V19H17V7H22V4H9M3,4V7H8V19H11V7H16V4H3Z"/>
                </svg>
              </button>
              
              <!-- Painel de controles de tipografia -->
              <div v-if="showTypographyPanel" class="typography-panel">
                <div class="typography-section">
                  <label>Font Family</label>
                  <select v-model="typography.fontFamily" @change="updateTitleStyle">
                    <option value="'Inria Serif', serif">Inria Serif</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Georgia', serif">Georgia</option>
                    <option value="'Helvetica', sans-serif">Helvetica</option>
                    <option value="'Courier New', monospace">Courier New</option>
                    <option value="'Impact', sans-serif">Impact</option>
                  </select>
                </div>

                <div class="typography-section">
                  <label>Font Weight</label>
                  <select v-model="typography.fontWeight" @change="updateTitleStyle">
                    <option value="100">Thin</option>
                    <option value="200">Extra Light</option>
                    <option value="300">Light</option>
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semi Bold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra Bold</option>
                    <option value="900">Black</option>
                  </select>
                </div>

                <div class="typography-section">
                  <label>Font Size: {{ typography.fontSize }}px</label>
                  <input 
                    type="range" 
                    v-model.number="typography.fontSize" 
                    min="16" 
                    max="80" 
                    step="2"
                    @input="updateTitleStyle"
                    class="typography-slider"
                  />
                </div>

                <div class="typography-section">
                  <label>Letter Spacing: {{ typography.letterSpacing }}em</label>
                  <input 
                    type="range" 
                    v-model.number="typography.letterSpacing" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    @input="updateTitleStyle"
                    class="typography-slider"
                  />
                </div>

                <div class="typography-section">
                  <label>Line Height</label>
                  <select v-model="typography.lineHeight" @change="updateTitleStyle">
                    <option value="0.8">Tight</option>
                    <option value="1">Normal</option>
                    <option value="1.2">Relaxed</option>
                    <option value="1.5">Loose</option>
                  </select>
                </div>

                <div class="typography-actions">
                  <button @click="resetTypography" class="reset-btn">Reset</button>
                </div>
              </div>
            </div>
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
        <button 
          @click="mode = 'add'" 
          :class="['nav-btn', { active: mode === 'add' }]"
        >
          Cadastrar Livro
        </button>
      </nav>

      <!-- Mensagem de feedback -->
      <div v-if="message" class="message" :class="messageType">
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
          <div class="book-card add-card" @click="mode = 'add'">
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
          <button @click="mode = 'add'" class="add-first-btn">Cadastrar primeiro livro</button>
        </div>
      </section>

      <!-- FORMULÁRIO DE CADASTRO -->
      <section v-if="mode === 'add'" class="form-section">
        <h2>Cadastrar Novo Livro</h2>
        <form @submit.prevent="addLivro" class="book-form">
          <div class="form-group">
            <label for="titulo">Título</label>
            <input 
              id="titulo"
              v-model="form.titulo" 
              type="text"
              placeholder="Digite o título do livro" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="autor">Autor</label>
            <input 
              id="autor"
              v-model="form.autor" 
              type="text"
              placeholder="Digite o nome do autor" 
              required 
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="num_pag">Número de Páginas</label>
              <input 
                id="num_pag"
                v-model.number="form.num_pag" 
                type="number"
                placeholder="0" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="ano_pub">Ano de Publicação</label>
              <input 
                id="ano_pub"
                v-model="form.ano_pub" 
                type="number"
                placeholder="AAAA" 
                required 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="image">URL da Imagem</label>
            <input 
              id="image"
              v-model="form.image" 
              type="url"
              placeholder="https://exemplo.com/capa.jpg" 
              required 
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Cadastrando...' : 'Cadastrar' }}
            </button>
          </div>
        </form>
      </section>

      <!-- FORMULÁRIO DE EDIÇÃO -->
      <section v-if="mode === 'edit'" class="form-section">
        <h2>Editar Livro</h2>
        <form @submit.prevent="editLivro" class="book-form">
          <div class="form-group">
            <label for="edit-titulo">Título</label>
            <input 
              id="edit-titulo"
              v-model="form.titulo" 
              type="text"
              placeholder="Digite o título do livro" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="edit-autor">Autor</label>
            <input 
              id="edit-autor"
              v-model="form.autor" 
              type="text"
              placeholder="Digite o nome do autor" 
              required 
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="edit-num_pag">Número de Páginas</label>
              <input 
                id="edit-num_pag"
                v-model.number="form.num_pag" 
                type="number"
                placeholder="0" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="edit-ano_pub">Ano de Publicação</label>
              <input 
                id="edit-ano_pub"
                v-model="form.ano_pub" 
                type="number"
                placeholder="AAAA" 
                required 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="edit-image">URL da Imagem</label>
            <input 
              id="edit-image"
              v-model="form.image" 
              type="url"
              placeholder="https://exemplo.com/capa.jpg" 
              required 
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </section>

      <!-- BOTÕES DO FOOTER REMOVIDOS -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const livros = ref([]);
const loading = ref(true);
const user = ref(null);
const message = ref("");
const messageType = ref("info");
const isSubmitting = ref(false);
const activeOptions = ref(null);
const showTypographyPanel = ref(false);

// controla a tela (list, add, edit)
const mode = ref("list");

// Configurações de tipografia
const typography = ref({
  fontFamily: "'Inria Serif', serif",
  fontWeight: "300",
  fontSize: 32,
  letterSpacing: 0.2,
  lineHeight: 1
});

// Estilo computado para o título
const titleStyle = ref({});

// Atualizar estilo do título
const updateTitleStyle = () => {
  titleStyle.value = {
    fontFamily: typography.value.fontFamily,
    fontWeight: typography.value.fontWeight,
    fontSize: `${typography.value.fontSize}px`,
    letterSpacing: `${typography.value.letterSpacing}em`,
    lineHeight: typography.value.lineHeight
  };
};

// Reset da tipografia
const resetTypography = () => {
  typography.value = {
    fontFamily: "'Inria Serif', serif",
    fontWeight: "300",
    fontSize: 32,
    letterSpacing: 0.2,
    lineHeight: 1
  };
  updateTitleStyle();
};

// formulário usado em add/edit
const form = ref({
  id: "",
  titulo: "",
  autor: "",
  num_pag: "",
  ano_pub: "",
  image: "",
});

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

// Mostrar mensagem temporária
const showMessage = (text, type = "info") => {
  message.value = text;
  messageType.value = type;
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
      showMessage("Erro ao carregar livros", "error");
    }
  } catch (err) {
    console.error("Erro ao buscar livros:", err);
    showMessage("Erro ao conectar com o servidor", "error");
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
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  try {
    const res = await fetch("http://localhost:3000/livros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    
    const data = await res.json();
    if (res.ok) {
      showMessage("Livro cadastrado com sucesso!", "success");
      await loadLivros();
      resetForm();
      mode.value = "list";
    } else {
      showMessage(data.error || "Erro ao cadastrar livro", "error");
    }
  } catch (err) {
    showMessage("Erro ao conectar ao servidor", "error");
  } finally {
    isSubmitting.value = false;
  }
};

// preparar edição
const prepareEdit = (livro) => {
  form.value = { ...livro };
  mode.value = "edit";
  activeOptions.value = null;
};

// editar livro
const editLivro = async () => {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  try {
    const res = await fetch(`http://localhost:3000/livros/${form.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });
    
    const data = await res.json();
    if (res.ok) {
      showMessage("Livro atualizado com sucesso!", "success");
      await loadLivros();
      resetForm();
      mode.value = "list";
    } else {
      showMessage(data.error || "Erro ao atualizar livro", "error");
    }
  } catch (err) {
    showMessage("Erro ao conectar ao servidor", "error");
  } finally {
    isSubmitting.value = false;
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
      showMessage("Livro removido com sucesso!", "success");
      await loadLivros();
    } else {
      showMessage(data.error || "Erro ao remover livro", "error");
    }
  } catch (err) {
    showMessage("Erro ao conectar ao servidor", "error");
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

.biblioteca-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  background: #B8A18A;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.title-container {
  position: relative;
}

.title {
  margin: 0;
  transition: all 0.3s ease;
}

.typography-controls {
  position: relative;
}

.typography-btn {
  position: absolute;
  top: -10px;
  right: -40px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.typography-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.05);
}

.typography-panel {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 280px;
  color: #333;
}

.typography-section {
  margin-bottom: 1rem;
}

.typography-section:last-child {
  margin-bottom: 0;
}

.typography-section label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
}

.typography-section select {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.typography-section select:focus {
  outline: none;
  border-color: #B8A18A;
}

.typography-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e1e5e9;
  outline: none;
  cursor: pointer;
}

.typography-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #B8A18A;
  cursor: pointer;
}

.typography-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #B8A18A;
  cursor: pointer;
  border: none;
}

.typography-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e5e9;
}

.reset-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.reset-btn:hover {
  background: #545b62;
}

.user-section {
  position: absolute;
  right: 0;
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
  padding: 0.5rem 1rem;
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
  background: #f9f9f9;
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
}

.form-section h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.book-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #B8A18A;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #545b62;
}

.submit-btn {
  background: #B8A18A;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #9D8977;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .user-section {
    position: static;
  }
  
  .typography-btn {
    position: static;
    margin-top: 0.5rem;
  }
  
  .typography-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    right: auto;
    min-width: 300px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>