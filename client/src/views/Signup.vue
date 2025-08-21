<template>
<div class="tudo">
    <div class="login-container">
    <!-- Barra superior esquerda -->
    <div class="top-bar"></div>
    
    <!-- Container principal -->
    <div class="main-content">
      <!-- Card de Cadastro -->
      <div class="login-card">
        <!-- Header com logo -->
        <div class="login-header">
          <h1 class="login-title">Cadastro</h1>
          <img src="/src/assets/images/login/logo.png" alt="Logo" class="logo" />
        </div>

        <!-- Formulário -->
        <form @submit.prevent="signup" class="login-form">
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

          <button type="submit" class="login-button">Cadastrar</button>
        </form>

        <!-- Mensagem de erro/sucesso -->
        <p v-if="message" class="message">{{ message }}</p>

        <!-- Link para login -->
        <p class="signup-link">
          Já tem conta? 
          <router-link to="/" class="link">Faça login</router-link>
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
</div>
 
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const message = ref("");

const signup = async () => {
  try {
    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await res.json();
    message.value = data.message || data.error;
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

.tudo {
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 999999999999;
  overflow: hidden;
  background: white;
}

.login-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: white;
  overflow: hidden;
}

.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 33%; /* Aproximadamente 440px em tela de 1366px */
  height: 55vh; /* 550px em tela de 1000px */
  background: url('/src/assets/images/login/barralateral.png') no-repeat;
  background-size: cover;
  z-index: 1;
}

.main-content {
  display: flex;
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 2;
}

.login-card {
  background: white;
  padding: 6vh 4.5%; /* Padding aumentado */
  box-shadow: 0.6vh 0.6vh 1.2vh rgba(0, 0, 0, 0.15);
  width: 33%; /* Aproximadamente 440px */
  min-height: 70vh; /* Aumentado de 55vh para 70vh */
  position: absolute;
  top: 10vh; /* Descido de 6.6vh para 10vh */
  left: 7.2%; /* Aproximadamente 9.9rem */
  z-index: 3;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4vh; /* Aumentado de 2.2vh para 4vh */
}

