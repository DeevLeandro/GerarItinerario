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
  bagPorPax: false,      // bagagem despachada: por passageiro?
  bagMaoQtd: '',         // quantidade bagagem de mão
  bagMaoKg: '',          // peso bagagem de mão
  bagMaoPorPax: false,   // bagagem de mão: por passageiro?
  bagMao: '',            // campo legado (mantido para compatibilidade)
  localizadores: [{ id: uid(), code: '', pax: '' }],
  obs: '',
  conexao: '',           // NOVO: '', '1', '2', '3'
  conexaoLocal: '',      // NOVO: local da primeira conexão
  conexaoDuracao: '',    // NOVO: duração da primeira conexão
  conexaoLocal2: '',     // NOVO: local da segunda conexão (para 2 conexões)
  conexaoDuracao2: ''    // NOVO: duração da segunda conexão
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
// TODAS AS COMPANHIAS AÉREAS COMPLETAS
  "Aegean Airlines",
  "Aeroflot",
  "Aerolineas Argentinas",
  "Aeroméxico",
  "Air Canada",
  "Air China",
  "Air Dolomiti",
  "Air Europa",
  "Air France",
  "Air India",
  "Air New Zealand",
  "Air Serbia",
  "AirAsia",
  "AirBaltic",
  "Alaska Airlines",
  "Alaska SkyWest",
  "All Nippon Airways (ANA)",
  "Allegiant Air",
  "American Airlines",
  "Asiana Airlines",
  "Austrian Airlines",
  "Avianca",
  "Azul Linhas Aéreas",
  "Bamboo Airways",
  "British Airways",
  "Brussels Airlines",
  "Bulgaria Air",
  "Cathay Pacific",
  "Cebu Pacific",
  "China Eastern Airlines",
  "China Southern Airlines",
  "Croatia Airlines",
  "Delta Air Lines",
  "easyJet",
  "EgyptAir",
  "Emirates",
  "Ethiopian Airlines",
  "Etihad Airways",
  "Eurowings",
  "Finnair",
  "FlyDubai",
  "Garuda Indonesia",
  "GOL Linhas Aéreas",
  "Hainan Airlines",
  "Hawaiian Airlines",
  "Iberia",
  "Icelandair",
  "IndiGo",
  "Japan Airlines (JAL)",
  "Jet2.com",
  "JetBlue Airways",
  "Jetstar Airways",
  "KLM Royal Dutch Airlines",
  "Korean Air",
  "LATAM Airlines",
  "Lion Air",
  "LOT Polish Airlines",
  "Lufthansa",
  "Malaysia Airlines",
  "Malindo Air",
  "Oman Air",
  "Pakistan International Airlines (PIA)",
  "PAL Express",
  "Philippine Airlines",
  "Qatar Airways",
  "Royal Air Maroc",
  "Ryanair",
  "Saudi Arabian Airlines",
  "Shenzhen Airlines",
  "Sichuan Airlines",
  "South African Airways",
  "Southwest Airlines",
  "SpiceJet",
  "Spirit Airlines",
  "Spring Airlines",
  "SriLankan Airlines",
  "Sun Country Airlines",
  "Swiss International Air Lines",
  "TAP Air Portugal",
  "Thai Airways",
  "Tunisair",
  "Turkish Airlines",
  "United Airlines",
  "VietJet Air",
  "Vietnam Airlines",
  "Vueling Airlines",
  "WestJet",
  "Wizz Air",
  "Xiamen Airlines",
  "ITA Airways",
  "Copa Airlines",
  "JetSmart",
  "Outra"
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