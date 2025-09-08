<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Search, Filter, X } from 'lucide-vue-next';

import { usePlanilhaData, type Aula } from './hooks/usePlanilhaData';
import { useDebounce } from './hooks/useDebounce';
import { useFavorites } from './hooks/useFavorites';

import Header from './components/Header.vue';
import TelaInicial from './components/TelaInicial.vue';
import ModalFiltro from './components/ModalFiltro.vue';
import ModalQrAction from './components/ModalQrAction.vue';
import ResultadosLista from './components/ResultadosLista.vue';
import TelaCarregando from './components/TelaCarregando.vue';
import TelaErro from './components/TelaErro.vue';
import Footer from './components/Footer.vue';

const { dados, carregando, erro, carregarDados } = usePlanilhaData();

const dadosCarregados = ref(false);

const iniciarAplicacao = async () => {
  dadosCarregados.value = true;
  await carregarDados();
};

const showQrActionModal = ref(false);
const scannedQrCodeData = ref('');

const handleQrCodeScanned = (qrData: string) => {
  if (qrData === import.meta.env.VITE_DOCUMENT_VIEW_URL) {
    scannedQrCodeData.value = qrData;
    showQrActionModal.value = true;
  } else {
    alert("QR Code inválido. Por favor, escaneie o QR Code do documento de horários.");
    scannedQrCodeData.value = ''; // Clear previous data
    showQrActionModal.value = false;
  }
};

const handleViewFile = (qrData: string) => {
  window.open(import.meta.env.VITE_DOCUMENT_VIEW_URL, "_blank");
};

const handleUpdateSpreadsheet = async (qrData: string) => {
  await carregarDados();
  dadosCarregados.value = true;
};

const { favorites, isFavorited, toggleFavorite } = useFavorites();

const filtros = reactive({
  dia: '',
  horas: '',
  bloco: '',
  sala: '',
  professor: '',
  disciplina: ''
});
const mostrarModalFiltros = ref(false);
const mostrarApenasFavoritos = ref(false);
const mostrarApenasAgora = ref(false);

const filtrosRef = ref(filtros);
const debouncedFiltros = useDebounce(filtrosRef, 300);

const opcoes = computed(() => {
  if (!dados.value || dados.value.length === 0) {
    return { salas: [], professores: [], disciplinas: [], horas: [], blocos: [] };
  }
  const salas = new Set<string>(), professores = new Set<string>(), disciplinas = new Set<string>(), horas = new Set<string>(), blocos = new Set<string>();
  dados.value.forEach(item => {
    if (item.sala) salas.add(item.sala);
    if (item.professor) professores.add(item.professor);
    if (item.disciplina) disciplinas.add(item.disciplina);
    if (item.horas) horas.add(item.horas);
    if (item.bloco) blocos.add(item.bloco);
  });
  return {
    salas: Array.from(salas).sort(),
    professores: Array.from(professores).sort(),
    disciplinas: Array.from(disciplinas).sort(),
    horas: Array.from(horas).sort(),
    blocos: Array.from(blocos).sort()
  };
});

