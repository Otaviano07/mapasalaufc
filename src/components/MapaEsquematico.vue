<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ZoomIn, ZoomOut, Maximize, Minimize, MapPin } from 'lucide-vue-next';
import { locations, paths } from '../utils/locations';

const props = defineProps<{
  origin: string | null;
  destination: string | null;
}>();

// --- Lógica de Zoom e Pan --- 
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

const MAP_WIDTH = 900;
const MAP_HEIGHT = 500;

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 3);
};

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.5);
};

const resetZoom = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

const startDrag = (event: MouseEvent) => {
  if (scale.value > 1) { // Só permite arrastar se houver zoom
    isDragging.value = true;
    startX.value = event.clientX - translateX.value;
    startY.value = event.clientY - translateY.value;
  }
};

const doDrag = (event: MouseEvent) => {
  if (!isDragging.value) return;
  translateX.value = event.clientX - startX.value;
  translateY.value = event.clientY - startY.value;
};

const endDrag = () => {
  isDragging.value = false;
};

const handleWheel = (event: WheelEvent) => {
  event.preventDefault();
  const scaleAmount = 0.1;
  const mouseX = event.clientX - (event.currentTarget as HTMLElement).getBoundingClientRect().left;
  const mouseY = event.clientY - (event.currentTarget as HTMLElement).getBoundingClientRect().top;

  const newScale = event.deltaY < 0 ? Math.min(scale.value + scaleAmount, 3) : Math.max(scale.value - scaleAmount, 0.5);

  // Ajusta a translação para manter o ponto do mouse fixo
  translateX.value = mouseX - (mouseX - translateX.value) * (newScale / scale.value);
  translateY.value = mouseY - (mouseY - translateY.value) * (newScale / scale.value);

  scale.value = newScale;
};

// --- Lógica de Tela Cheia ---
const mapContainerRef = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);

const toggleFullscreen = () => {
  if (!mapContainerRef.value) return;

  if (!document.fullscreenElement) {
    mapContainerRef.value.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error(`Erro ao tentar tela cheia: ${err.message}`);
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    }).catch(err => {
      console.error(`Erro ao sair da tela cheia: ${err.message}`);
    });
  }
};

onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

// --- Lógica de Caminho ---
const originCoords = computed(() => {
  if (!props.origin || !locations[props.origin]) return null;
  return locations[props.origin];
});

const destinationCoords = computed(() => {
  if (!props.destination || !locations[props.destination]) return null;
  return locations[props.destination];
});

const currentPathPoints = computed(() => {
  if (!originCoords.value || !destinationCoords.value) return '';

  // Tenta encontrar um caminho predefinido
  const foundPath = paths.find(p => 
    (p.from === props.origin && p.to === props.destination) ||
    (p.from === props.destination && p.to === props.origin) // Caminho inverso
  );

  if (foundPath) {
    // Se o caminho for inverso, inverte os pontos
    const points = (foundPath.from === props.origin) ? foundPath.points : [...foundPath.points].reverse();
    return points.map(p => `${p.x},${p.y}`).join(' ');
  } else {
    // Gera um caminho em L se não houver predefinido
    const ox = originCoords.value.x;
    const oy = originCoords.value.y;
    const dx = destinationCoords.value.x;
    const dy = destinationCoords.value.y;

    // Prioriza movimento horizontal primeiro, depois vertical
    return `${ox},${oy} ${dx},${oy} ${dx},${dy}`;
  }
});

</script>

<template>
  <div ref="mapContainerRef" class="map-container" :class="{ 'is-fullscreen': isFullscreen }"
    @mousedown="startDrag"
    @mousemove="doDrag"
    @mouseup="endDrag"
    @mouseleave="endDrag"
    @wheel="handleWheel"
  >
    <div class="map-controls">
      <button @click="zoomIn" class="map-control-button"><ZoomIn /></button>
      <button @click="zoomOut" class="map-control-button"><ZoomOut /></button>
      <button @click="resetZoom" class="map-control-button">1:1</button>
      <button @click="toggleFullscreen" class="map-control-button">
        <template v-if="!isFullscreen"><Maximize /></template>
        <template v-else><Minimize /></template>
      </button>
    </div>

    <svg :viewBox="`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`" class="schematic-map">
      <g :transform="`translate(${translateX}, ${translateY}) scale(${scale})`">
        <!-- Desenha todos os pontos de interesse -->
        <g v-for="(loc, key) in locations" :key="key">
          <rect 
            :x="loc.x - 15" 
            :y="loc.y - 10" 
            width="30" 
            height="20" 
            rx="3"
            :class="{
              'location-point': true,
              'is-origin': props.origin === key,
              'is-destination': props.destination === key
            }"
          />
          <text :x="loc.x" :y="loc.y + 25" text-anchor="middle" class="location-label">{{ loc.name }}</text>
        </g>

        <!-- Círculos para destacar origem e destino -->
        <circle 
          v-if="originCoords"
          :cx="originCoords.x"
          :cy="originCoords.y"
          r="8"
          fill="#2ECC40"
          stroke="white"
          stroke-width="2"
        />
        <circle 
          v-if="destinationCoords"
          :cx="destinationCoords.x"
          :cy="destinationCoords.y"
          r="8"
          fill="#FF4136"
          stroke="white"
          stroke-width="2"
        />

        <!-- Desenha a linha do caminho -->
        <polyline 
          v-if="currentPathPoints"
          :points="currentPathPoints"
          fill="none"
          stroke="#FF4136" 
          stroke-width="3" 
          stroke-dasharray="5,5"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.map-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
  padding: 1rem;
  margin-top: 2rem;
  position: relative; /* Necessário para o fullscreen */
  overflow: hidden; /* Esconde o conteúdo fora do viewBox */
  touch-action: none; /* Previne o comportamento padrão do touch */
}

.map-container.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000; /* Garante que fique por cima de outros elementos */
  background-color: #f8f9fa; /* Garante fundo consistente */
  border-radius: 0; /* Remove borda arredondada em fullscreen */
}

.schematic-map {
  width: 100%;
  height: auto;
  display: block; /* Remove espaço extra abaixo do SVG */
  cursor: grab;
}

.schematic-map.is-dragging {
  cursor: grabbing;
}

.location-point {
  fill: #adb5bd;
  transition: fill 0.3s ease;
}

.location-point.is-origin {
  fill: #2ECC40; /* Verde para origem */
}

.location-point.is-destination {
  fill: #FF4136; /* Vermelho para destino */
}

.location-label {
  font-size: 10px;
  font-family: sans-serif;
  fill: #495057;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 10; /* Garante que os controles fiquem acima do mapa */
}

.map-control-button {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: background-color 0.2s;
}

.map-control-button:hover {
  background-color: rgba(255, 255, 255, 1);
}

.map-control-button svg {
  width: 20px;
  height: 20px;
  color: #333;
}
</style>