import { ref, onMounted } from 'vue';
import Papa from 'papaparse';

const defaultPlanilhaUrl = import.meta.env.VITE_DEFAULT_PLANILHA_URL;
const planilhaUrl = ref(defaultPlanilhaUrl as string);

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
  const carregando = ref(false);
  const erro = ref<string | null>(null);

  const carregarDados = async (url?: string) => {
    const urlToFetch = url || planilhaUrl.value;
    if (!urlToFetch) {
      erro.value = "URL da planilha não definida.";
      carregando.value = false;
      return;
    }
    try {
      carregando.value = true;
      erro.value = null;

      const response = await fetch(urlToFetch);
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
          erro.value = 'Erro ao processar dados da planilha';
          carregando.value = false;
        }
      });

    } catch (error: any) {
      erro.value = 'Erro ao conectar com a planilha do Google Sheets';
      carregando.value = false;
    }
  };

  return { dados, carregando, erro, carregarDados };
}
