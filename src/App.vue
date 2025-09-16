<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Search, Filter, X, Star, Clock, RefreshCw, Menu } from 'lucide-vue-next';

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
const mostrarMenu = ref(false);

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

const isClassHappeningNow = (item: Aula) => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const dayMap: { [key: string]: number } = {
    'Domingo': 0,
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 4,
    'Sexta': 5,
    'Sábado': 6,
  };

  if (dayMap[item.dia] !== dayOfWeek) {
    return false;
  }

  const [start, end] = item.horas.replace('h', '').split('-').map(time => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 100 + minute;
  });

  return currentTime >= start && currentTime <= end;
};

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
          <div class="desktop-buttons">
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
              @click="mostrarApenasAgora = !mostrarApenasAgora; if (mostrarApenasAgora) mostrarApenasFavoritos = false;"
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

            <button
              @click="carregarDados()"
              class="button-filter"
            >
              <RefreshCw />
              Carregar
            </button>
          </div>

          <button @click="mostrarMenu = true" class="menu-button">
            <Menu />
          </button>

          
        </div>

        <ModalFiltro 
          :isVisible="mostrarModalFiltros"
          :filtros="filtros" 
          :opcoes="opcoes"
          @update:filtros="Object.assign(filtros, $event)"
          @close="mostrarModalFiltros = false"
        />

        <div v-if="mostrarMenu" class="menu-modal">
          <div class="menu-modal-content">
            <button @click="mostrarMenu = false" class="close-button">
              <X />
            </button>
            <div class="mobile-buttons">
              <button
                @click="mostrarModalFiltros = true; mostrarMenu = false;"
                class="button-filter"
              >
                <Filter />
                Filtros
              </button>

              <button
                @click="mostrarApenasFavoritos = !mostrarApenasFavoritos; if (mostrarApenasFavoritos) mostrarApenasAgora = false; mostrarMenu = false;"
                :class="['button-filter', { 'button-filter--active': mostrarApenasFavoritos }]"
              >
                <Star :fill="mostrarApenasFavoritos ? '#FFD700' : 'none'" :color="mostrarApenasFavoritos ? '#FFD700' : 'white'" />
                Favoritos
              </button>

              <button
                @click="mostrarApenasAgora = !mostrarApenasAgora; if (mostrarApenasAgora) mostrarApenasFavoritos = false; mostrarMenu = false;"
                :class="['button-filter', { 'button-filter--active': mostrarApenasAgora }]"
              >
                <Clock :color="mostrarApenasAgora ? '#FFD700' : 'white'" />
                Agora
              </button>

              <button
                v-if="temFiltrosAtivos"
                @click="limparFiltros; mostrarMenu = false;"
                class="button-clear"
              >
                <X />
                Limpar
              </button>

              <button
                @click="carregarDados(); mostrarMenu = false;"
                class="button-filter"
              >
                <RefreshCw />
                Carregar
              </button>
            </div>
          </div>
        </div>
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
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.desktop-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.menu-button {
  display: none;
  background-color: var(--color-primary);
  color: white;
  padding: 0.6em;
  border-radius: 8px;
  cursor: pointer;
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
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-modal-content .close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-text-light);
}

.mobile-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .desktop-buttons {
    display: none;
  }

  .menu-button {
    display: flex;
  }
}

.button-filter, .button-clear {
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