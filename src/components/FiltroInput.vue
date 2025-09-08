<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  placeholder: string;
  listId: string;
  opcoes: string[];
}>();

defineEmits(['update:value']);
</script>

<template>
  <div class="filter-input-group">
    <label class="filter-label">{{ label }}</label>
    <input
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('update:value', ($event.target as HTMLInputElement).value)"
      :list="listId"
      class="filter-input"
    />
    <datalist :id="listId">
      <option v-for="opcao in opcoes" :key="opcao" :value="opcao">{{ opcao }}</option>
    </datalist>
  </div>
</template>

<style scoped>
.filter-input-group {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 0.6rem;
}

.filter-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #dce0e6;
  border-radius: 8px;
  background-color: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  font-size: 1rem;
  color: var(--color-dark);
}

.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.25);
}
</style>