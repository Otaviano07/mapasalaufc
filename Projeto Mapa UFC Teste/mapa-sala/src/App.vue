
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Search, Filter, X } from 'lucide-vue-next';

// Hooks customizados (agora composables)
import { usePlanilhaData, type Aula } from './hooks/usePlanilhaData';
import { useDebounce } from './hooks/useDebounce';

// Componentes de UI (serão convertidos em breve)
import Header from './components/Header.vue';
import FiltrosPainel from './components/FiltrosPainel.vue';
import ResultadosLista from './components/ResultadosLista.vue';
import TelaCarregando from './components/TelaCarregando.vue';
import TelaErro from './components/TelaErro.vue';
import Footer from './components/Footer.vue';

// 1. BUSCA DE DADOS
const { dados, carregando, erro } = usePlanilhaData();

// 2. ESTADO DOS FILTROS
const filtros = reactive({
  dia: '',
  horas: '',
  bloco: '',
  sala: '',
  professor: '',
  disciplina: '',
  curso: ''
});
const mostrarFiltros = ref(true);

// 3. DEBOUNCE (agora reativo com `reactive`)
// Para usar o debounce, precisamos de um ref, então criamos um a partir do objeto reativo
const filtrosRef = ref(filtros);
const debouncedFiltros = useDebounce(filtrosRef, 300);

// 4. LÓGICA DE FILTRAGEM E OPÇÕES
const opcoes = computed(() => {
  if (!dados.value || dados.value.length === 0) {
    return { salas: [], professores: [], disciplinas: [], cursos: [], horarios: [], blocos: [] };
  }
  const salas = new Set<string>(), professores = new Set<string>(), disciplinas = new Set<string>(), cursos = new Set<string>(), horas = new Set<string>(), blocos = new Set<string>();
  dados.value.forEach(item => {
    if (item.sala) salas.add(item.sala);
    if (item.professor) professores.add(item.professor);
    if (item.disciplina) disciplinas.add(item.disciplina);
    if (item.curso) cursos.add(item.curso);
    if (item.horas) horas.add(item.horas);
    if (item.bloco) blocos.add(item.bloco);
  });
  return {
    salas: Array.from(salas).sort(),
    professores: Array.from(professores).sort(),
    disciplinas: Array.from(disciplinas).sort(),
    cursos: Array.from(cursos).sort(),
    horas: Array.from(horas).sort(),
    blocos: Array.from(blocos).sort()
  };
});

const dadosFiltrados = computed(() => {
  if (!dados.value) return [];
  const f = debouncedFiltros.value;
  return dados.value.filter(item => {
    return (
      (!f.dia || item.dia.toLowerCase().includes(f.dia.toLowerCase())) &&
      (!f.bloco || item.bloco.toLowerCase().includes(f.bloco.toLowerCase())) &&
      (!f.sala || item.sala.toLowerCase().includes(f.sala.toLowerCase())) &&
      (!f.professor || item.professor.toLowerCase().includes(f.professor.toLowerCase())) &&
      (!f.disciplina || item.disciplina.toLowerCase().includes(f.disciplina.toLowerCase())) &&
      (!f.curso || item.curso.toLowerCase().includes(f.curso.toLowerCase())) &&
      (!f.horas || item.horas.includes(f.horas))
    );
  });
});

const limparFiltros = () => {
  Object.assign(filtros, {
    dia: '',
    horas: '',
    bloco: '',
    sala: '',
    professor: '',
    disciplina: '',
    curso: ''
  });
};

const temFiltrosAtivos = computed(() => Object.values(filtros).some(f => f));

</script>

<template>
  <TelaCarregando v-if="carregando" />
  <TelaErro v-else-if="erro" :erro="erro" />
  
  <div v-else class="app-container">
    <div class="content-wrapper">
      <Header />

      <div class="filters-section">
        <div class="filters-controls">
          <button
            @click="mostrarFiltros = !mostrarFiltros"
            class="button-filter"
          >
            <Filter />
            Filtros
          </button>
          
          <button
            v-if="temFiltrosAtivos"
            @click="limparFiltros"
            class="button-clear"
          >
            <X />
            Limpar
          </button>

          <div class="update-info">
            Dados atualizados da planilha Google Sheets
          </div>
        </div>

        <FiltrosPainel 
          v-if="mostrarFiltros"
          :filtros="filtros" 
          :opcoes="opcoes"
          @update:filtros="Object.assign(filtros, $event)" 
        />
      </div>

      <div class="results-section">
        <div class="results-info">
          <Search />
          <span>{{ dadosFiltrados.length }} resultado(s) encontrado(s)</span>
        </div>
        <ResultadosLista :dados="dadosFiltrados" />
      </div>

      <Footer />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.content-wrapper {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: 2rem;
}

.filters-section {
  margin-bottom: 2rem;
}

.filters-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.button-filter, .button-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  font-weight: 600;
}

.button-filter {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.button-filter:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}

.button-clear {
  background-color: var(--color-secondary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.button-clear:hover {
  background-color: #5a6268;
  box-shadow: var(--shadow-md);
}

.update-info {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.results-section {
  margin-top: 2rem;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 500;
}
</style>
