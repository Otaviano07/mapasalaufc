<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Importa useRouter
import { MapPin, QrCode, User, Navigation, ArrowLeft } from 'lucide-vue-next'; // Importa ArrowLeft
import ModalQrCodeScanner from '../components/ModalQrCodeScanner.vue';
import MapaEsquematico from '../components/MapaEsquematico.vue';
import { locations } from '../utils/locations'; // Importa os locais do mapa
import { globalOrigin, globalOriginDescription } from '../hooks/useOrigin'; // Importa o estado global

const route = useRoute();
const router = useRouter(); // Instancia o router

const bloco = computed(() => route.params.bloco as string);
const sala = computed(() => route.params.sala as string);

// origin agora guarda a CHAVE da localização (ex: 'entrada_pici_1')
const origin = ref<string | null>(null);

// originDescription é computado com base na chave de origem selecionada
const originDescription = computed(() => {
  if (origin.value && locations[origin.value]) {
    return locations[origin.value].name;
  } else if (origin.value === 'geolocalizacao_padrao') {
    return 'Sua Localização Atual (Padrão)';
  }
  return null;
});

const showScanner = ref(false);

onMounted(() => {
  // Se houver uma origem global definida (via QR Code na tela inicial),
  // usa-a como origem inicial e limpa o estado global.
  if (globalOrigin.value) {
    origin.value = globalOrigin.value;
    globalOrigin.value = null; // Limpa para não persistir em outras navegações
    globalOriginDescription.value = null; // Limpa a descrição também
  }
});

const getUserLocation = () => {
  // Para o mapa esquemático, assumimos que a localização do usuário é um ponto padrão.
  // Poderíamos usar a geolocalização real para tentar encontrar o ponto mais próximo.
  origin.value = 'entrada_pici_1'; // Exemplo: define a entrada principal como origem padrão
};

const handleQrScanned = (qrData: string) => {
  // Assumimos que o QR code contém uma chave de localização válida (ex: 'ru', '910')
  if (locations[qrData]) {
    origin.value = qrData;
  } else {
    alert(`QR Code inválido ou local desconhecido: ${qrData}`);
  }
  showScanner.value = false;
};

const goBack = () => {
  router.back(); // Volta para a rota anterior
};

</script>

<template>
  <div class="local-page">
    <button @click="goBack" class="back-button">
      <ArrowLeft />
      <span>Voltar</span>
    </button>
    <h2 class="destination-title">
      <Navigation class="destination-icon" />
      Como chegar em: <strong>Bloco {{ bloco }}, Sala {{ sala }}</strong>
    </h2>

    <div v-if="!origin" class="origin-selector">
      <h3>Escolha um ponto de partida:</h3>
      <div class="origin-options">
        <select v-model="origin" class="location-select">
          <option :value="null" disabled>Selecione sua origem</option>
          <option v-for="(loc, key) in locations" :key="key" :value="key">
            {{ loc.name }}
          </option>
        </select>

        <button @click="getUserLocation" class="origin-button">
          <User class="origin-icon" />
          <span>Usar minha localização</span>
        </button>
        <button @click="showScanner = true" class="origin-button">
          <QrCode class="origin-icon" />
          <span>Escanear QR Code de Origem</span>
        </button>
      </div>
    </div>

    <div v-if="origin" class="route-display">
      <div class="route-points">
        <div class="route-point">
          <span class="point-label">Partida:</span>
          <span class="point-value">{{ originDescription }}</span>
        </div>
        <div class="route-point">
          <span class="point-label">Destino:</span>
          <span class="point-value">Bloco {{ bloco }}, Sala {{ sala }}</span>
        </div>
      </div>

      <MapaEsquematico :origin="origin" :destination="bloco" />

       <button @click="origin = null" class="change-origin-button">
          Alterar Ponto de Partida
        </button>
    </div>

    <ModalQrCodeScanner 
      v-if="showScanner" 
      @close="showScanner = false" 
      @qrCodeScanned="handleQrScanned"
    />
  </div>
</template>

<style scoped>
.local-page {
  padding: 1rem;
}



.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  color: #333;
}

.back-button:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

.back-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.destination-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1rem; /* Ajuste a margem superior */
  margin-bottom: 2rem;
}

.destination-icon {
  width: 1.75rem;
  height: 1.75rem;
}

.origin-selector h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.origin-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.location-select {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 1rem;
  min-width: 200px;
}

.origin-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.origin-button:hover {
  background-color: #f0f0f0;
  border-color: #999;
}

.origin-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.route-display {
  margin-top: 2rem;
}

.route-points {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.route-point {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.route-point:last-child {
  margin-bottom: 0;
}

.point-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.change-origin-button {
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #e9ecef;
  color: #495057;
  cursor: pointer;
  transition: background-color 0.2s;
}

.change-origin-button:hover {
  background-color: #dee2e6;
}
</style>