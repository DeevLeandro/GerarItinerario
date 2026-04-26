export const uid = () => Math.random().toString(36).substr(2, 9);

export const fmtDate = (s) => {
  if (!s) return '';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
};

// Função para calcular duração do voo
export const calcularDuracaoVoo = (horaSaida, horaChegada) => {
  if (!horaSaida || !horaChegada) return '';
  
  try {
    const [saidaH, saidaM] = horaSaida.split(':').map(Number);
    const [chegadaH, chegadaM] = horaChegada.split(':').map(Number);
    
    let minutosSaida = saidaH * 60 + saidaM;
    let minutosChegada = chegadaH * 60 + chegadaM;
    
    // Se a hora de chegada for menor que a de saída, considera que passou da meia-noite
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
  obs: ''
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

export const CIAS = [
  "LATAM", "GOL", "Azul", "American Airlines", "Delta", "United",
  "Emirates", "TAP", "Iberia", "Air France", "Lufthansa", "British Airways",
  "Copa Airlines", "Aeromexico", "Avianca", "JetBlue", "Turkish Airlines",
  "Qatar Airways", "Outra"
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
      
      if (parsed.ingressos && parsed.ingressos.length > 0) {
        const hasInvalidIngresso = parsed.ingressos.some(ing => !ing || typeof ing !== 'object');
        if (hasInvalidIngresso) {
          localStorage.removeItem('gvs_itinerario');
          return true;
        }
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