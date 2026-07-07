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

// ── FUSOS HORÁRIOS ────────────────────────────────────────────────────────────
// Mapeamento IATA → IANA timezone (principais aeroportos do mundo)
export const AIRPORT_TIMEZONES = {
  // Brasil
  GRU: 'America/Sao_Paulo', CGH: 'America/Sao_Paulo', VCP: 'America/Sao_Paulo',
  GIG: 'America/Sao_Paulo', SDU: 'America/Sao_Paulo',
  BSB: 'America/Sao_Paulo', CNF: 'America/Sao_Paulo', SSA: 'America/Bahia',
  FOR: 'America/Fortaleza', REC: 'America/Recife',
  MAO: 'America/Manaus', BEL: 'America/Belem',
  CWB: 'America/Sao_Paulo', POA: 'America/Sao_Paulo',
  FLN: 'America/Sao_Paulo', NVT: 'America/Sao_Paulo', XAP: 'America/Sao_Paulo',
  PMW: 'America/Araguaina', CGB: 'America/Cuiaba',
  // EUA
  JFK: 'America/New_York', LGA: 'America/New_York', EWR: 'America/New_York',
  MIA: 'America/New_York', MCO: 'America/New_York', TPA: 'America/New_York',
  LAX: 'America/Los_Angeles', SFO: 'America/Los_Angeles', SAN: 'America/Los_Angeles',
  ORD: 'America/Chicago', MDW: 'America/Chicago', DFW: 'America/Chicago',
  IAH: 'America/Chicago', AUS: 'America/Chicago',
  SEA: 'America/Los_Angeles', LAS: 'America/Los_Angeles', PHX: 'America/Phoenix',
  DEN: 'America/Denver', MSP: 'America/Chicago', ATL: 'America/New_York',
  BOS: 'America/New_York', DCA: 'America/New_York', IAD: 'America/New_York',
  CLT: 'America/New_York', PHL: 'America/New_York',
  HNL: 'Pacific/Honolulu', ANC: 'America/Anchorage',
  // Europa
  LHR: 'Europe/London', LGW: 'Europe/London', STN: 'Europe/London',
  CDG: 'Europe/Paris', ORY: 'Europe/Paris',
  FRA: 'Europe/Berlin', MUC: 'Europe/Berlin', TXL: 'Europe/Berlin', BER: 'Europe/Berlin',
  AMS: 'Europe/Amsterdam', MAD: 'Europe/Madrid', BCN: 'Europe/Madrid',
  FCO: 'Europe/Rome', MXP: 'Europe/Rome', NAP: 'Europe/Rome',
  ZRH: 'Europe/Zurich', GVA: 'Europe/Zurich',
  VIE: 'Europe/Vienna', BRU: 'Europe/Brussels', LIS: 'Europe/Lisbon',
  ARN: 'Europe/Stockholm', OSL: 'Europe/Oslo', CPH: 'Europe/Copenhagen',
  HEL: 'Europe/Helsinki', WAW: 'Europe/Warsaw', PRG: 'Europe/Prague',
  BUD: 'Europe/Budapest', ATH: 'Europe/Athens', IST: 'Europe/Istanbul',
  // Ásia / Oceania
  DXB: 'Asia/Dubai', AUH: 'Asia/Dubai', DOH: 'Asia/Qatar',
  SIN: 'Asia/Singapore', KUL: 'Asia/Kuala_Lumpur', BKK: 'Asia/Bangkok',
  HKG: 'Asia/Hong_Kong', PEK: 'Asia/Shanghai', PVG: 'Asia/Shanghai',
  NRT: 'Asia/Tokyo', HND: 'Asia/Tokyo', ICN: 'Asia/Seoul',
  SYD: 'Australia/Sydney', MEL: 'Australia/Melbourne', BNE: 'Australia/Brisbane',
  AKL: 'Pacific/Auckland',
  // América Latina
  EZE: 'America/Argentina/Buenos_Aires', AEP: 'America/Argentina/Buenos_Aires',
  SCL: 'America/Santiago', LIM: 'America/Lima', BOG: 'America/Bogota',
  UIO: 'America/Guayaquil', CCS: 'America/Caracas', MVD: 'America/Montevideo',
  GRU: 'America/Sao_Paulo', MEX: 'America/Mexico_City', CUN: 'America/Cancun',
  HAV: 'America/Havana', PTY: 'America/Panama', SJO: 'America/Costa_Rica',
  // África / Médio Oriente
  JNB: 'Africa/Johannesburg', CPT: 'Africa/Johannesburg', CAI: 'Africa/Cairo',
  CMN: 'Africa/Casablanca', LOS: 'Africa/Lagos', NBO: 'Africa/Nairobi',
  TLV: 'Asia/Jerusalem', AMM: 'Asia/Amman', KWI: 'Asia/Kuwait', RUH: 'Asia/Riyadh',
};

