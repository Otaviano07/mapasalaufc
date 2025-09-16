<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Search, Filter, X, Star, Clock, RefreshCw, Menu } from 'lucide-vue-next';

import { usePlanilhaData, type Aula } from '../hooks/usePlanilhaData';
import { useDebounce } from '../hooks/useDebounce';
import { useFavorites } from '../hooks/useFavorites';
import { globalOrigin, globalOriginDescription } from '../hooks/useOrigin'; // Importa o estado global
import { locations } from '../utils/locations'; // Para validar o QR Code

import ModalFiltro from '../components/ModalFiltro.vue';
import ResultadosLista from '../components/ResultadosLista.vue';
import TelaCarregando from '../components/TelaCarregando.vue';
import TelaErro from '../components/TelaErro.vue';
import TelaInicial from '../components/TelaInicial.vue';

const { dados, carregando, erro, carregarDados } = usePlanilhaData();

const dadosCarregados = ref(false);

const iniciarAplicacao = async () => {
  dadosCarregados.value = true;
  await carregarDados();
};

const handleQrCodeScannedFromInitialScreen = (qrData: string) => {
  // Assumimos que o QR code contém uma chave de localização válida (ex: 'ru', '910')
  if (locations[qrData]) {
    globalOrigin.value = qrData;
    globalOriginDescription.value = locations[qrData].name;
    alert(`Origem definida via QR Code: ${locations[qrData].name}`);
  } else {
    alert(`QR Code inválido ou local desconhecido: ${qrData}`);
  }
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

</script>

<template>
  <TelaInicial v-if="!dadosCarregados" @iniciarBusca="iniciarAplicacao" @qrCodeScanned="handleQrCodeScannedFromInitialScreen" />

  <TelaCarregando v-else-if="carregando" />
  <TelaErro v-else-if="erro" :erro="erro" />
  
  <div v-else>
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
</template>
