import React, { useState, useEffect, useRef, useCallback } from 'react';
import TrechoForm from './components/TrechoForm';
import HospedagemForm from './components/HospedagemForm';
import IngressoForm from './components/IngressoForm';
import PreviewTrecho from './components/PreviewTrecho';
import PreviewIngresso from './components/PreviewIngresso';
import { 
  novoTrecho, novaHosp, novoIngresso, fmtDate, 
  LOGO_URL, limparLocalStorageCorrompido, calcularDuracaoVoo
} from './utils/helpers';
import './styles/App.css';

function App() {
  const [form, setForm] = useState(() => {
    limparLocalStorageCorrompido();
    try {
      const s = localStorage.getItem('gvs_itinerario');
      if (s) {
        const parsed = JSON.parse(s);
        return {
          nomes: parsed.nomes || [''],
          telefone: parsed.telefone || '',
          consultor: parsed.consultor || 'Guilherme Vieira Santos',
          cargo: parsed.cargo || 'Gestor de Milhas',
          origem: parsed.origem || '',
          destino: parsed.destino || '',
          dataIda: parsed.dataIda || '',
          dataVolta: parsed.dataVolta || '',
          pax: parsed.pax || 1,
          tipos: parsed.tipos || ['Aéreos'],
          trechos: parsed.trechos && parsed.trechos.length ? parsed.trechos : [novoTrecho('IDA')],
          hospedagens: parsed.hospedagens || [],
          ingressos: parsed.ingressos || []
        };
      }
    } catch (e) {
      console.log('Erro ao carregar dados:', e);
    }
    return {
      nomes: [''],
      telefone: '',
      consultor: 'Guilherme V Santos',
      cargo: 'Gestor de Milhas',
      origem: '',
      destino: '',
      dataIda: '',
      dataVolta: '',
      pax: 1,
      tipos: ['Aéreos'],
      trechos: [novoTrecho('IDA')],
      hospedagens: [],
      ingressos: []
    };
  });

  const [saving, setSaving] = useState(false);
  const previewRef = useRef(null);

  // Auto-save
  useEffect(() => {
    localStorage.setItem('gvs_itinerario', JSON.stringify(form));
  }, [form]);

  const u = (field, val) => setForm(f => ({ ...f, [field]: val }));

  // Trechos
  const addTrecho = (tipo) => u('trechos', [...form.trechos, novoTrecho(tipo)]);
  const updTrecho = (id, data) => u('trechos', form.trechos.map(t => t.id === id ? data : t));
  const remTrecho = (id) => u('trechos', form.trechos.filter(t => t.id !== id));

  // Hospedagens
  const addHosp = () => u('hospedagens', [...form.hospedagens, novaHosp()]);
  const updHosp = (id, data) => u('hospedagens', form.hospedagens.map(h => h.id === id ? data : h));
  const remHosp = (id) => u('hospedagens', form.hospedagens.filter(h => h.id !== id));

  // Ingressos
  const addIngresso = () => u('ingressos', [...form.ingressos, novoIngresso()]);
  const updIngresso = (id, data) => u('ingressos', form.ingressos.map(i => i.id === id ? data : i));
  const remIngresso = (id) => u('ingressos', form.ingressos.filter(i => i.id !== id));

  // Nomes
  const updNome = (i, v) => {
    const n = [...form.nomes];
    n[i] = v;
    u('nomes', n);
  };
  const addNome = () => u('nomes', [...form.nomes, '']);
  const remNome = (i) => u('nomes', form.nomes.filter((_, idx) => idx !== i));

  // Toggle tipo
  const toggleTipo = (t) => {
    const curr = form.tipos || [];
    u('tipos', curr.includes(t) ? curr.filter(x => x !== t) : [...curr, t]);
  };

  // Gerar PDF
  const gerarPDF = async () => {
    setSaving(true);
    const el = previewRef.current;
    const nomeArq = (form.nomes[0] || 'cliente').toLowerCase().replace(/\s+/g, '_');
    const opt = {
      margin: 0,
      filename: `itinerario_${nomeArq}.pdf`,
      image: { type: 'jpeg', quality: 0.97 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      await window.html2pdf().set(opt).from(el).save();
    } catch (e) {
      window.alert('Erro ao gerar PDF: ' + e.message);
    }
    setSaving(false);
  };

  // WhatsApp
  const exportarWhatsApp = () => {
    const nomes = form.nomes.filter(Boolean).join(', ');
    const trechos = form.trechos.map(t => {
      const duracao = calcularDuracaoVoo(t.horaSaida, t.horaChegada);
      return `*${t.tipo}* ${t.origemCod}→${t.destinoCod} | ${fmtDate(t.data)} | ${t.horaSaida}→${t.horaChegada} (${duracao}) | ${t.cia} ${t.numVoo}` +
      ((t.localizadores || []).filter(l => l.code).length ? `\nLocalizador: ${(t.localizadores || []).filter(l => l.code).map(l => l.code).join(' e ')}` : '');
    }).join('\n\n');
    const hosps = form.hospedagens.map(h =>
      `🏨 ${h.hotel} | ${fmtDate(h.inicio)} → ${fmtDate(h.fim)}${h.codigo ? ` | Cód: ${h.codigo}` : ''}`
    ).join('\n');
    const ingressos = form.ingressos.map(i =>
      `🎟️ ${i.nome} | ${fmtDate(i.data)} ${i.horario} | ${i.quantidade} ingresso(s)${i.codigo ? ` | Cód: ${i.codigo}` : ''}`
    ).join('\n');
    const msg = `✈️ *ITINERÁRIO GVS*\n*${form.destino || 'Destino'}* | ${fmtDate(form.dataIda)} a ${fmtDate(form.dataVolta)}\n\n👤 *Passageiro(s):* ${nomes}\n\n${trechos}${hosps ? '\n\n🏨 HOSPEDAGEM:\n' + hosps : ''}${ingressos ? '\n\n🎟️ INGRESSOS/PASSEIOS:\n' + ingressos : ''}\n\n_Consultor: ${form.consultor}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Limpar tudo
  const limpar = () => {
    const userConfirmed = window.confirm('Limpar todos os dados? Essa ação não pode ser desfeita.');
    
    if (userConfirmed) {
      const novo = {
        nomes: [''],
        telefone: '',
        consultor: 'Guilherme V Santos',
        cargo: 'Gestor de Milhas',
        origem: '',
        destino: '',
        dataIda: '',
        dataVolta: '',
        pax: 1,
        tipos: ['Aéreos'],
        trechos: [novoTrecho('IDA')],
        hospedagens: [],
        ingressos: []
      };
      setForm(novo);
      localStorage.setItem('gvs_itinerario', JSON.stringify(novo));
    }
  };

  const tituloViagem = [form.destino, form.dataIda && form.dataVolta ? `${fmtDate(form.dataIda)} a ${fmtDate(form.dataVolta)}` : ''].filter(Boolean).join(' • ');
  const trechoIda = form.trechos.filter(t => t.tipo === 'IDA');
  const trechoVolta = form.trechos.filter(t => t.tipo === 'VOLTA');

  return (
    <div>
      {/* TOPO */}
      <div className="top-header">
        <img src={LOGO_URL} alt="GVS Logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        <div style={{ display: 'none' }} className="logo-placeholder">GVS</div>
        <div className="header-title">
          <h1>Gerador de Itinerário</h1>
          <p>Guilherme Vieira Santos • Gestor de Milhas</p>
        </div>
      </div>

      <div className="app-layout">
        {/* ===== PAINEL ESQUERDO: FORMULÁRIO ===== */}
        <div className="form-panel">

          {/* DADOS DO CLIENTE */}
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
          <div className="section-label" style={{ fontSize: 9, margin: '12px 0 8px' }}>Passageiros</div>
          <div className="passengers-list">
            {form.nomes.map((n, i) => (
              <div key={i} className="loc-row">
                <input placeholder={`Passageiro ${i + 1}`} value={n} onChange={e => updNome(i, e.target.value)} />
                {form.nomes.length > 1 && <button className="btn-remove" onClick={() => remNome(i)}>✕</button>}
              </div>
            ))}
          </div>
          <button className="btn-loc-add" onClick={addNome} style={{ marginTop: 6 }}>+ Adicionar Passageiro</button>
          <div className="field-group" style={{ marginTop: 10 }}>
            <div className="field-wrap">
              <label>Telefone</label>
              <input placeholder="+55 47 9xxxx-xxxx" value={form.telefone} onChange={e => u('telefone', e.target.value)} />
            </div>
            <div className="field-wrap">
              <label>Qtd. Passageiros</label>
              <input type="number" min="1" value={form.pax} onChange={e => u('pax', e.target.value)} />
            </div>
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
          <div className="field-wrap" style={{ marginBottom: 10 }}>
            <label>Tipo do Itinerário</label>
            <div className="tipo-tags" style={{ marginTop: 6 }}>
              {['Aéreos', 'Hotéis', 'Ingressos'].map(t => (
                <span key={t} className={`tipo-tag ${(form.tipos || []).includes(t) ? 'active' : ''}`} onClick={() => toggleTipo(t)}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* VOOS */}
          <div className="section-label">Trechos de Voo</div>
          {form.trechos && form.trechos.map((t, i) => (
            <TrechoForm key={t.id} trecho={t} idx={i} onChange={data => updTrecho(t.id, data)} onRemove={() => remTrecho(t.id)} />
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn-add" onClick={() => addTrecho('IDA')}>+ Trecho de Ida</button>
            <button className="btn-add" onClick={() => addTrecho('VOLTA')}>+ Trecho de Volta</button>
          </div>

          {/* HOSPEDAGEM */}
          <div className="section-label">Hospedagem</div>
          {form.hospedagens && form.hospedagens.map((h, i) => (
            <HospedagemForm key={h.id} hosp={h} idx={i} onChange={data => updHosp(h.id, data)} onRemove={() => remHosp(h.id)} />
          ))}
          <button className="btn-add" onClick={addHosp}>+ Adicionar Hospedagem</button>

          {/* INGRESSOS/PASSEIOS */}
          <div className="section-label">Ingressos e Passeios</div>
          {form.ingressos && form.ingressos.map((ing, i) => (
            <IngressoForm key={ing.id} ingresso={ing} idx={i} onChange={data => updIngresso(ing.id, data)} onRemove={() => remIngresso(ing.id)} />
          ))}
          <button className="btn-add" onClick={addIngresso}>+ Adicionar Ingresso/Passeio</button>

          {/* AÇÕES */}
          <div className="action-bar">
            <button className="btn btn-primary" onClick={gerarPDF} disabled={saving}>
              {saving ? '⏳ Gerando...' : '📄 Gerar PDF'}
            </button>
            <button className="btn btn-whatsapp" onClick={exportarWhatsApp}>💬 WhatsApp</button>
            <button className="btn btn-secondary" onClick={() => localStorage.setItem('gvs_itinerario', JSON.stringify(form))}>💾 Salvar</button>
            <button className="btn btn-danger" onClick={limpar}>🗑 Limpar</button>
          </div>

          <div style={{ marginTop: 8, padding: '8px 12px', background: '#0a1a0a', borderRadius: 6, border: '1px solid #1a4a1a' }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: '#4a8a4a', letterSpacing: 2, textAlign: 'center', fontWeight: 500 }}>
              ✔ SALVO AUTOMATICAMENTE NO NAVEGADOR
            </div>
          </div>
        </div>

        {/* ===== PAINEL DIREITO: PREVIEW (COM SCROLL) ===== */}
        <div className="preview-panel">
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#555', textAlign: 'center', fontWeight: 600, marginBottom: 12 }}>
            Preview em Tempo Real — Layout do PDF
          </div>
          <div ref={previewRef} className="preview-wrapper">
            <div className="preview-watermark">GVS</div>

            {/* HEADER DO PREVIEW - VERSÃO MAIS SUAVE */}
            <div className="prev-header">
              <img src={LOGO_URL} alt="GVS" className="prev-logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              <div style={{ display: 'none' }} className="prev-logo-placeholder">GVS</div>
              <div className="prev-header-info">
                <div className="prev-titulo-viagem">{tituloViagem || 'Itinerário de Viagens'}</div>
                <div className="prev-consultor">
                  Consultor: <span>{form.consultor || '—'}</span>
                </div>
                <div className="prev-consultor" style={{ marginTop: 2 }}>{form.cargo}</div>
                {form.tipos && form.tipos.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
                    {form.tipos.map(t => (
                      <span key={t} style={{ background: '#d4af3722', border: '1px solid #d4af37', color: '#d4af37', padding: '2px 8px', borderRadius: 4, fontFamily: "'Inter',sans-serif", fontSize: 8, letterSpacing: 2, fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="prev-body">
              {/* DADOS CLIENTE */}
              <div className="prev-section">
                <div className="prev-section-title">Dados do Cliente</div>
                <div className="prev-cliente-grid">
                  <div className="prev-field">
                    <div className="prev-field-label">Passageiro(s)</div>
                    <div className="prev-field-value" style={{ fontSize: 16 }}>
                      {form.nomes.filter(Boolean).join(' • ') || '—'}
                    </div>
                  </div>
                  <div className="prev-field">
                    <div className="prev-field-label">Telefone</div>
                    <div className="prev-field-value">{form.telefone || '—'}</div>
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
                    <div className="prev-field-value">{form.pax} pax</div>
                  </div>
                </div>
              </div>

              {/* TRECHOS IDA */}
              {trechoIda.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Ida</div>
                  {trechoIda.map(t => <PreviewTrecho key={t.id} t={t} />)}
                </div>
              )}

              {/* TRECHOS VOLTA */}
              {trechoVolta.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Volta</div>
                  {trechoVolta.map(t => <PreviewTrecho key={t.id} t={t} />)}
                </div>
              )}

              {/* HOSPEDAGEM */}
              {form.hospedagens && form.hospedagens.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Hospedagem</div>
                  {form.hospedagens.map(h => (
                    <div key={h.id} className="prev-hosp">
                      <div>
                        <div className="prev-hosp-hotel">{h.hotel || 'Hotel não informado'}</div>
                        <div className="prev-hosp-datas">Check-in: {fmtDate(h.inicio) || '—'} &nbsp;•&nbsp; Check-out: {fmtDate(h.fim) || '—'}</div>
                        {h.obs && <div className="prev-obs" style={{ marginTop: 4 }}>{h.obs}</div>}
                      </div>
                      {h.codigo && <div className="prev-hosp-cod">{h.codigo}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* INGRESSOS/PASSEIOS */}
              {form.ingressos && form.ingressos.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Ingressos e Passeios</div>
                  {form.ingressos.map(i => <PreviewIngresso key={i.id} i={i} />)}
                </div>
              )}

              {/* RODAPÉ INFO */}
              <div style={{ borderTop: '1px solid #d4af3733', paddingTop: 12, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2, fontWeight: 600 }}>
                    Importante
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#444', fontStyle: 'italic' }}>
                    Apresente este documento e seus documentos pessoais válidos no momento do embarque. Verifique as exigências de visto e saúde para o destino.
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: '#888', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                    Emitido por
                  </div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, color: '#b8960c', fontWeight: 800 }}>
                    {form.consultor}
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: '#888', letterSpacing: 1, fontWeight: 500 }}>
                    {form.cargo}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="prev-footer">
              <div className="prev-footer-txt">GVS <span>•</span> Guilherme Vieira Santos <span>•</span> Gestor de Milhas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;