// Lista de fusos para o select (agrupados por região)
export const TIMEZONES_LIST = [
  // América
  { value: 'America/Sao_Paulo',         label: '🇧🇷 Brasília (UTC-3 / -2 verão)' },
  { value: 'America/Bahia',             label: '🇧🇷 Salvador, BA (UTC-3)' },
  { value: 'America/Fortaleza',         label: '🇧🇷 Fortaleza (UTC-3)' },
  { value: 'America/Recife',            label: '🇧🇷 Recife (UTC-3)' },
  { value: 'America/Manaus',            label: '🇧🇷 Manaus (UTC-4)' },
  { value: 'America/Belem',             label: '🇧🇷 Belém (UTC-3)' },
  { value: 'America/Cuiaba',            label: '🇧🇷 Cuiabá (UTC-4 / -3 verão)' },
  { value: 'America/New_York',          label: '🇺🇸 Nova York / Miami (ET, UTC-5/-4)' },
  { value: 'America/Chicago',           label: '🇺🇸 Chicago / Dallas (CT, UTC-6/-5)' },
  { value: 'America/Denver',            label: '🇺🇸 Denver (MT, UTC-7/-6)' },
  { value: 'America/Los_Angeles',       label: '🇺🇸 Los Angeles (PT, UTC-8/-7)' },
  { value: 'America/Phoenix',           label: '🇺🇸 Phoenix (MST, UTC-7)' },
  { value: 'America/Anchorage',         label: '🇺🇸 Anchorage (UTC-9/-8)' },
  { value: 'Pacific/Honolulu',          label: '🇺🇸 Honolulu (UTC-10)' },
  { value: 'America/Cancun',            label: '🇲🇽 Cancun (UTC-5)' },
  { value: 'America/Mexico_City',       label: '🇲🇽 Cidade do México (UTC-6/-5)' },
  { value: 'America/Panama',            label: '🇵🇦 Panamá (UTC-5)' },
  { value: 'America/Costa_Rica',        label: '🇨🇷 Costa Rica (UTC-6)' },
  { value: 'America/Bogota',            label: '🇨🇴 Bogotá (UTC-5)' },
  { value: 'America/Lima',              label: '🇵🇪 Lima (UTC-5)' },
  { value: 'America/Santiago',          label: '🇨🇱 Santiago (UTC-4/-3)' },
  { value: 'America/Argentina/Buenos_Aires', label: '🇦🇷 Buenos Aires (UTC-3)' },
  { value: 'America/Montevideo',        label: '🇺🇾 Montevidéu (UTC-3)' },
  { value: 'America/Caracas',           label: '🇻🇪 Caracas (UTC-4)' },
  { value: 'America/Guayaquil',         label: '🇪🇨 Quito / Guayaquil (UTC-5)' },
  { value: 'America/Havana',            label: '🇨🇺 Havana (UTC-5/-4)' },
  // Europa
  { value: 'Europe/Lisbon',             label: '🇵🇹 Lisboa (WET, UTC+0/+1)' },
  { value: 'Europe/London',             label: '🇬🇧 Londres (GMT/BST, UTC+0/+1)' },
  { value: 'Europe/Paris',              label: '🇫🇷 Paris / Madrid / Roma (CET, UTC+1/+2)' },
  { value: 'Europe/Berlin',             label: '🇩🇪 Berlim / Frankfurt (CET, UTC+1/+2)' },
  { value: 'Europe/Amsterdam',          label: '🇳🇱 Amsterdã (CET, UTC+1/+2)' },
  { value: 'Europe/Rome',               label: '🇮🇹 Roma / Milão (CET, UTC+1/+2)' },
  { value: 'Europe/Zurich',             label: '🇨🇭 Zurique / Genebra (CET, UTC+1/+2)' },
  { value: 'Europe/Vienna',             label: '🇦🇹 Viena (CET, UTC+1/+2)' },
  { value: 'Europe/Brussels',           label: '🇧🇪 Bruxelas (CET, UTC+1/+2)' },
  { value: 'Europe/Stockholm',          label: '🇸🇪 Estocolmo (CET, UTC+1/+2)' },
  { value: 'Europe/Oslo',               label: '🇳🇴 Oslo (CET, UTC+1/+2)' },
  { value: 'Europe/Copenhagen',         label: '🇩🇰 Copenhague (CET, UTC+1/+2)' },
  { value: 'Europe/Helsinki',           label: '🇫🇮 Helsinki (EET, UTC+2/+3)' },
  { value: 'Europe/Warsaw',             label: '🇵🇱 Varsóvia (CET, UTC+1/+2)' },
  { value: 'Europe/Prague',             label: '🇨🇿 Praga (CET, UTC+1/+2)' },
  { value: 'Europe/Budapest',           label: '🇭🇺 Budapeste (CET, UTC+1/+2)' },
  { value: 'Europe/Athens',             label: '🇬🇷 Atenas (EET, UTC+2/+3)' },
  { value: 'Europe/Istanbul',           label: '🇹🇷 Istambul (UTC+3)' },
  // Ásia / Oriente Médio
  { value: 'Asia/Jerusalem',            label: '🇮🇱 Tel Aviv (UTC+2/+3)' },
  { value: 'Asia/Amman',               label: '🇯🇴 Amã (UTC+2/+3)' },
  { value: 'Asia/Riyadh',              label: '🇸🇦 Riade (UTC+3)' },
  { value: 'Asia/Kuwait',              label: '🇰🇼 Kuwait (UTC+3)' },
  { value: 'Asia/Qatar',               label: '🇶🇦 Doha (UTC+3)' },
  { value: 'Asia/Dubai',               label: '🇦🇪 Dubai / Abu Dhabi (UTC+4)' },
  { value: 'Asia/Bangkok',             label: '🇹🇭 Bangkok (UTC+7)' },
  { value: 'Asia/Singapore',           label: '🇸🇬 Singapura (UTC+8)' },
  { value: 'Asia/Kuala_Lumpur',        label: '🇲🇾 Kuala Lumpur (UTC+8)' },
  { value: 'Asia/Hong_Kong',           label: '🇭🇰 Hong Kong (UTC+8)' },
  { value: 'Asia/Shanghai',            label: '🇨🇳 Pequim / Xangai (UTC+8)' },
  { value: 'Asia/Tokyo',               label: '🇯🇵 Tóquio (UTC+9)' },
  { value: 'Asia/Seoul',               label: '🇰🇷 Seul (UTC+9)' },
  // Oceania
  { value: 'Australia/Brisbane',        label: '🇦🇺 Brisbane (UTC+10)' },
  { value: 'Australia/Sydney',          label: '🇦🇺 Sydney / Melbourne (UTC+10/+11)' },
  { value: 'Pacific/Auckland',          label: '🇳🇿 Auckland (UTC+12/+13)' },
  // África
  { value: 'Africa/Casablanca',         label: '🇲🇦 Casablanca (UTC+1)' },
  { value: 'Africa/Lagos',              label: '🇳🇬 Lagos (UTC+1)' },
  { value: 'Africa/Nairobi',            label: '🇰🇪 Nairóbi (UTC+3)' },
  { value: 'Africa/Cairo',              label: '🇪🇬 Cairo (UTC+2)' },
  { value: 'Africa/Johannesburg',       label: '🇿🇦 Joanesburgo (UTC+2)' },
];

