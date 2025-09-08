<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader';
import { X } from 'lucide-vue-next';

const emit = defineEmits(['scan-success', 'close']);

const decodedText = ref('');
const error = ref('');

const onDetect = (detectedCodes: any) => {
  if (detectedCodes.length > 0) {
    decodedText.value = detectedCodes[0].rawValue;
    emit('scan-success', decodedText.value);
  }
};

const onError = (err: any) => {
  error.value = `Erro: ${err.message}`;
  console.error(err);
};

const close = () => {
  emit('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Escanear QR Code</h2>
        <button @click="close" class="close-button">
          <X />
        </button>
      </div>
      <div class="scanner-container">
        <qrcode-stream @detect="onDetect" @error="onError"></qrcode-stream>
        <p v-if="decodedText" class="decoded-text">QR Code lido: {{ decodedText }}</p>
        <p v-if="error" class="error-text">{{ error }}</p>
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
  max-width: 600px;
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

.scanner-container {
  width: 100%;
  height: 300px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.decoded-text {
  margin-top: 1rem;
  font-weight: bold;
  color: var(--color-primary);
}

.error-text {
  margin-top: 1rem;
  color: red;
}
</style>