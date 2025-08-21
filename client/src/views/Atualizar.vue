<template>
  <div class="container">
    <!-- Lado esquerdo com ícone -->
    <div class="lado-esquerdo">
      <img :src="fundo" alt="Fundo" class="fundo" />
      <img :src="bookIcon" alt="Livro" class="book-icon" />
    </div>
    <div class="barra-meio"></div>

    <!-- Lado direito com formulário -->
    <div class="lado-direito">
      <h2>Editar Livro</h2>
      <form @submit.prevent="$emit('editar-livro')" class="formulario">
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
          <input v-model.number="form.ano_pub" placeholder="Informe o ano de publicação" type="number" min="0" />
        </label>

        <label>
          URL da Capa
          <input v-model="form.image" placeholder="Informe a URL da capa" type="url" />
        </label>

        <button type="submit">Salvar Alterações</button>
        <div v-if="message" class="message">
          <img src="../../assets/cabalo feliz.png" class="image" />
          <p>{{ message }}</p>
        </div>
            </form>
    </div>
  </div>
</template>


<script setup>
import { defineProps, defineEmits } from "vue";
import bookIcon from '../../assets/bookicon.png';
import fundo from '../../assets/fundo.png';

const props = defineProps({
  form: Object,
  message: String,
});

const emit = defineEmits(["editar-livro"]);


</script>


<style scoped>
/* Same CSS as provided in the original template */

.image {
  width: 60px;
  height: 80px;
  margin-bottom: 16px;
}

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
  position: relative;
  background-color: #A9927D;
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  left: -30%;
  width: 180%;
  height: 180%;
  object-fit: cover;
  z-index: 0;
  transform: scale(1.1);
  opacity: 0.45;
}

.book-icon {
  width: 350px;
  height: auto;
  z-index: 1;
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
  width: 520px;
  left: calc(50% - 350px);
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
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #4d3221;
  border-radius: 10px;
  padding: 60px 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  font-size: 28px;
  font-weight: bold;
  z-index: 10000;
  min-width: 280px;
  text-align: center;
  animation: grow-fade 2s forwards;
}

@keyframes grow-fade {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.7);
  }
  20% {
    opacity: 1;
    transform: translateX(-50%) scale(1.08);
  }
  40% {
    transform: translateX(-50%) scale(1);
  }
  80% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) scale(1);
  }
}

@media (max-width: 1024px) {
  .book-icon {
    width: 200px;
  }
  .lado-direito h2 {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    min-height: auto;
    height: auto;
  }
  .lado-esquerdo {
    height: 220px;
  }
  .lado-direito {
    padding: 20px;
  }
  .barra-meio {
    display: none;
  }
  .lado-direito h2 {
    font-size: 22px;
    text-align: center;
  }
  .formulario {
    align-items: center;
  }
}

@media (max-width: 480px) {
  .book-icon {
    width: 150px;
  }
  .lado-direito h2 {
    font-size: 20px;
  }
  .formulario input,
  .formulario button {
    font-size: 14px;
    padding: 10px;
  }
}
</style>

