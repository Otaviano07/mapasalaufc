<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { QrCode, Download } from 'lucide-vue-next';
import ModalQrCodeScanner from './ModalQrCodeScanner.vue';

const emit = defineEmits(['iniciarBusca', 'qrCodeScanned']);

const showQrScanner = ref(false);

const iniciarBusca = () => {
  emit('iniciarBusca');
};

const handleQrCodeScanned = (qrCodeData: string) => {
  showQrScanner.value = false;
  emit('qrCodeScanned', qrCodeData);
};
</script>

<template>
  <div class="initial-screen-container">
    <div class="initial-screen-content">
      <h1>Bem-vindo ao Mapa de Salas UFC</h1>
      <p>Encontre facilmente salas, professores e disciplinas na UFC.</p>
      <div class="button-group">
        <button @click="iniciarBusca" class="action-button primary">
          <Download />
          Buscar Dados da Planilha
        </button>
        <button @click="showQrScanner = true" class="action-button secondary">
          <QrCode />
          Escanear QR Code
        </button>
      </div>
    </div>
  </div>

  <ModalQrCodeScanner 
    v-if="showQrScanner" 
    @scan-success="handleQrCodeScanned" 
    @close="showQrScanner = false" 
  />
</template>

<style scoped>
.initial-screen-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
  background-color: var(--color-background);
}

.initial-screen-content {
  background-color: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.action-button.primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.action-button.primary:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-lg);
}

.action-button.secondary {
  background-color: var(--color-secondary);
  color: white;
  box-shadow: var(--shadow-md);
}

.action-button.secondary:hover {
  background-color: #5a6268;
  box-shadow: var(--shadow-lg);
}
</style>