/**
 * Calcula o offset UTC de um timezone IANA em minutos.
 * Usa Intl.DateTimeFormat para obter o offset real (incluindo horário de verão).
 */
export const getTimezoneOffsetMinutes = (timezone) => {
  if (!timezone) return 0;
  try {
    const now = new Date();
    // Cria formatadores para extrair hora local no timezone alvo
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric', minute: 'numeric', hour12: false,
    });
    const parts = fmt.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0');
    const localMinutes = hour * 60 + minute;
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    let diff = localMinutes - utcMinutes;
    if (diff > 12 * 60) diff -= 24 * 60;
    if (diff < -12 * 60) diff += 24 * 60;
    return diff;
  } catch {
    return 0;
  }
};

/**
 * Calcula a duração real de voo em minutos, considerando fusos horários.
 * Retorna { horas, minutos, totalMinutos, cruzaMeia }
 */
export const calcularDuracaoVooComFuso = (horaSaida, horaChegada, tzOrigem, tzDestino, indicador = '') => {
  if (!horaSaida || !horaChegada) return null;
  try {
    const [saidaH, saidaM] = horaSaida.split(':').map(Number);
    const [chegadaH, chegadaM] = horaChegada.split(':').map(Number);

    // Horários locais em minutos
    let saidaLocal = saidaH * 60 + saidaM;
    let chegadaLocal = chegadaH * 60 + chegadaM;

    // Ajuste pelo indicador (+1, +2 dias)
    const diasExtra = indicador === '+1' ? 1 : indicador === '+2' ? 2 : 0;
    chegadaLocal += diasExtra * 24 * 60;

    // Converte para UTC
    const offsetOrigem = tzOrigem ? getTimezoneOffsetMinutes(tzOrigem) : 0;
    const offsetDestino = tzDestino ? getTimezoneOffsetMinutes(tzDestino) : 0;

    const saidaUTC = saidaLocal - offsetOrigem;
    const chegadaUTC = chegadaLocal - offsetDestino;

    let diffMinutos = chegadaUTC - saidaUTC;

    // Se sem fuso definido, usa lógica anterior
    if (!tzOrigem && !tzDestino) {
      if (chegadaLocal < saidaLocal) chegadaLocal += 24 * 60;
      diffMinutos = chegadaLocal - saidaLocal + diasExtra * 24 * 60;
    }

    if (diffMinutos < 0) diffMinutos += 24 * 60;
    if (diffMinutos > 48 * 60) return null; // sanidade

    const horas = Math.floor(diffMinutos / 60);
    const minutos = diffMinutos % 60;
    return {
      horas, minutos, totalMinutos: diffMinutos,
      texto: `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
    };
  } catch {
    return null;
  }
};

// Mantém compatibilidade com código existente
export const calcularDuracaoVoo = (horaSaida, horaChegada) => {
  if (!horaSaida || !horaChegada) return '';
  try {
    const [saidaH, saidaM] = horaSaida.split(':').map(Number);
    const [chegadaH, chegadaM] = horaChegada.split(':').map(Number);
    let minutosSaida = saidaH * 60 + saidaM;
    let minutosChegada = chegadaH * 60 + chegadaM;
    if (minutosChegada < minutosSaida) minutosChegada += 24 * 60;
    const diffMinutos = minutosChegada - minutosSaida;
    const horas = Math.floor(diffMinutos / 60);
    const minutos = diffMinutos % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  } catch {
    return '';
  }
};

export const calcularDuracaoViagem = (dataInicio, dataFim) => {
  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim - inicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const validarCodigoAeroporto = (codigo) => {
  if (!codigo) return true;
  return /^[A-Z]{3}$/.test(codigo.toUpperCase());
};

export const validarDatas = (dataIda, dataVolta) => {
  if (!dataIda || !dataVolta) return true;
  return new Date(dataIda) <= new Date(dataVolta);
};

export const mascaraTelefone = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }
  return value;
};

// ── NOVO: cada trecho passa a ter `moduloTipo: 'voo'` para poder conviver
// no mesmo array que os trechos de carro (`moduloTipo: 'carro'`), permitindo
// intercalar livremente voos e trechos terrestres na ordem real da viagem.
export const novoTrecho = (tipo = 'IDA') => ({
  id: uid(),
  moduloTipo: 'voo',
  tipo,
  origemCod: '',
  destinoCod: '',
  cidadeOrigem: '',
  cidadeDestino: '',
  data: '',
  horaSaida: '',
  horaChegada: '',
  // Fusos horários
  tzOrigem: '',
  tzDestino: '',
  cia: '',
  numVoo: '',
  indicador: '',
  bagQtd: '',
  bagKg: '',
  bagPorPax: false,
  bagMaoQtd: '',
  bagMaoKg: '',
  bagMaoPorPax: false,
  bagMao: '',
  localizadores: [{ id: uid(), code: '', pax: '' }],
  obs: '',
  conexao: '',
  conexaoLocal: '',
  conexaoDuracao: '',
  conexaoLocal2: '',
  conexaoDuracao2: '',
  hospedagens: [],
});

// ── Trecho de Carro ─────────────────────────────────────────────────────
export const novoCarro = (tipo = 'TRANSFER') => ({
  id: uid(),
  moduloTipo: 'carro',
  tipo,
  origem: '',
  destino: '',
  data: '',
  dataFim: '',           // ALUGUEL: data de devolução
  horaSaida: '',
  horaChegada: '',
  duracaoEstimada: '',
  empresa: '',
  confirmacao: '',
  motorista: '',
  veiculo: '',
  obs: '',
  hospedagens: [],
});

export const novaHosp = () => ({
  id: uid(),
  inicio: '',
  fim: '',
  hotel: '',
  codigo: '',
  obs: '',
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

export const notasGlobais = {
  passaporte: false,
  visto: false,
  vacinas: false,
  seguro: false,
  checkinRealizado: false,
  observacoes: ''
};

export const CIAS = [
  "Aegean Airlines", "Aeroflot", "Aerolineas Argentinas", "Aeroméxico",
  "Air Canada", "Air China", "Air Dolomiti", "Air Europa", "Air France",
  "Air India", "Air New Zealand", "Air Serbia", "AirAsia", "AirBaltic",
  "Alaska Airlines", "Alaska SkyWest", "All Nippon Airways (ANA)", "Allegiant Air",
  "American Airlines", "Asiana Airlines", "Austrian Airlines", "Avianca",
  "Azul Linhas Aéreas", "Bamboo Airways", "British Airways", "Brussels Airlines",
  "Bulgaria Air", "Cathay Pacific", "Cebu Pacific", "China Eastern Airlines",
  "China Southern Airlines", "Croatia Airlines", "Delta Air Lines", "easyJet",
  "EgyptAir", "Emirates", "Ethiopian Airlines", "Etihad Airways", "Eurowings",
  "Finnair", "FlyDubai", "Garuda Indonesia", "GOL Linhas Aéreas", "Hainan Airlines",
  "Hawaiian Airlines", "Iberia", "Icelandair", "IndiGo", "Japan Airlines (JAL)",
  "Jet2.com", "JetBlue Airways", "Jetstar Airways", "KLM Royal Dutch Airlines",
  "Korean Air", "LATAM Airlines", "Lion Air", "LOT Polish Airlines", "Lufthansa",
  "Malaysia Airlines", "Malindo Air", "Oman Air", "Pakistan International Airlines (PIA)",
  "PAL Express", "Philippine Airlines", "Qatar Airways", "Royal Air Maroc", "Ryanair",
  "Saudi Arabian Airlines", "Shenzhen Airlines", "Sichuan Airlines",
  "South African Airways", "Southwest Airlines", "SpiceJet", "Spirit Airlines",
  "Spring Airlines", "SriLankan Airlines", "Sun Country Airlines",
  "Swiss International Air Lines", "TAP Air Portugal", "Thai Airways", "Tunisair",
  "Turkish Airlines", "United Airlines", "VietJet Air", "Vietnam Airlines",
  "Vueling Airlines", "WestJet", "Wizz Air", "Xiamen Airlines", "ITA Airways",
  "Copa Airlines", "JetSmart", "Outra"
];

export const TIPOS_QUARTO = [
  "Standard", "Superior", "Deluxe", "Suite", "Presidencial", "Família", "Executivo"
];

export const TIPOS_CAFE = [
  "Continental", "Buffet", "Americano", "Completo", "Light", "Não incluso"
];

export const TIPOS_CARRO = [
  { value: 'TRANSFER', label: '🚐 Transfer' },
  { value: 'ALUGUEL',  label: '🚗 Aluguel de Carro' },
  { value: 'UBER',     label: '📱 App (Uber/99/Cabify)' },
  { value: 'ONIBUS',   label: '🚌 Ônibus / Van' },
  { value: 'TREM',     label: '🚂 Trem / Metrô' },
  { value: 'OUTRO',    label: '🛣️ Outro' },
];

// ── Validação/limpeza do localStorage ─────────────────────────────────────
// Aceita tanto o formato novo (`segmentos`) quanto o legado (`trechos` + `carros`),
// para não apagar dados de usuários que ainda não passaram pela migração.
export const limparLocalStorageCorrompido = () => {
  try {
    const s = localStorage.getItem('gvs_itinerario');
    if (s) {
      const parsed = JSON.parse(s);
      if (!parsed || typeof parsed !== 'object') { localStorage.removeItem('gvs_itinerario'); return true; }
      if (!Array.isArray(parsed.nomes))      { localStorage.removeItem('gvs_itinerario'); return true; }
      if (!Array.isArray(parsed.ingressos))  { localStorage.removeItem('gvs_itinerario'); return true; }
      if (!Array.isArray(parsed.hospedagens)){ localStorage.removeItem('gvs_itinerario'); return true; }

      const temFormatoNovo = Array.isArray(parsed.segmentos);
      const temFormatoLegado = Array.isArray(parsed.trechos);
      if (!temFormatoNovo && !temFormatoLegado) {
        localStorage.removeItem('gvs_itinerario');
        return true;
      }
    }
  } catch (e) {
    localStorage.removeItem('gvs_itinerario');
    return true;
  }
  return false;
};

export const LOGO_URL = "images/Logo.png";