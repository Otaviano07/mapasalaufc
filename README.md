# Mapa de Salas - UFC Russas

Este projeto é uma aplicação web desenvolvida com Vue 3 e Vite, projetada para facilitar a consulta de horários e disponibilidade de salas na UFC Russas para o semestre 2025.2.

## Funcionalidades

-   **Consulta de Aulas:** Visualize uma lista de aulas com detalhes como disciplina, professor, sala, bloco, dia e horário.
-   **Filtros Detalhados:**
    -   **Dia da Semana:** Filtre aulas por dia específico (Segunda, Terça, etc.).
    -   **Bloco:** Encontre aulas em blocos específicos.
    -   **Sala:** Busque aulas por número ou nome da sala.
    -   **Professor:** Filtre aulas ministradas por um professor específico.
    -   **Disciplina:** Encontre aulas de uma disciplina específica.
    -   **Curso/Turma:** Filtre por curso ou turma.
    -   **Horário:** Busque aulas em horários específicos.
-   **Interface Moderna e Responsiva:** Design limpo e intuitivo, otimizado para diferentes tamanhos de tela.
-   **Dados Dinâmicos:** Os dados são carregados de uma planilha Google Sheets (via `usePlanilhaData` hook), permitindo atualizações fáceis.

## Tecnologias Utilizadas

-   **Vue 3:** Framework progressivo para construção de interfaces de usuário.
-   **Vite:** Ferramenta de build rápida para desenvolvimento web moderno.
-   **TypeScript:** Linguagem que adiciona tipagem estática ao JavaScript.
-   **CSS Puro (com Variáveis CSS):** Estilização moderna e profissional, focada em consistência e usabilidade.
-   **Lucide Vue Next:** Biblioteca de ícones para uma interface visualmente rica.

## Como Rodar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Otaviano07/mapasalaufc.git
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd mapasalaufc
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O aplicativo estará disponível em `http://localhost:5173/`.

## Estrutura do Projeto

```
mapa-sala/
├── public/
├── src/
│   ├── assets/ (se houver)
│   ├── components/
│   │   ├── AulaCard.vue
│   │   ├── FiltroInput.vue
│   │   ├── FiltrosPainel.vue
│   │   ├── Footer.vue
│   │   ├── Header.vue
│   │   ├── ResultadosLista.vue
│   │   ├── TelaCarregando.vue
│   │   └── TelaErro.vue
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── usePlanilhaData.ts
│   ├── App.vue
│   ├── index.css
│   └── main.ts
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.js
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

[Adicione sua licença aqui, por exemplo, MIT]