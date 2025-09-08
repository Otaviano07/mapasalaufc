
<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
</script>

<template>
  <header class="header">
    <div class="header__icon-wrapper">
      <MapPin class="header__icon" />
    </div>
    <div class="header__text">
      <h1 class="header__title">Mapa de Salas - UFC Russas</h1>
      <p class="header__subtitle">Semestre 2025.2 - Consulta de horários e disponibilidade</p>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem; /* Add some padding at the bottom */
  border-bottom: 1px solid #e9ecef; /* Subtle separator */
}

.header__icon-wrapper {
  background-color: var(--color-primary);
  padding: 1rem;
  border-radius: 10px; /* Slightly more rounded */
  box-shadow: var(--shadow-sm);
}

.header__icon {
  color: white;
  width: 2.25rem; /* Slightly larger icon */
  height: 2.25rem;
}

.header__text {
  flex-grow: 1;
}

.header__title {
  font-size: 1.8rem; /* Adjusted font size */
  font-weight: 700; /* Bolder */
  color: var(--color-dark);
  margin-bottom: 0.3rem; /* Adjusted spacing */
}

.header__subtitle {
  font-size: 0.95rem; /* Adjusted font size */
  color: var(--color-text-light);
}
</style>
