
<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import AulaCard from './AulaCard.vue';
import type { Aula } from '../hooks/usePlanilhaData';

defineProps<{ dados: Aula[] }>();
</script>

<template>
  <div v-if="dados.length === 0" class="no-results">
    <div class="no-results__icon-wrapper">
      <Search class="no-results__icon" />
    </div>
    <h3 class="no-results__title">Nenhum resultado encontrado</h3>
    <p class="no-results__text">Tente ajustar os filtros para encontrar o que procura.</p>
  </div>

  <div v-else class="results-grid">
    <AulaCard v-for="(item, index) in dados" :key="index" :item="item" />
  </div>
</template>

<style scoped>
.no-results {
  background-color: white;
  border-radius: 12px; /* More rounded */
  padding: 4rem;
  text-align: center;
  border: 1px solid #e9ecef;
  box-shadow: var(--shadow-sm); /* Subtle shadow */
}

.no-results__icon-wrapper {
  background-color: var(--color-background-light); /* Use new background color */
  width: 4.5rem; /* Slightly larger */
  height: 4.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.no-results__icon {
  width: 2.25rem; /* Slightly larger */
  height: 2.25rem;
  color: var(--color-secondary);
}

.no-results__title {
  font-size: 1.35rem; /* Adjusted font size */
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 0.75rem; /* Adjusted spacing */
}

.no-results__text {
  color: var(--color-text-light);
  font-size: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>