.login-title {
  font-size: 4.5vh; /* Aumentado de 3.3vh para 4.5vh */
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.logo {
  width: 12vh; /* Aumentado de 8.8vh para 12vh */
  height: 12vh;
  object-fit: contain;
}

.login-form {
  margin-bottom: 3vh; /* Aumentado de 1.65vh para 3vh */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-group {
  margin-bottom: 3vh; /* Aumentado de 1.65vh para 3vh */
}

.form-label {
  display: block;
  margin-bottom: 1vh; /* Aumentado de 0.55vh para 1vh */
  color: #000000; /* Mudado de #555 para preto escuro */
  font-weight: 700; /* Mudado de 500 para 700 (negrito) */
  font-size: 1.8vh; /* Aumentado de 1.045vh para 1.8vh */
}

.form-input {
  width: 100%;
  padding: 2.5vh 3%; /* Aumentado de 1.375vh para 2.5vh */
  border: 0.2vh solid #2c3e50;
  border-radius: 1.1vh;
  font-size: 2vh; /* Aumentado de 1.21vh para 2vh */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8B5A3C;
  box-shadow: 0 0 0.66vh rgba(139, 90, 60, 0.4);
}

.form-input::placeholder {
  color: #9ca3af;
}

.login-button {
  width: 100%;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 2.5vh 0; /* Aumentado de 1.375vh para 2.5vh */
  border-radius: 1.1vh;
  font-size: 2.2vh; /* Aumentado de 1.32vh para 2.2vh */
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 2vh; /* Adicionado margem superior */
}

.login-button:hover {
  background: #34495e;
  transform: translateY(-0.22vh);
}

.message {
  text-align: center;
  margin: 2vh 0; /* Aumentado de 1.1vh para 2vh */
  padding: 1vh; /* Aumentado de 0.55vh para 1vh */
  border-radius: 0.44vh;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 1.6vh; /* Aumentado de 1vh para 1.6vh */
}

.signup-link {
  text-align: center;
  color: #666;
  font-size: 1.6vh; /* Aumentado de 0.99vh para 1.6vh */
  margin-top: 2vh; /* Adicionado margem superior */
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
  width: 48.3%; /* Aproximadamente 660px em tela de 1366px */
  height: 100vh;
  background: url('/src/assets/images/login/fundolateral.png') no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6.864vh 4.68%; /* Aumentado 30%: 5.28vh * 1.3 = 6.864vh, 3.6% * 1.3 = 4.68% */
  box-shadow: none;
  margin: 0;
  box-sizing: border-box;
}

.sidebar-content {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.mascot {
  width: 51.48vh; /* Aumentado 30%: 39.6vh * 1.3 = 51.48vh */
  height: auto;
  margin-bottom: 3.432vh; /* Aumentado 30%: 2.64vh * 1.3 = 3.432vh */
  filter: drop-shadow(0 0.6864vh 1.3728vh rgba(0, 0, 0, 0.2)); /* Aumentado 30% */
  max-width: 90%; /* Aumentado para acomodar o tamanho maior */
}

.sidebar-title {
  font-size: 4.29vh; /* Aumentado 30%: 3.3vh * 1.3 = 4.29vh */
  font-weight: bold;
  margin-bottom: 2.574vh; /* Aumentado 30%: 1.98vh * 1.3 = 2.574vh */
  text-shadow: 0.3432vh 0.3432vh 0.6864vh rgba(0, 0, 0, 0.5); /* Aumentado 30% */
  line-height: 1.2;
}

.sidebar-subtitle {
  font-size: 2.2308vh; /* Aumentado 30%: 1.716vh * 1.3 = 2.2308vh */
  line-height: 1.6;
  text-shadow: 0.1716vh 0.1716vh 0.3432vh rgba(0, 0, 0, 0.5); /* Aumentado 30% */
}

/* Media Queries para Responsividade */
@media (max-width: 1024px) {
  .top-bar {
    width: 35%;
    height: 45vh;
  }
  
  .login-card {
    width: 38%;
    left: 5%;
    padding: 4vh 3%;
  }
  
  .sidebar {
    width: 55%;
    padding: 6.24vh 4.68%; /* Aumentado 30%: 4.8vh * 1.3 = 6.24vh */
  }
  
  .login-title {
    font-size: 3vh;
  }
  
  .logo {
    width: 7vh;
    height: 7vh;
  }
  
  .form-input {
    font-size: 1.5vh;
    padding: 1.2vh 3%;
  }
  
  .login-button {
    font-size: 1.8vh;
    padding: 1.5vh 0;
  }
  
  .sidebar-title {
    font-size: 3.9vh; /* Aumentado 30%: 3vh * 1.3 = 3.9vh */
  }
  
  .sidebar-subtitle {
    font-size: 2.028vh; /* Aumentado 30%: 1.56vh * 1.3 = 2.028vh */
  }
  
  .mascot {
    width: 43.68vh; /* Aumentado 30%: 33.6vh * 1.3 = 43.68vh */
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .top-bar {
    width: 100%;
    height: 25vh;
  }
  
  .login-card {
    position: relative;
    top: auto;
    left: auto;
    width: 90%;
    margin: 2vh auto;
    padding: 4vh 5%;
    min-height: auto;
  }
  
  .sidebar {
    position: relative;
    width: 100%;
    height: 45vh;
    padding: 4.68vh 7.8%; /* Aumentado 30%: 3.6vh * 1.3 = 4.68vh, 6% * 1.3 = 7.8% */
  }
  
  .login-title {
    font-size: 4vh;
  }
  
  .logo {
    width: 8vh;
    height: 8vh;
  }
  
  .form-input {
    font-size: 2vh;
    padding: 1.5vh 4%;
  }
  
  .login-button {
    font-size: 2.2vh;
    padding: 1.8vh 0;
  }
  
  .message {
    font-size: 1.4vh;
  }
  
  .signup-link {
    font-size: 1.4vh;
  }
  
  .mascot {
    width: 31.2vh; /* Aumentado 30%: 24vh * 1.3 = 31.2vh */
    margin-bottom: 2.34vh; /* Aumentado 30%: 1.8vh * 1.3 = 2.34vh */
  }
  
  .sidebar-title {
    font-size: 3.432vh; /* Aumentado 30%: 2.64vh * 1.3 = 3.432vh */
    margin-bottom: 1.56vh; /* Aumentado 30%: 1.2vh * 1.3 = 1.56vh */
  }
  
  .sidebar-subtitle {
    font-size: 2.184vh; /* Aumentado 30%: 1.68vh * 1.3 = 2.184vh */
  }
}

@media (max-width: 480px) {
  .login-card {
    width: 95%;
    padding: 3vh 4%;
  }
  
  .login-title {
    font-size: 3.5vh;
  }
  
  .logo {
    width: 6vh;
    height: 6vh;
  }
  
  .form-input {
    font-size: 1.8vh;
    padding: 1.3vh 3%;
  }
  
  .login-button {
    font-size: 2vh;
    padding: 1.6vh 0;
  }
  
  .sidebar {
    height: 40vh;
    padding: 4.68vh 7.8%; /* Aumentado 30% mantido do media query anterior */
  }
  
  .mascot {
    width: 28.08vh; /* Aumentado 30%: 21.6vh * 1.3 = 28.08vh */
  }
  
  .sidebar-title {
    font-size: 3.12vh; /* Aumentado 30%: 2.4vh * 1.3 = 3.12vh */
  }
  
  .sidebar-subtitle {
    font-size: 1.872vh; /* Aumentado 30%: 1.44vh * 1.3 = 1.872vh */
  }
}

/* Para telas muito grandes */
@media (min-width: 1600px) {
  .login-title {
    font-size: 3.8vh;
  }
  
  .logo {
    width: 10vh;
    height: 10vh;
  }
  
  .form-input {
    font-size: 1.4vh;
  }
  
  .login-button {
    font-size: 1.6vh;
  }
  
  .sidebar-title {
    font-size: 4.68vh; /* Aumentado 30%: 3.6vh * 1.3 = 4.68vh */
  }
  
  .sidebar-subtitle {
    font-size: 2.496vh; /* Aumentado 30%: 1.92vh * 1.3 = 2.496vh */
  }
  
  .mascot {
    width: 54.6vh; /* Aumentado 30%: 42vh * 1.3 = 54.6vh */
  }
}
</style>