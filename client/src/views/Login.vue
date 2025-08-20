<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <router-link to="/signup">Não tem conta? Cadastre-se</router-link>
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
      // 👉 salva usuário no localStorage para manter sessão
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
