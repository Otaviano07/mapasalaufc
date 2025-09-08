
<script setup lang="ts">
import { Calendar, Clock, Users } from 'lucide-vue-next';
import type { Aula } from '../hooks/usePlanilhaData';

defineProps<{ item: Aula }>();
</script>

<template>
  <div class="aula-card">
    <div class="aula-card__header">
      <div class="aula-card__tags">
        <span class="aula-card__tag aula-card__tag--sala">{{ item.sala }}</span>
        <span v-if="item.unidade" class="aula-card__tag aula-card__tag--unidade">Unidade {{ item.unidade }}</span>
      </div>
      <span v-if="item.extra" class="aula-card__tag aula-card__tag--extra">Extra</span>
    </div>

    <h3 class="aula-card__title">{{ item.disciplina }}</h3>
    
    <div class="aula-card__details">
      <div v-if="item.dia" class="aula-card__detail-item">
        <Calendar class="aula-card__detail-icon aula-card__detail-icon--blue" />
        <span>{{ item.dia }}</span>
      </div>
      
      <div v-if="item.horas" class="aula-card__detail-item">
        <Clock class="aula-card__detail-icon aula-card__detail-icon--green" />
        <span>{{ item.horas }}</span>
      </div>
      
      <div v-if="item.professor" class="aula-card__detail-item">
        <Users class="aula-card__detail-icon aula-card__detail-icon--purple" />
        <span>{{ item.professor }}</span>
      </div>
    </div>

    <div v-if="item.curso" class="aula-card__footer">
      <span class="aula-card__course">Turma: {{ item.curso }}</span>
    </div>
  </div>
</template>

<style scoped>
.aula-card {
  background-color: white;
  border-radius: 12px; /* More rounded */
  box-shadow: var(--shadow-sm);
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.aula-card:hover {
  transform: translateY(-3px); /* Slightly less movement */
  box-shadow: var(--shadow-md); /* More pronounced shadow on hover */
}

.aula-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem; /* Increased padding */
  border-bottom: 1px solid var(--color-background-light); /* Use new background color for separator */
}

.aula-card__tags {
  display: flex;
  gap: 0.6rem; /* Slightly increased gap */
}

.aula-card__tag {
  font-size: 0.8rem; /* Slightly larger font */
  font-weight: 600;
  padding: 0.3rem 0.8rem; /* Adjusted padding */
  border-radius: 6px; /* More rounded */
}

.aula-card__tag--sala {
  background-color: #e0f2f7;
  color: #0056b3; /* Darker blue for better contrast */
}

.aula-card__tag--unidade {
  background-color: #e9ecef;
  color: var(--color-secondary);
}

.aula-card__tag--extra {
  background-color: #fff3cd;
  color: var(--color-warning);
}

.aula-card__title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-dark);
  padding: 1.25rem;
}

.aula-card__details {
  padding: 0 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: var(--color-text-light);
}

.aula-card__detail-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.aula-card__detail-icon {
  width: 1.1rem;
  height: 1.1rem;
}

.aula-card__detail-icon--blue {
  color: var(--color-primary);
}

.aula-card__detail-icon--green {
  color: var(--color-success);
}

.aula-card__detail-icon--purple {
  color: #8a2be2; /* A more distinct purple */
}

.aula-card__footer {
  border-top: 1px solid var(--color-background-light);
  padding: 1.25rem;
  background-color: var(--color-light);
}

.aula-card__course {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-dark);
}
</style>
