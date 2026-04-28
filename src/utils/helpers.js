export const uid = () => Math.random().toString(36).substr(2, 9);

export const fmtDate = (s) => {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
};

export const fmtDatePtBr = (s) => {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
};

export const fmtDateTime = (date, time) => {
  if (!date) return '';
  return `${fmtDate(date)}${time ? ` às ${time}` : ''}`;
};

// Calcular duração do voo
export const calcularDuracaoVoo = (horaSaida, horaChegada) => {
  if (!horaSaida || !horaChegada) return '';
  
  try {
    const [saidaH, saidaM] = horaSaida.split(':').map(Number);
    const [chegadaH, chegadaM] = horaChegada.split(':').map(Number);
    
    let minutosSaida = saidaH * 60 + saidaM;
    let minutosChegada = chegadaH * 60 + chegadaM;
    
    if (minutosChegada < minutosSaida) {
      minutosChegada += 24 * 60;
    }
    
    const diffMinutos = minutosChegada - minutosSaida;
    const horas = Math.floor(diffMinutos / 60);
    const minutos = diffMinutos % 60;
    
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  } catch (e) {
    return '';
  }
};

// Calcular duração total da viagem em dias
export const calcularDuracaoViagem = (dataInicio, dataFim) => {
  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Validar código de aeroporto (3 letras)
export const validarCodigoAeroporto = (codigo) => {
  if (!codigo) return true; // Campo opcional
  return /^[A-Z]{3}$/.test(codigo.toUpperCase());
};

// Validar datas
export const validarDatas = (dataIda, dataVolta) => {
  if (!dataIda || !dataVolta) return true;
  return new Date(dataIda) <= new Date(dataVolta);
};

// Máscara de telefone
export const mascaraTelefone = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }
  return value;
};

export const novoTrecho = (tipo = 'IDA') => ({
  id: uid(),
  tipo,
  origemCod: '',
  destinoCod: '',
  cidadeOrigem: '',
  cidadeDestino: '',
  data: '',
  horaSaida: '',
  horaChegada: '',
  cia: '',
  numVoo: '',
  indicador: '',
  bagQtd: '',
  bagKg: '',
  bagMao: '',
  localizadores: [{ id: uid(), code: '', pax: '' }],
  obs: ''
});

export const novaHosp = () => ({
  id: uid(),
  inicio: '',
  fim: '',
  hotel: '',
  codigo: '',
  obs: '',
  // Novos campos
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: '',
  cep: '',
  checkinHorario: '',
  checkoutHorario: '',
  cafeIncluso: false,
  tipoCafe: '',
  wifi: false,
  estacionamento: false,
  quartoNumero: '',
  tipoQuarto: '',
  contatoHotel: '',
  emailHotel: '',
  linkMaps: '',
  instrucoesCheckin: ''
});

export const novoIngresso = () => ({
  id: uid(),
  nome: '',
  data: '',
  horario: '',
  codigo: '',
  quantidade: '1',
  obs: ''
});

// Notas gerais da viagem
export const notasGlobais = {
  passaporte: false,
  visto: false,
  vacinas: false,
  seguro: false,
  checkinRealizado: false,
  observacoes: ''
};

export const CIAS = [
  "LATAM", "GOL", "Azul", "American Airlines", "Delta", "United",
  "Emirates", "TAP", "Iberia", "Air France", "Lufthansa", "British Airways",
  "Copa Airlines", "Aeromexico", "Avianca", "JetBlue", "Turkish Airlines",
  "Qatar Airways", "Outra"
];

export const TIPOS_QUARTO = [
  "Standard", "Superior", "Deluxe", "Suite", "Presidencial", "Família", "Executivo"
];

export const TIPOS_CAFE = [
  "Continental", "Buffet", "Americano", "Completo", "Light", "Não incluso"
];

export const limparLocalStorageCorrompido = () => {
  try {
    const s = localStorage.getItem('gvs_itinerario');
    if (s) {
      const parsed = JSON.parse(s);
      
      if (!parsed || typeof parsed !== 'object') {
        localStorage.removeItem('gvs_itinerario');
        return true;
      }
      
      if (!Array.isArray(parsed.nomes)) {
        localStorage.removeItem('gvs_itinerario');
        return true;
      }
      
      if (!Array.isArray(parsed.ingressos)) {
        localStorage.removeItem('gvs_itinerario');
        return true;
      }
      
      if (!Array.isArray(parsed.trechos)) {
        localStorage.removeItem('gvs_itinerario');
        return true;
      }
      
      if (!Array.isArray(parsed.hospedagens)) {
        localStorage.removeItem('gvs_itinerario');
        return true;
      }
    }
  } catch (e) {
    console.error('Erro ao limpar localStorage corrompido:', e);
    localStorage.removeItem('gvs_itinerario');
    return true;
  }
  return false;
};

export const LOGO_URL = "images/Logo.png";