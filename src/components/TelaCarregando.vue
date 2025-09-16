<script setup lang="ts">
import { Loader } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
    <div class="text-center">
      <div class="bg-white rounded-xl shadow-lg p-8">
        <Loader class="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Carregando dados...</h3>
        <p class="text-gray-500">Buscando informações</p>
      </div>
    </div>
  </div>
</template>