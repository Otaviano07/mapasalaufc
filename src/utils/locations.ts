export const locations = {
  // Entradas
  'entrada_pici_1': { x: 50, y: 480, name: 'Entrada Principal' },
  'entrada_castelo_branco': { x: 850, y: 450, name: 'Entrada Castelo Branco' },

  // Blocos de Tecnologia
  '910': { x: 200, y: 350, name: 'Bloco 910' },
  '911': { x: 250, y: 350, name: 'Bloco 911' },
  '950': { x: 200, y: 280, name: 'Bloco 950 (DEE)' },
  '951': { x: 250, y: 280, name: 'Bloco 951' },
  '952': { x: 300, y: 280, name: 'Bloco 952 (DETI)' },

  // Outros Blocos e Pontos
  '902': { x: 450, y: 150, name: 'Bloco 902 (Física)' },
  '940': { x: 550, y: 250, name: 'Bloco 940 (Matemática)' },
  'ru': { x: 400, y: 400, name: 'Restaurante Universitário' },
  'biblioteca': { x: 350, y: 200, name: 'Biblioteca' },
};

export const paths = [
  // Exemplo de caminho da Entrada Principal para o Bloco 910
  { from: 'entrada_pici_1', to: '910', points: [{x: 50, y: 480}, {x: 50, y: 380}, {x: 150, y: 380}, {x: 200, y: 350}] },
  // Exemplo de caminho do RU para o Bloco 950
  { from: 'ru', to: '950', points: [{x: 400, y: 400}, {x: 400, y: 300}, {x: 250, y: 300}, {x: 200, y: 280}] },
  // Exemplo de caminho do Bloco 910 para o Bloco 952
  { from: '910', to: '952', points: [{x: 200, y: 350}, {x: 200, y: 300}, {x: 300, y: 280}] },
];