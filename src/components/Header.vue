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
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.header__icon-wrapper {
  background-color: var(--color-primary);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
}

.header__icon {
  color: white;
  width: 2.25rem;
  height: 2.25rem;
}

.header__text {
  flex-grow: 1;
}

.header__title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-dark);
  margin-bottom: 0.3rem;
}

.header__subtitle {
  font-size: 0.95rem;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .header {
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .header__icon-wrapper {
    padding: 0.8rem;
  }

  .header__icon {
    width: 1.8rem;
    height: 1.8rem;
  }

  .header__title {
    font-size: 1.5rem;
  }

  .header__subtitle {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .header {
    flex-direction: column;
    text-align: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding-bottom: 0.8rem;
  }

  .header__icon-wrapper {
    padding: 0.6rem;
  }

  .header__icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .header__title {
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
  }

  .header__subtitle {
    font-size: 0.75rem;
  }
}
</style>