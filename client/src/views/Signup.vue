<template>
  <div>
    <h2>Cadastro</h2>
    <form @submit.prevent="signup">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Senha" required />
      <button type="submit">Cadastrar</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <router-link to="/">Já tem conta? Faça login</router-link>
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
