
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import FiltroInput from './FiltroInput.vue'; // Import the new component

interface Filtros {
  dia: string;
  horas: string;
  bloco: string;
  sala: string;
  professor: string;
  disciplina: string;
  curso: string;
}

interface Opcoes {
  salas: string[];
  professores: string[];
  disciplinas: string[];
  cursos: string[];
  horas: string[];
  blocos: string[];
}

const props = defineProps<{
  filtros: Filtros;
  opcoes: Opcoes;
}>();

const emit = defineEmits(['update:filtros']);

const updateFiltro = (key: keyof Filtros, value: string) => {
  emit('update:filtros', { ...props.filtros, [key]: value });
};

</script>

<template>
  <div class="filters-panel">
    <div class="filter-input-group">
      <label class="filter-label">Dia da Semana</label>
      <select
        :value="filtros.dia"
        @change="updateFiltro('dia', ($event.target as HTMLSelectElement).value)"
        class="filter-select"
      >
        <option value="">Todos os dias</option>
        <option value="Segunda">Segunda-feira</option>
        <option value="Terça">Terça-feira</option>
        <option value="Quarta">Quarta-feira</option>
        <option value="Quinta">Quinta-feira</option>
        <option value="Sexta">Sexta-feira</option>
      </select>
    </div>

    <FiltroInput 
      label="Bloco"
      placeholder="Digite ou selecione um bloco..."
      :value="filtros.bloco"
      @update:value="updateFiltro('bloco', $event)"
      listId="blocos-list"
      :opcoes="opcoes.blocos"
    />

    <FiltroInput 
      label="Sala"
      placeholder="Digite ou selecione uma sala..."
      :value="filtros.sala"
      @update:value="updateFiltro('sala', $event)"
      listId="salas-list"
      :opcoes="opcoes.salas"
    />

    <FiltroInput 
      label="Professor"
      placeholder="Digite ou selecione um professor..."
      :value="filtros.professor"
      @update:value="updateFiltro('professor', $event)"
      listId="professores-list"
      :opcoes="opcoes.professores"
    />

    <FiltroInput 
      label="Disciplina"
      placeholder="Digite ou selecione uma disciplina..."
      :value="filtros.disciplina"
      @update:value="updateFiltro('disciplina', $event)"
      listId="disciplinas-list"
      :opcoes="opcoes.disciplinas"
    />

    <FiltroInput 
      label="Curso/Turma"
      placeholder="Digite ou selecione um curso..."
      :value="filtros.curso"
      @update:value="updateFiltro('curso', $event)"
      listId="cursos-list"
      :opcoes="opcoes.cursos"
    />

    <FiltroInput 
      label="Horário"
      placeholder="Digite ou selecione um horário..."
      :value="filtros.horas"
      @update:value="updateFiltro('horas', $event)"
      listId="horas-list"
      :opcoes="opcoes.horas"
    />
  </div>
</template>

<style scoped>
.filters-panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Adjusted min-width */
  gap: 1.25rem; /* Increased gap */
  background-color: var(--color-light);
  padding: 1.75rem; /* Adjusted padding */
  border-radius: 10px; /* Slightly more rounded */
  margin-top: 1.5rem; /* Adjusted margin */
  box-shadow: var(--shadow-sm); /* Added subtle shadow */
}

.filter-input-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 0.9rem; /* Slightly larger font */
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 0.6rem; /* Adjusted spacing */
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.8rem 1rem; /* Adjusted padding */
  border: 1px solid #dce0e6; /* Lighter border */
  border-radius: 8px; /* More rounded */
  background-color: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
  font-size: 1rem;
  color: var(--color-dark);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25); /* Updated shadow color */
}
</style>
