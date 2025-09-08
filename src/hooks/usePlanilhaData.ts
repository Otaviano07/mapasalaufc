import { ref, onMounted } from 'vue';
import Papa from 'papaparse';

const PLANILHA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRYPBiypdSwCluFErtNcLrCR8Ey2J5ltpT9W8jxrbrTXIdJwAkBABE0xrZ8Ltk_dAhllelxTjN_Auv/pub?gid=221360036&single=true&output=tsv";

export interface Aula {
  bloco: string;
  sala: string;
  unidade: string;
  dia: string;
  horas: string;
  curso: string;
  disciplina: string;
  professor: string;
  extra: boolean;
}

export function usePlanilhaData() {
  const dados = ref<Aula[]>([]);
  const carregando = ref(true);
  const erro = ref<string | null>(null);

  const carregarDados = async () => {
    try {
      carregando.value = true;
      erro.value = null;

      const response = await fetch(PLANILHA_URL);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados da planilha');
      }

      const tsvData = await response.text();
      
      Papa.parse(tsvData, {
        delimiter: '\t',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => (
          header.trim().toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^\w]/g, '_')
            .replace(/__+/g, '_')
            .replace(/^_|_$/g, '')
        ),
        transform: (value: string) => value.trim(),
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('Avisos durante o parse:', results.errors);
          }
          
          const dadosProcessados = results.data
            .filter((row: any) => row.sala && row.disciplina)
            .map((row: any): Aula => ({
              bloco: row.bloco || '',
              sala: row.sala || '',
              unidade: row.unidade || '',
              dia: row.dia || '',
              horas: row.horas || '',
              curso: row.curso || '',
              disciplina: row.disciplina || '',
              professor: row.professor || '',
              extra: row.extra === 'true' || row.extra === '1' || false
            }));

          dados.value = dadosProcessados;
          carregando.value = false;
        },
        error: (error: any) => {
          console.error('Erro no parse:', error);
          erro.value = 'Erro ao processar dados da planilha';
          carregando.value = false;
        }
      });

    } catch (error: any) {
      console.error('Erro ao carregar planilha:', error);
      erro.value = 'Erro ao conectar com a planilha do Google Sheets';
      carregando.value = false;
    }
  };

  onMounted(carregarDados);

  return { dados, carregando, erro };
}