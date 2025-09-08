<template>
    <footer class="footer">
        <p>Universidade Federal do Ceará - Campus de Russas</p>
        <p>Avenida Felipe Santiago, 411, Bairro Campo Federal, CEP: 62900-420</p>
        <p>Telefone: (88) 3411-9218 | E-mail: russas@ufc.br | Site: russas.ufc.br</p>
    </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  margin-top: 2.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-light);
  background-color: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid #e9ecef;
}

.footer p {
  margin-bottom: 0.6rem;
  line-height: 1.4;
}

.footer p:last-child {
  margin-bottom: 0;
}
</style>