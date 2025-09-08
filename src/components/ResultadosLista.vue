<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import AulaCard from './AulaCard.vue';
import type { Aula } from '../hooks/usePlanilhaData';

const props = defineProps<{
  dados: Aula[];
  isFavorited: (aulaId: string) => boolean;
  toggleFavorite: (aulaId: string) => void;
}>();

const generateAulaId = (item: Aula) => {
  return `${item.disciplina}-${item.professor}-${item.dia}-${item.horas}-${item.sala}`;
};

const getCurrentDayOfWeek = () => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[new Date().getDay()];
};

const isTimeWithinRange = (timeRange: string) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const [startTimeStr, endTimeStr] = timeRange.split(' - ');
  if (!startTimeStr || !endTimeStr) {
    return false;
  }

  const [startHour, startMinute] = startTimeStr.split(':').map(Number);
  const [endHour, endMinute] = endTimeStr.replace('h', '').split(':').map(Number);

  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};

const isClassHappeningNow = (item: Aula) => {
  const currentDay = getCurrentDayOfWeek();

  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const isWeekday = weekdays.includes(currentDay);

  const isSameDay = item.dia === currentDay;

  const isTimeMatch = isTimeWithinRange(item.horas);

  const finalResult = isWeekday && isSameDay && isTimeMatch;
  return finalResult;
};
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
    <AulaCard 
      v-for="(item, index) in dados" 
      :key="generateAulaId(item)" 
      :item="item" 
      :isFavorited="props.isFavorited(generateAulaId(item))" 
      :isCurrentTime="isClassHappeningNow(item)"
      @toggleFavorite="props.toggleFavorite" 
    />
  </div>
</template>

<style scoped>
.no-results {
  background-color: white;
  border-radius: 12px;
  padding: 4rem;
  text-align: center;
  border: 1px solid #e9ecef;
  box-shadow: var(--shadow-sm);
}

.no-results__icon-wrapper {
  background-color: var(--color-background-light);
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.no-results__icon {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--color-secondary);
}

.no-results__title {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 0.75rem;
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