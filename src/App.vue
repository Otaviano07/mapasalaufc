<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="app-container">
    <div class="content-wrapper">
      <Header />
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<style>
/* Estilos globais que estavam em App.vue permanecem aqui */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.content-wrapper {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.filters-section {
  margin-bottom: 1rem;
}

.filters-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.desktop-buttons {
  display: none;
}

@media (min-width: 768px) {
  .desktop-buttons {
    display: flex;
    gap: 0.5rem;
  }
}

.button-filter, .button-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: #f1f3f5;
  color: #343a40;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.button-filter:hover, .button-clear:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.button-filter--active {
  background-color: #4C6EF5;
  color: #fff;
  box-shadow: 0 2px 6px rgba(76, 110, 245, 0.4);
  transform: translateY(-1px);
}

.button-filter svg,
.button-clear svg {
  color: #495057;
  transition: color 0.2s ease-in-out;
}

.button-filter--active svg {
  color: #fff;
}

.button-filter--active .lucide-star {
  fill: #fff;
}

.menu-container {
  position: relative;
  display: block;
}

@media (min-width: 768px) {
  .menu-container {
    display: none;
  }
}

.menu-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #495057;
  transition: all 0.2s ease-in-out;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button:hover {
  color: #4C6EF5;
  background-color: #f1f3f5;
}

.menu-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.menu-modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.mobile-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-section {
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
}
</style>