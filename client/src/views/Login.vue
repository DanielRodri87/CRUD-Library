<template>
  <div class="login-container">
    <!-- Barra superior esquerda -->
    <div class="top-bar"></div>
    
    <!-- Container principal -->
    <div class="main-content">
      <!-- Card de Login -->
      <div class="login-card">
        <!-- Header com logo -->
        <div class="login-header">
          <h1 class="login-title">Login</h1>
          <img src="/src/assets/images/login/logo.png" alt="Logo" class="logo" />
        </div>

        <!-- Formulário -->
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              placeholder="Digite seu email" 
              class="form-input"
              required 
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Senha</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="Digite sua senha" 
              class="form-input"
              required 
            />
          </div>

          <button type="submit" class="login-button">Entrar</button>
        </form>

        <!-- Mensagem de erro/sucesso -->
        <p v-if="message" class="message">{{ message }}</p>

        <!-- Link para cadastro -->
        <p class="signup-link">
          Não é usuário? 
          <router-link to="/signup" class="link">Criar conta</router-link>
        </p>
      </div>

      <!-- Seção lateral direita -->
      <div class="sidebar">
        <div class="sidebar-content">
          <img src="/src/assets/images/login/quanan.png" alt="Mascote" class="mascot" />
          <h2 class="sidebar-title">Sua biblioteca, Leitura sem rédeas</h2>
          <p class="sidebar-subtitle">
            Um lugar para guardar seus livros sem empacar.<br>
            Aqui, cada história ganha rédeas soltas para galopar no estábulo do conhecimento.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");

const login = async () => {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      message.value = data.message;
      // salva usuário no localStorage para manter sessão
      localStorage.setItem("user", JSON.stringify(data.user));
      // redireciona para a tela Home
      router.push("/home");
    } else {
      message.value = data.error;
    }
  } catch (err) {
    message.value = "Erro ao conectar ao servidor";
  }
};
</script>

<style scoped>

/* Remove qualquer scrollbar visível */
::-webkit-scrollbar {
  display: none;
}


html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* já remove a barra de rolagem também */
  background: white; /* garante que o fundo seja uniforme */
}


body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

.login-container {
  min-height: 100vh;
  width: 100vw;
  position: relative;
  background: white;
  overflow: hidden;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 700px;
  height: 700px;
  background: url('/src/assets/images/login/barralateral.png') no-repeat;
  background-size: cover;
  z-index: 1;
}

.main-content {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  z-index: 2;
}

.login-card {
  background: white;
  border-radius: 20px;
  padding: 4.5rem;
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.15);
  width: 500px;   /* reduzido para dar impressão mais retangular */
  min-height: 650px; /* aumenta verticalmente */
  position: absolute;
  top: 6rem;  /* ajustei a posição para compensar o novo tamanho */
  left: 12rem;
  z-index: 3;
}


.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8B5A3C;
}

.form-input::placeholder {
  color: #9ca3af;
}

.login-button {
  width: 100%;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background: #34495e;
}

.message {
  text-align: center;
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background: #f8f9fa;
  color: #6c757d;
}

.signup-link {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.link {
  color: #8B5A3C;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.sidebar {
  position: absolute;
  right: 0;
  top: 0;
  width: 700px;
  height: 100vh;
  background: url('/src/assets/images/login/fundolateral.png') no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  box-shadow: none;
  margin: 0;
}

.sidebar-content {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.mascot {
  width: 300px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.sidebar-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.sidebar-subtitle {
  font-size: 1.3rem;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .top-bar {
    width: 250px;
    height: 250px;
  }
  
  .login-card {
    position: relative;
    top: auto;
    left: auto;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    height: 400px;
    border-radius: 16px;
  }
  
  .mascot {
    width: 150px;
  }
  
  .sidebar-title {
    font-size: 1.5rem;
  }
  
  .sidebar-subtitle {
    font-size: 0.9rem;
  }
}
</style>