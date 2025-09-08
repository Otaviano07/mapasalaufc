
<script setup lang="ts">
import { X } from 'lucide-vue-next';

defineProps<{ erro: string | null }>();

const recarregarPagina = () => {
  window.location.reload();
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
    <div class="text-center">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <X class="w-6 h-6 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Erro ao carregar dados</h3>
        <p class="text-gray-500 mb-4">{{ erro }}</p>
        <button 
          @click="recarregarPagina"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  </div>
</template>
