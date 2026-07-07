import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import TrechoForm from './components/TrechoForm';
import CarroForm from './components/CarroForm';
import HospedagemForm from './components/HospedagemForm';
import IngressoForm from './components/IngressoForm';
import PreviewTrecho from './components/PreviewTrecho';
import PreviewCarro from './components/PreviewCarro';
import PreviewIngresso from './components/PreviewIngresso';
import PreviewHospedagem from './components/PreviewHospedagem';
import Toast from './components/Toast';
import {
  uid, novoTrecho, novoCarro, novaHosp, novoIngresso, fmtDate,
  LOGO_URL, limparLocalStorageCorrompido,
  calcularDuracaoVoo, calcularDuracaoViagem,
  validarCodigoAeroporto, validarDatas, notasGlobais
} from './utils/helpers';
import './styles/App.css';

function App() {
  const [form, setForm] = useState(() => {
    limparLocalStorageCorrompido();
    try {
      const s = localStorage.getItem('gvs_itinerario');
      if (s) {
        const parsed = JSON.parse(s);

        // ── Migração: formato novo (segmentos) ou legado (trechos + carros) ──
        let segmentos;
        if (Array.isArray(parsed.segmentos)) {
          segmentos = parsed.segmentos.map(seg => ({
            ...seg,
            hospedagens: seg.hospedagens || [],
          }));
        } else {
          const trechosAntigos = (parsed.trechos || []).map(t => ({
            ...t,
            moduloTipo: 'voo',
            hospedagens: t.hospedagens || [],
            tzOrigem: t.tzOrigem || '',
            tzDestino: t.tzDestino || '',
          }));
          const carrosAntigos = (parsed.carros || []).map(c => ({
            ...c,
            moduloTipo: 'carro',
            hospedagens: c.hospedagens || [],
          }));
          // Não temos como recuperar a ordem cronológica real de dados antigos,
          // então mantemos a única ordem que existia: voos primeiro, depois carros.
          // A partir de agora, a ordem de inserção/reordenação manual é preservada.
          segmentos = [...trechosAntigos, ...carrosAntigos];
        }

        return {
          nomes:           parsed.nomes || [''],
          consultor:       parsed.consultor || 'Guilherme Vieira dos Santos',
          cargo:           parsed.cargo || 'Gestor de Milhas',
          origem:          parsed.origem || '',
          destino:         parsed.destino || '',
          dataIda:         parsed.dataIda || '',
          dataVolta:       parsed.dataVolta || '',
          tipos:           parsed.tipos || ['Aéreos'],
          segmentos,
          hospedagens:     parsed.hospedagens || [],
          ingressos:       parsed.ingressos || [],
          notasGerais:     parsed.notasGerais || notasGlobais,
          imagemDestino:   parsed.imagemDestino || '',
          logoPersonalizado: parsed.logoPersonalizado || '',
          tema:            parsed.tema || 'light',
        };
      }
    } catch (e) {
      console.log('Erro ao carregar dados:', e);
    }
    return {
      nomes: [''],
      consultor: 'Guilherme Vieira dos Santos',
      cargo: 'Gestor de Milhas',
      origem: '', destino: '', dataIda: '', dataVolta: '',
      tipos: ['Aéreos'],
      segmentos: [{ ...novoTrecho('IDA'), hospedagens: [] }],
      hospedagens: [], ingressos: [],
      notasGerais: notasGlobais,
      imagemDestino: '', logoPersonalizado: '', tema: 'light',
    };
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [modoEscuro, setModoEscuro] = useState(false);
  const previewRef = useRef(null);

  // ── Pax derivado automaticamente do número de nomes preenchidos ──────────
  const paxCalculado = form.nomes.filter(n => n.trim() !== '').length || 1;

  useEffect(() => { localStorage.setItem('gvs_itinerario', JSON.stringify(form)); }, [form]);
  useEffect(() => {
    if (modoEscuro) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [modoEscuro]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const u = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validarFormulario = () => {
    if (!validarDatas(form.dataIda, form.dataVolta)) {
      showToast('A data de ida não pode ser posterior à data de volta!', 'error');
      return false;
    }
    for (const seg of (form.segmentos || [])) {
      if (seg.moduloTipo !== 'carro' && seg.origemCod && !validarCodigoAeroporto(seg.origemCod)) {
        showToast(`Código de aeroporto inválido: ${seg.origemCod}`, 'error');
        return false;
      }
    }
    return true;
  };

  // ── SEGMENTOS (voos e carros, unificados e reordenáveis) ─────────────────
  const addSegmentoVoo = (tipo) => u('segmentos', [...(form.segmentos || []), { ...novoTrecho(tipo), hospedagens: [] }]);
  const addSegmentoCarro = (tipo = 'TRANSFER') => u('segmentos', [...(form.segmentos || []), { ...novoCarro(tipo), hospedagens: [] }]);

  const updSegmento = (id, data) => u('segmentos', (form.segmentos || []).map(s =>
    s.id === id ? { ...data, hospedagens: data.hospedagens || s.hospedagens || [] } : s
  ));
  const remSegmento = (id) => u('segmentos', (form.segmentos || []).filter(s => s.id !== id));
  const dupSegmento = (seg) => {
    u('segmentos', [...(form.segmentos || []), { ...seg, id: uid(), hospedagens: [] }]);
    showToast('Segmento duplicado!');
  };

  // Move um segmento para cima (-1) ou para baixo (+1) na lista.
  // É isso que permite intercalar voo/hotel/carro na ordem real da viagem.
  const moveSegmento = (id, dir) => {
    const arr = [...(form.segmentos || [])];
    const idx = arr.findIndex(s => s.id === id);
    const novoIdx = idx + dir;
    if (idx === -1 || novoIdx < 0 || novoIdx >= arr.length) return;
    [arr[idx], arr[novoIdx]] = [arr[novoIdx], arr[idx]];
    u('segmentos', arr);
  };

  const ordenarSegmentosPorData = () => {
    const sorted = [...(form.segmentos || [])].sort((a, b) => {
      if (!a.data) return 1; if (!b.data) return -1;
      return new Date(a.data) - new Date(b.data);
    });
    u('segmentos', sorted);
    showToast('Itinerário ordenado por data!');
  };

  // Hospedagens vinculadas a qualquer segmento (voo OU carro) — lógica genérica
  const addHospSegmento = (segId) => u('segmentos', (form.segmentos || []).map(s =>
    s.id !== segId ? s : { ...s, hospedagens: [...(s.hospedagens || []), novaHosp()] }
  ));
  const updHospSegmento = (segId, hid, data) => u('segmentos', (form.segmentos || []).map(s =>
    s.id !== segId ? s : { ...s, hospedagens: (s.hospedagens || []).map(h => h.id === hid ? data : h) }
  ));
  const remHospSegmento = (segId, hid) => u('segmentos', (form.segmentos || []).map(s =>
    s.id !== segId ? s : { ...s, hospedagens: (s.hospedagens || []).filter(h => h.id !== hid) }
  ));
  const dupHospSegmento = (segId, hosp) => {
    u('segmentos', (form.segmentos || []).map(s =>
      s.id !== segId ? s : { ...s, hospedagens: [...(s.hospedagens || []), { ...hosp, id: uid() }] }
    ));
    showToast('Hospedagem duplicada!');
  };

  // ── Hospedagens globais (sem voo/carro vinculado) ─────────────────────────
  const addHosp = () => u('hospedagens', [...form.hospedagens, novaHosp()]);
  const updHosp = (id, data) => u('hospedagens', form.hospedagens.map(h => h.id === id ? data : h));
  const remHosp = (id) => u('hospedagens', form.hospedagens.filter(h => h.id !== id));
  const dupHosp = (hosp) => { u('hospedagens', [...form.hospedagens, { ...hosp, id: uid() }]); showToast('Hospedagem duplicada!'); };

  // ── Ingressos ─────────────────────────────────────────────────────────────
  const addIngresso    = () => u('ingressos', [...form.ingressos, novoIngresso()]);
  const updIngresso    = (id, data) => u('ingressos', form.ingressos.map(i => i.id === id ? data : i));
  const remIngresso    = (id) => u('ingressos', form.ingressos.filter(i => i.id !== id));
  const dupIngresso    = (ing) => { u('ingressos', [...form.ingressos, { ...ing, id: uid() }]); showToast('Ingresso duplicado!'); };

  // ── Nomes ─────────────────────────────────────────────────────────────────
  const updNome = (i, v) => { const n = [...form.nomes]; n[i] = v; u('nomes', n); };
  const addNome = () => u('nomes', [...form.nomes, '']);
  const remNome = (i) => u('nomes', form.nomes.filter((_, idx) => idx !== i));

  const toggleTipo = (t) => {
    const curr = form.tipos || [];
    u('tipos', curr.includes(t) ? curr.filter(x => x !== t) : [...curr, t]);
  };
  const updateNotaGlobal = (key, value) => u('notasGerais', { ...form.notasGerais, [key]: value });

  // ── PDF ───────────────────────────────────────────────────────────────────
  const gerarPDF = async () => {
    if (!validarFormulario()) return;
    setSaving(true);
    showToast('Gerando PDF...', 'info');
    const el = previewRef.current;
    const nomeArq = (form.nomes[0] || 'cliente').toLowerCase().replace(/\s+/g, '_');
    const opt = {
      margin: [15, 12, 15, 12],
      filename: `itinerario_${nomeArq}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        avoid: ['.prev-trecho', '.prev-trecho-bloco', '.prev-hosp', '.prev-ingresso', '.prev-section', '.prev-cronologia-hosp-item', '.prev-rota', '.prev-localizadores', '.prev-bagagem', '.checklist-preview', '.prev-header', '.prev-footer']
      }
    };
    try {
      await html2pdf().set(opt).from(el).save();
      showToast('PDF gerado com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao gerar PDF: ' + e.message, 'error');
    }
    setSaving(false);
  };

  const copiarResumo = () => {
    const totalDias = calcularDuracaoViagem(form.dataIda, form.dataVolta);
    const segmentos = form.segmentos || [];
    const totalVoos = segmentos.filter(s => s.moduloTipo !== 'carro').length;
    const totalCarros = segmentos.filter(s => s.moduloTipo === 'carro').length;
    const hospVinculadas = segmentos.reduce((acc, s) => acc + (s.hospedagens || []).length, 0);
    const totalHosp = hospVinculadas + form.hospedagens.length;
    const resumo = `✈️ RESUMO DA VIAGEM - GVS\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📍 Destino: ${form.destino || 'Não informado'}\n📅 Período: ${fmtDate(form.dataIda) || '—'} a ${fmtDate(form.dataVolta) || '—'}\n⏱ Duração: ${totalDias} dias\n\n📊 ESTATÍSTICAS:\n• ${totalVoos} voo(s)\n• ${totalCarros} trecho(s) terrestre(s)\n• ${totalHosp} hospedagem(ns)\n• ${form.ingressos.length} ingresso(s)\n\n👤 Passageiro(s): ${form.nomes.filter(Boolean).join(', ')}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\nEmitido por: ${form.consultor}\nData: ${new Date().toLocaleDateString('pt-BR')}`;
    navigator.clipboard.writeText(resumo);
    showToast('Resumo copiado!', 'success');
  };

  const exportarWhatsApp = () => {
    const nomes = form.nomes.filter(Boolean).join(', ');
    const segmentos = form.segmentos || [];

    // Mantém a ordem exata em que você organizou o itinerário (voo/hotel/carro intercalados)
    const segmentosMsg = segmentos.map(seg => {
      let linha;
      if (seg.moduloTipo === 'carro') {
        linha = `🚗 *${seg.tipo}*: ${seg.origem || '???'} → ${seg.destino || '???'}\n   📅 ${fmtDate(seg.data)} • ${seg.horaSaida || '--:--'}${seg.empresa ? ` • ${seg.empresa}` : ''}`;
      } else {
        const duracao = calcularDuracaoVoo(seg.horaSaida, seg.horaChegada);
        linha = `✈️ *${seg.tipo}*: ${seg.origemCod || '???'} → ${seg.destinoCod || '???'}\n   📅 ${fmtDate(seg.data)} • ${seg.horaSaida || '--:--'} → ${seg.horaChegada || '--:--'} (${duracao})\n   🏢 ${seg.cia} ${seg.numVoo}`;
      }
      (seg.hospedagens || []).forEach(h => {
        linha += `\n   🏨 ${h.hotel || 'Hotel'} • Check-in: ${fmtDate(h.inicio)} • Check-out: ${fmtDate(h.fim)}`;
      });
      return linha;
    }).join('\n\n');

    const totalDias = calcularDuracaoViagem(form.dataIda, form.dataVolta);
    const msg = `✈️ *ITINERÁRIO GVS - ${form.destino || 'Destino'}* ✈️\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📅 *Período:* ${fmtDate(form.dataIda)} a ${fmtDate(form.dataVolta)} (${totalDias} dias)\n👤 *Passageiro(s):* ${nomes}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n*🧭 ITINERÁRIO*\n${segmentosMsg}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n*Consultor:* ${form.consultor}\n*Emissão:* ${new Date().toLocaleDateString('pt-BR')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Mensagem preparada para WhatsApp!', 'success');
  };

  const limpar = () => {
    if (!window.confirm('Limpar todos os dados? Essa ação não pode ser desfeita.')) return;
    const novo = {
      nomes: [''], consultor: 'Guilherme Vieira dos Santos', cargo: 'Gestor de Milhas',
      origem: '', destino: '', dataIda: '', dataVolta: '', tipos: ['Aéreos'],
      segmentos: [{ ...novoTrecho('IDA'), hospedagens: [] }],
      hospedagens: [], ingressos: [],
      notasGerais: notasGlobais, imagemDestino: '', logoPersonalizado: '', tema: 'light',
    };
    setForm(novo);
    showToast('Dados limpos com sucesso!', 'success');
  };

  // Métricas (baseadas no array unificado de segmentos)
  const segmentos = form.segmentos || [];
  const totalVoos = segmentos.filter(s => s.moduloTipo !== 'carro').length;
  const totalCarros = segmentos.filter(s => s.moduloTipo === 'carro').length;
  const totalDias = calcularDuracaoViagem(form.dataIda, form.dataVolta);
  const hospVinculadas = segmentos.reduce((acc, s) => acc + (s.hospedagens || []).length, 0);
  const totalHospedagens = hospVinculadas + form.hospedagens.length;
  const tituloViagem = [form.destino, form.dataIda && form.dataVolta ? `${fmtDate(form.dataIda)} a ${fmtDate(form.dataVolta)}` : ''].filter(Boolean).join(' • ');

  return (
    <div className={`app ${modoEscuro ? 'dark-theme' : 'light-theme'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* TOPO */}
      <div className="top-header">
        {form.logoPersonalizado
          ? <img src={form.logoPersonalizado} alt="Logo" className="header-logo" />
          : <img src={LOGO_URL} alt="GVS Logo" onError={e => { e.target.style.display = 'none'; }} />
        }
        <div className="header-title">
          <h1>Gerador de Itinerário</h1>
          <p>Guilherme Vieira Santos • Gestor de Milhas</p>
        </div>
        <button className="theme-toggle" onClick={() => setModoEscuro(!modoEscuro)} title={modoEscuro ? 'Modo claro' : 'Modo escuro'}>
          {modoEscuro ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="app-layout">
        {/* ══ FORMULÁRIO ══ */}
        <div className="form-panel">

          {/* DADOS DO CONSULTOR */}
          <div className="section-label">Dados do Cliente</div>
          <div className="field-group full">
            <div className="field-wrap">
              <label>Consultor Responsável</label>
              <input value={form.consultor} onChange={e => u('consultor', e.target.value)} />
            </div>
          </div>
          <div className="field-group full">
            <div className="field-wrap">
              <label>Cargo</label>
              <input value={form.cargo} onChange={e => u('cargo', e.target.value)} />
            </div>
          </div>

          {/* PASSAGEIROS — pax derivado automaticamente */}
          <div className="section-label" style={{ fontSize: 11, margin: '12px 0 8px' }}>Passageiros</div>
          <div className="passengers-list">
            {form.nomes.map((n, i) => (
              <div key={i} className="loc-row">
                <input placeholder={`Passageiro ${i + 1}`} value={n} onChange={e => updNome(i, e.target.value)} />
                {form.nomes.length > 1 && <button className="btn-remove" onClick={() => remNome(i)}>✕</button>}
              </div>
            ))}
          </div>
          <button className="btn-loc-add" onClick={addNome} style={{ marginTop: 6 }}>+ Adicionar Passageiro</button>
          {/* Indicador automático de pax */}
          <div style={{ marginTop: 6, fontSize: 11, color: '#888', paddingLeft: 2 }}>
            👥 {paxCalculado} passageiro{paxCalculado !== 1 ? 's' : ''} (calculado automaticamente)
          </div>

          {/* DADOS DA VIAGEM */}
          <div className="section-label">Dados da Viagem</div>
          <div className="field-group">
            <div className="field-wrap">
              <label>Origem</label>
              <input placeholder="Navegantes, SC" value={form.origem} onChange={e => u('origem', e.target.value)} />
            </div>
            <div className="field-wrap">
              <label>Destino</label>
              <input placeholder="Flórida, EUA" value={form.destino} onChange={e => u('destino', e.target.value)} />
            </div>
          </div>
          <div className="field-group">
            <div className="field-wrap">
              <label>Data de Ida</label>
              <input type="date" value={form.dataIda} onChange={e => u('dataIda', e.target.value)} />
            </div>
            <div className="field-wrap">
              <label>Data de Volta</label>
              <input type="date" value={form.dataVolta} onChange={e => u('dataVolta', e.target.value)} />
            </div>
          </div>
          <div className="field-group full">
            <div className="field-wrap">
              <label>URL da Imagem do Destino (opcional)</label>
              <input placeholder="https://exemplo.com/imagem.jpg" value={form.imagemDestino} onChange={e => u('imagemDestino', e.target.value)} />
            </div>
          </div>
          <div className="field-group full">
            <div className="field-wrap">
              <label>URL da Logo Personalizada (opcional)</label>
              <input placeholder="https://exemplo.com/logo.png" value={form.logoPersonalizado} onChange={e => u('logoPersonalizado', e.target.value)} />
            </div>
          </div>
          <div className="field-wrap" style={{ marginBottom: 10 }}>
            <label>Tipo do Itinerário</label>
            <div className="tipo-tags" style={{ marginTop: 6 }}>
              {['Aéreos', 'Hotéis', 'Ingressos', 'Terrestres'].map(t => (
                <span key={t} className={`tipo-tag ${(form.tipos || []).includes(t) ? 'active' : ''}`} onClick={() => toggleTipo(t)}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ══ ITINERÁRIO UNIFICADO (voos + carros, na ordem real da viagem) ══ */}
          <div className="section-header">
            <div className="section-label">🧭 Itinerário (Voos e Terrestres)</div>
            {segmentos.length > 1 && (
              <button className="btn-sort" onClick={ordenarSegmentosPorData}>📅 Ordenar por data</button>
            )}
          </div>

          <div style={{ fontSize: 11, color: '#888', margin: '-4px 0 12px', lineHeight: 1.4 }}>
            💡 Lance voos e trechos terrestres na ordem que quiser — use as setas ▲▼ de cada item
            para reorganizar a sequência cronológica real da viagem (ex: voo → hotel → voo → carro → voo de volta).
          </div>

          {segmentos.map((seg, i) => (
            <div key={seg.id} className="segmento-wrapper">
              <div className="segmento-reorder-bar">
                <button
                  className="btn-move"
                  disabled={i === 0}
                  onClick={() => moveSegmento(seg.id, -1)}
                  title="Mover para cima"
                >▲</button>
                <span className="segmento-posicao">#{i + 1}</span>
                <button
                  className="btn-move"
                  disabled={i === segmentos.length - 1}
                  onClick={() => moveSegmento(seg.id, 1)}
                  title="Mover para baixo"
                >▼</button>
              </div>

              {seg.moduloTipo === 'carro' ? (
                <CarroForm
                  carro={seg}
                  idx={i}
                  onChange={data => updSegmento(seg.id, data)}
                  onRemove={() => remSegmento(seg.id)}
                  onDuplicate={() => dupSegmento(seg)}
                  onAddHosp={addHospSegmento}
                  onUpdHosp={updHospSegmento}
                  onRemHosp={remHospSegmento}
                  onDuplicateHosp={dupHospSegmento}
                />
              ) : (
                <div className="trecho-bloco">
                  <TrechoForm
                    trecho={seg}
                    idx={i}
                    onChange={data => updSegmento(seg.id, data)}
                    onRemove={() => remSegmento(seg.id)}
                    onDuplicate={() => dupSegmento(seg)}
                  />
                  {(seg.hospedagens || []).length > 0 && (
                    <div className="hospedagens-vinculadas">
                      <div className="hospedagens-vinculadas-label">
                        <span className="hv-icon">🏨</span>
                        Hospedagem após este voo
                        <div className="hv-linha" />
                      </div>
                      {(seg.hospedagens || []).map((h, hi) => (
                        <HospedagemForm
                          key={h.id} hosp={h} idx={hi}
                          onChange={data => updHospSegmento(seg.id, h.id, data)}
                          onRemove={() => remHospSegmento(seg.id, h.id)}
                          onDuplicate={() => dupHospSegmento(seg.id, h)}
                        />
                      ))}
                    </div>
                  )}
                  <button className="btn-add-hosp-trecho" onClick={() => addHospSegmento(seg.id)}>
                    🏨 Adicionar hospedagem após este voo
                  </button>
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <button className="btn-add" onClick={() => addSegmentoVoo('IDA')}>✈️ + Voo de Ida</button>
            <button className="btn-add" onClick={() => addSegmentoVoo('VOLTA')}>✈️ + Voo de Volta</button>
            <button className="btn-add" style={{ background: '#1a2a1a', borderColor: '#3a6a3a', color: '#6abf6a' }} onClick={() => addSegmentoCarro('TRANSFER')}>
              🚐 + Transfer
            </button>
            <button className="btn-add" style={{ background: '#1a2a1a', borderColor: '#3a6a3a', color: '#6abf6a' }} onClick={() => addSegmentoCarro('ALUGUEL')}>
              🚗 + Aluguel de Carro
            </button>
            <button className="btn-add" style={{ background: '#1a2a1a', borderColor: '#3a6a3a', color: '#6abf6a' }} onClick={() => addSegmentoCarro('UBER')}>
              📱 + Uber / App
            </button>
            <button className="btn-add" style={{ background: '#1a2a1a', borderColor: '#3a6a3a', color: '#6abf6a' }} onClick={() => addSegmentoCarro('ONIBUS')}>
              🚌 + Ônibus / Van
            </button>
          </div>

          {/* HOSPEDAGENS GLOBAIS (sem voo/carro vinculado) */}
          {form.hospedagens.length > 0 && (
            <>
              <div className="section-label" style={{ marginTop: 16 }}>Hospedagem Avulsa</div>
              {form.hospedagens.map((h, i) => (
                <HospedagemForm
                  key={h.id} hosp={h} idx={i}
                  onChange={data => updHosp(h.id, data)}
                  onRemove={() => remHosp(h.id)}
                  onDuplicate={() => dupHosp(h)}
                />
              ))}
            </>
          )}
          <button className="btn-add" style={{ background: '#2d4a2d', marginTop: form.hospedagens.length > 0 ? 8 : 16 }} onClick={addHosp}>
            + Hospedagem sem voo vinculado
          </button>

          {/* INGRESSOS */}
          <div className="section-label" style={{ marginTop: 16 }}>Ingressos e Passeios</div>
          {form.ingressos.map((ing, i) => (
            <IngressoForm
              key={ing.id} ingresso={ing} idx={i}
              onChange={data => updIngresso(ing.id, data)}
              onRemove={() => remIngresso(ing.id)}
              onDuplicate={() => dupIngresso(ing)}
            />
          ))}
          <button className="btn-add" onClick={addIngresso}>+ Adicionar Ingresso/Passeio</button>

          {/* CHECKLIST */}
          <div className="section-label">Checklist de Viagem</div>
          <div className="checklist-group">
            {[['passaporte','Passaporte'],['visto','Visto'],['vacinas','Vacinas em dia'],['seguro','Seguro viagem'],['checkinRealizado','Check-in realizado']].map(([key, label]) => (
              <label key={key}>
                <input type="checkbox" checked={!!form.notasGerais?.[key]} onChange={e => updateNotaGlobal(key, e.target.checked)} />
                {' '}{label}
              </label>
            ))}
          </div>
          <div className="field-group full">
            <div className="field-wrap">
              <label>Observações Gerais da Viagem</label>
              <textarea placeholder="Informações adicionais importantes..." value={form.notasGerais?.observacoes || ''} onChange={e => updateNotaGlobal('observacoes', e.target.value)} rows={3} />
            </div>
          </div>

          {/* AÇÕES */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={gerarPDF} disabled={saving}>
              {saving ? '⏳ Gerando...' : '📄 Gerar PDF'}
            </button>
            <button className="btn btn-whatsapp" onClick={exportarWhatsApp}>💬 WhatsApp</button>
            <button className="btn btn-copy" onClick={copiarResumo}>📋 Copiar Resumo</button>
            <button className="btn btn-secondary" onClick={() => localStorage.setItem('gvs_itinerario', JSON.stringify(form))}>💾 Salvar</button>
            <button className="btn btn-danger" onClick={limpar}>🗑 Limpar</button>
          </div>
          <div style={{ marginTop: 8, padding: '8px 12px', background: '#0a1a0a', borderRadius: 6, border: '1px solid #1a4a1a' }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#4a8a4a', letterSpacing: 2, textAlign: 'center', fontWeight: 500 }}>
              ✔ SALVO AUTOMATICAMENTE NO NAVEGADOR
            </div>
          </div>
        </div>

        {/* ══ PREVIEW ══ */}
        <div className="preview-panel">
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#555', textAlign: 'center', fontWeight: 600, marginBottom: 12 }}>
            Preview em Tempo Real — Layout do PDF
          </div>
          <div ref={previewRef} className="preview-wrapper">
            <div className="preview-watermark">GVS</div>

            {/* HEADER */}
            <div className="prev-header">
              {form.logoPersonalizado
                ? <img src={form.logoPersonalizado} alt="Logo" className="prev-logo" />
                : <img src={LOGO_URL} alt="GVS" className="prev-logo" onError={e => { e.target.style.display = 'none'; }} />
              }
              <div className="prev-header-info">
                <div className="prev-titulo-viagem">{tituloViagem || 'Itinerário de Viagens'}</div>
                <div className="prev-consultor">Consultor: <span>{form.consultor || '—'}</span></div>
                <div className="prev-consultor" style={{ marginTop: 2 }}>{form.cargo}</div>
              </div>
            </div>

            {form.imagemDestino && (
              <div className="prev-destino-imagem">
                <img src={form.imagemDestino} alt={form.destino} style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}

            <div className="prev-body">
              {/* DADOS CLIENTE */}
              <div className="prev-section">
                <div className="prev-section-title">Dados do Cliente</div>
                <div className="prev-cliente-grid">
                  <div className="prev-field">
                    <div className="prev-field-label">Passageiro(s)</div>
                    <div className="prev-field-value" style={{ fontSize: 20 }}>{form.nomes.filter(Boolean).join(' • ') || '—'}</div>
                  </div>
                  <div className="prev-field" style={{ marginTop: 6 }}>
                    <div className="prev-field-label">Origem → Destino</div>
                    <div className="prev-field-value">{form.origem || '—'} → {form.destino || '—'}</div>
                  </div>
                  <div className="prev-field" style={{ marginTop: 6 }}>
                    <div className="prev-field-label">Período</div>
                    <div className="prev-field-value">{fmtDate(form.dataIda) || '—'} a {fmtDate(form.dataVolta) || '—'}</div>
                  </div>
                  <div className="prev-field" style={{ marginTop: 6 }}>
                    <div className="prev-field-label">Passageiros</div>
                    <div className="prev-field-value">{paxCalculado} pax</div>
                  </div>
                </div>
              </div>

              {/* ITINERÁRIO CRONOLÓGICO — segue exatamente a ordem definida no formulário */}
              {segmentos.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Itinerário</div>
                  {segmentos.map((seg, i) => (
                    <div key={seg.id} className="prev-trecho-bloco">
                      {i > 0 && <div className="prev-cronologia-conector" />}
                      <div className="prev-cronologia-voo">
                        {seg.moduloTipo === 'carro' ? <PreviewCarro c={seg} /> : <PreviewTrecho t={seg} />}
                      </div>
                      {(seg.hospedagens || []).length > 0 && (
                        <div className="prev-cronologia-hosps">
                          {(seg.hospedagens || []).map(h => (
                            <div key={h.id} className="prev-cronologia-hosp-item">
                              <div className="prev-cronologia-hosp-badge">🏨 Hospedagem</div>
                              <PreviewHospedagem h={h} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* HOSPEDAGENS GLOBAIS */}
              {form.hospedagens.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Hospedagem Avulsa</div>
                  {form.hospedagens.map(h => <PreviewHospedagem key={h.id} h={h} />)}
                </div>
              )}

              {/* INGRESSOS */}
              {form.ingressos.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Ingressos e Passeios</div>
                  {form.ingressos.map(i => <PreviewIngresso key={i.id} i={i} />)}
                </div>
              )}

              {/* CHECKLIST */}
              <div className="prev-section">
                <div className="prev-section-title">✓ Checklist de Viagem</div>
                <div className="checklist-preview">
                  {[['passaporte','Passaporte'],['visto','Visto'],['vacinas','Vacinas em dia'],['seguro','Seguro viagem'],['checkinRealizado','Check-in realizado']].map(([key, label]) => (
                    <div key={key} className={`checklist-item ${form.notasGerais?.[key] ? 'checked' : ''}`}>
                      {form.notasGerais?.[key] ? '✓' : '○'} {label}
                    </div>
                  ))}
                </div>
              </div>

              {form.notasGerais?.observacoes && (
                <div className="prev-section">
                  <div className="prev-section-title">📝 Observações Gerais</div>
                  <div className="prev-obs-text">{form.notasGerais.observacoes}</div>
                </div>
              )}

              {/* RODAPÉ INFO */}
              <div style={{ borderTop: '1px solid #d4af3733', paddingTop: 12, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>Emitido por</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, color: '#b8960c', fontWeight: 800 }}>{form.consultor}</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#888', letterSpacing: 1, fontWeight: 500 }}>{form.cargo}</div>
                  </div>
                  <div style={{ textAlign: 'right', background: '#f5f0e0', padding: '8px 12px', borderRadius: 8, minWidth: 180 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: '#b8960c', marginBottom: 4 }}>📊 RESUMO DA VIAGEM</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', fontSize: 10 }}>
                      <span style={{ color: '#666' }}>📅 Duração:</span><span style={{ fontWeight: 600, color: '#333' }}>{totalDias} dias</span>
                      <span style={{ color: '#666' }}>✈️ Voos:</span><span style={{ fontWeight: 600, color: '#333' }}>{totalVoos}</span>
                      <span style={{ color: '#666' }}>🚗 Terrestres:</span><span style={{ fontWeight: 600, color: '#333' }}>{totalCarros}</span>
                      <span style={{ color: '#666' }}>🏨 Hospedagens:</span><span style={{ fontWeight: 600, color: '#333' }}>{totalHospedagens}</span>
                      <span style={{ color: '#666' }}>🎟️ Ingressos:</span><span style={{ fontWeight: 600, color: '#333' }}>{form.ingressos.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="prev-footer">
              <div className="prev-footer-txt">
                GVS <span>•</span> Guilherme Vieira dos Santos <span>•</span> Gestor de Milhas
                <span style={{ float: 'right' }}>Página 1/1 • Emitido em {new Date().toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;