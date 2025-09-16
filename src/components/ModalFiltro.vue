<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { X } from 'lucide-vue-next';
import FiltroInput from './FiltroInput.vue';

interface Filtros {
  dia: string;
  horas: string;
  bloco: string;
  sala: string;
  professor: string;
  disciplina: string;
}

interface Opcoes {
  salas: string[];
  professores: string[];
  disciplinas: string[];
  horas: string[];
  blocos: string[];
}

const props = defineProps<{
  filtros: Filtros;
  opcoes: Opcoes;
  isVisible: boolean;
}>();

const emit = defineEmits(['update:filtros', 'close', 'clear-filters']);

const updateFiltro = (key: keyof Filtros, value: string) => {
  emit('update:filtros', { ...props.filtros, [key]: value });
};

const close = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Filtros</h2>
        <button @click="close" class="close-button">
          <X />
        </button>
      </div>
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
          label="Horário"
          placeholder="Digite ou selecione um horário..."
          :value="filtros.horas"
          @update:value="updateFiltro('horas', $event)"
          listId="horas-list"
          :opcoes="opcoes.horas"
        />
      </div>
      <div class="modal-footer">
        <button @click="emit('clear-filters'); close();" class="button-clear">
          <X />
          Limpar Filtros
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
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

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-dark);
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-text-light);
  transition: color 0.3s ease;
}

.close-button:hover {
  color: var(--color-primary);
}

.filters-panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  background-color: var(--color-light);
  padding: 1.75rem;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
}

.filter-input-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 0.6rem;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #dce0e6;
  border-radius: 8px;
  background-color: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 1rem;
  color: var(--color-dark);
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.button-clear {
  background-color: var(--color-secondary);
  color: white;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-weight: 600;
}

.button-clear:hover {
  background-color: #5a6268;
  box-shadow: var(--shadow-md);
}
</style>