<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  qrCodeData: string;
  isVisible: boolean;
}>();

const emit = defineEmits(['close', 'view-file', 'update-spreadsheet']);

const close = () => {
  emit('close');
};

const viewFile = () => {
  emit('view-file', props.qrCodeData);
  close();
};

const updateSpreadsheet = () => {
  emit('update-spreadsheet', props.qrCodeData);
  close();
};
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>QR Code Escaneado</h2>
        <button @click="close" class="close-button">
          <X />
        </button>
      </div>
      <p class="scanned-data">Dados do QR Code: <strong>{{ qrCodeData }}</strong></p>
      <p class="action-prompt">O que você gostaria de fazer?</p>
      <div class="button-group">
        <button @click="viewFile" class="action-button primary">
          Visualizar Arquivo
        </button>
        <button @click="updateSpreadsheet" class="action-button secondary">
          Atualizar Planilha
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
  background-color: rgba(0, 0, 0, 0.7);
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
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
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

.scanned-data {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text-light);
  word-break: break-all;
}

.action-prompt {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-dark);
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
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