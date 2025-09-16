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
  if (!item || !item.dia || !item.horas) {
    return false;
  }

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

  const timeParts = item.horas.replace(/h/g, '').split('-');
  if (timeParts.length !== 2) {
    return false;
  }

  const [startStr, endStr] = timeParts;
  
  const parseTime = (timeStr: string) => {
    if (!timeStr) return NaN;
    const [hour, minute] = timeStr.trim().split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return NaN;
    return hour * 100 + minute;
  };

  const start = parseTime(startStr);
  const end = parseTime(endStr);

  if (isNaN(start) || isNaN(end)) {
    return false;
  }

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
              <Star />
              Favoritos
            </button>

            <button
              @click="mostrarApenasAgora = !mostrarApenasAgora; if (mostrarApenasAgora) mostrarApenasFavoritos = false;"
              :class="['button-filter', { 'button-filter--active': mostrarApenasAgora }]"
            >
              <Clock />
              Agora
            </button>

            <button
              @click="carregarDados()"
              class="button-filter"
            >
              <RefreshCw />
              Carregar
            </button>
          </div>

          <div class="menu-container">
            <button @click="mostrarMenu = !mostrarMenu" class="menu-button">
              <Menu />
            </button>

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
                    <Star />
                    Favoritos
                  </button>

                  <button
                    @click="mostrarApenasAgora = !mostrarApenasAgora; if (mostrarApenasAgora) mostrarApenasFavoritos = false; mostrarMenu = false;"
                    :class="['button-filter', { 'button-filter--active': mostrarApenasAgora }]"
                  >
                    <Clock />
                    Agora
                  </button>

                  <button
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
        </div>

        <ModalFiltro
          :isVisible="mostrarModalFiltros"
          :filtros="filtros"
          :opcoes="opcoes"
          @update:filtros="Object.assign(filtros, $event)"
          @close="mostrarModalFiltros = false"
          @clear-filters="limparFiltros"
        />
      </div>

      <div class="results-section">
        <ResultadosLista
          :dados="dadosFiltrados"
          :isFavorited="isFavorited"
          @toggle-favorite="toggleFavorite"
        />
      </div>

    </div>
      <Footer />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.content-wrapper {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.filters-section {
  margin-bottom: 1rem;
}

.filters-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.desktop-buttons {
  display: none;
}

@media (min-width: 768px) {
  .desktop-buttons {
    display: flex;
    gap: 0.5rem;
  }
}

.button-filter, .button-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: #f1f3f5;
  color: #343a40;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.button-filter:hover, .button-clear:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.button-filter--active {
  background-color: #4C6EF5;
  color: #fff;
  box-shadow: 0 2px 6px rgba(76, 110, 245, 0.4);
  transform: translateY(-1px);
}

.button-filter svg,
.button-clear svg {
  color: #495057;
  transition: color 0.2s ease-in-out;
}

.button-filter--active svg {
  color: #fff;
}

.button-filter--active .lucide-star {
  fill: #fff;
}

.menu-container {
  position: relative;
  display: block;
}

@media (min-width: 768px) {
  .menu-container {
    display: none;
  }
}

.menu-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #495057;
  transition: all 0.2s ease-in-out;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-button:hover {
  color: #4C6EF5;
  background-color: #f1f3f5;
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
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.mobile-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-section {
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
}
</style>