const dadosFiltrados = computed(() => {
  if (!dados.value) return [];
  const f = debouncedFiltros.value;

  const generateAulaId = (item: Aula) => {
    return `${item.disciplina}-${item.professor}-${item.dia}-${item.horas}-${item.sala}`;
  };

  let filtered = dados.value.filter(item => {
    return (
      (!f.dia || item.dia.toLowerCase().includes(f.dia.toLowerCase())) &&
      (!f.bloco || item.bloco.toLowerCase().includes(f.bloco.toLowerCase())) &&
      (!f.sala || item.sala.toLowerCase().includes(f.sala.toLowerCase())) &&
      (!f.professor || item.professor.toLowerCase().includes(f.professor.toLowerCase())) &&
      (!f.disciplina || item.disciplina.toLowerCase().includes(f.disciplina.toLowerCase())) &&
      (!f.horas || item.horas.includes(f.horas))
    );
  });

  if (mostrarApenasFavoritos.value) {
    filtered = filtered.filter(item => isFavorited(generateAulaId(item)));

    const dayOrder: { [key: string]: number } = {
      'Segunda': 1,
      'Terça': 2,
      'Quarta': 3,
      'Quinta': 4,
      'Sexta': 5,
      'Sábado': 6,
      'Domingo': 7,
    };

    filtered.sort((a, b) => {
      const dayA = dayOrder[a.dia] || 99;
      const dayB = dayOrder[b.dia] || 99;

      if (dayA !== dayB) {
        return dayA - dayB;
      }

      return a.disciplina.localeCompare(b.disciplina);
    });
  } else if (mostrarApenasAgora.value) {
    console.log('Filtering for current time classes...');
    filtered = filtered.filter(item => isClassHappeningNow(item));
  }

  return filtered;
});

const limparFiltros = () => {
  Object.assign(filtros, {
    dia: '',
    horas: '',
    bloco: '',
    sala: '',
    professor: '',
    disciplina: ''
  });
};

const temFiltrosAtivos = computed(() => Object.values(filtros).some(f => f));

</script>

<template>
  <TelaInicial v-if="!dadosCarregados" @iniciarBusca="iniciarAplicacao" @qrCodeScanned="handleQrCodeScanned" />

  <TelaCarregando v-else-if="carregando" />
  <TelaErro v-else-if="erro" :erro="erro" />
  
  <div v-else class="app-container">
    <div class="content-wrapper">
      <Header />

      <div class="filters-section">
        <div class="filters-controls">
          <button
            @click="mostrarModalFiltros = true"
            class="button-filter"
          >
            <Filter />
            Filtros
          </button>

          <button
            @click="mostrarApenasFavoritos = !mostrarApenasFavoritos; if (mostrarApenasFavoritos) mostrarApenasAgora = false;"
            :class="['button-filter', { 'button-filter--active': mostrarApenasFavoritos }]"
          >
            <Star :fill="mostrarApenasFavoritos ? '#FFD700' : 'none'" :color="mostrarApenasFavoritos ? '#FFD700' : 'white'" />
            Favoritos
          </button>

          <button
            @click="mostrarApenasAgora = !mostrarApenasAgora; if (mostrarApenasAgora) mostrarApenasFavoritos = false; console.log('mostrarApenasAgora toggled:', mostrarApenasAgora.value);"
            :class="['button-filter', { 'button-filter--active': mostrarApenasAgora }]"
          >
            <Clock :color="mostrarApenasAgora ? '#FFD700' : 'white'" />
            Agora
          </button>

          <button
            v-if="temFiltrosAtivos"
            @click="limparFiltros"
            class="button-clear"
          >
            <X />
            Limpar
          </button>

          
        </div>

        <ModalFiltro 
          :isVisible="mostrarModalFiltros"
          :filtros="filtros" 
          :opcoes="opcoes"
          @update:filtros="Object.assign(filtros, $event)"
          @close="mostrarModalFiltros = false"
        />
      </div>

      <div class="results-section">
        <div class="results-info">
          <Search />
          <span>{{ dadosFiltrados.length }} resultado(s) encontrado(s)</span>
        </div>
        <ResultadosLista 
          :dados="dadosFiltrados" 
          :isFavorited="isFavorited" 
          :toggleFavorite="toggleFavorite" 
        />
      </div>

      <Footer />
    </div>
  </div>

  <ModalQrAction
    :isVisible="showQrActionModal"
    :qrCodeData="scannedQrCodeData"
    @close="showQrActionModal = false"
    @view-file="handleViewFile"
    @update-spreadsheet="handleUpdateSpreadsheet"
  />
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

.button-filter--active {
  background-color: var(--color-primary);
  color: white;
}

.button-filter--active:hover {
  background-color: var(--color-primary-dark);
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