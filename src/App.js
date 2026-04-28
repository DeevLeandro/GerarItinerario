import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import TrechoForm from './components/TrechoForm';
import HospedagemForm from './components/HospedagemForm';
import IngressoForm from './components/IngressoForm';
import PreviewTrecho from './components/PreviewTrecho';
import PreviewIngresso from './components/PreviewIngresso';
import PreviewHospedagem from './components/PreviewHospedagem';
import Toast from './components/Toast';
import { 
  novoTrecho, novaHosp, novoIngresso, fmtDate, fmtDateTime,
  LOGO_URL, limparLocalStorageCorrompido, calcularDuracaoVoo,
  calcularDuracaoViagem, validarCodigoAeroporto, validarDatas,
  mascaraTelefone, notasGlobais
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
          ingressos: parsed.ingressos || [],
          notasGerais: parsed.notasGerais || notasGlobais,
          imagemDestino: parsed.imagemDestino || '',
          logoPersonalizado: parsed.logoPersonalizado || '',
          tema: parsed.tema || 'light'
        };
      }
    } catch (e) {
      console.log('Erro ao carregar dados:', e);
    }
    return {
      nomes: [''],
      telefone: '',
      consultor: 'Guilherme Vieira Santos',
      cargo: 'Gestor de Milhas',
      origem: '',
      destino: '',
      dataIda: '',
      dataVolta: '',
      pax: 1,
      tipos: ['Aéreos'],
      trechos: [novoTrecho('IDA')],
      hospedagens: [],
      ingressos: [],
      notasGerais: notasGlobais,
      imagemDestino: '',
      logoPersonalizado: '',
      tema: 'light'
    };
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [modoEscuro, setModoEscuro] = useState(false);
  const previewRef = useRef(null);
  const formRef = useRef(null);

  // Auto-save
  useEffect(() => {
    localStorage.setItem('gvs_itinerario', JSON.stringify(form));
  }, [form]);

  // Aplicar tema
  useEffect(() => {
    if (modoEscuro) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [modoEscuro]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const u = (field, val) => setForm(f => ({ ...f, [field]: val }));

  // Validações
  const validarFormulario = () => {
    // Validar datas
    if (!validarDatas(form.dataIda, form.dataVolta)) {
      showToast('A data de ida não pode ser posterior à data de volta!', 'error');
      return false;
    }

    // Validar códigos de aeroporto nos trechos
    for (const trecho of form.trechos) {
      if (trecho.origemCod && !validarCodigoAeroporto(trecho.origemCod)) {
        showToast(`Código de aeroporto inválido: ${trecho.origemCod} (deve ter 3 letras)`, 'error');
        return false;
      }
      if (trecho.destinoCod && !validarCodigoAeroporto(trecho.destinoCod)) {
        showToast(`Código de aeroporto inválido: ${trecho.destinoCod} (deve ter 3 letras)`, 'error');
        return false;
      }
    }

    // Validar campos obrigatórios se houver trechos
    if (form.trechos.length > 0 && form.trechos[0].cia) {
      for (const trecho of form.trechos) {
        if (trecho.cia && (!trecho.origemCod || !trecho.destinoCod)) {
          showToast('Preencha origem e destino para todos os trechos com companhia selecionada', 'warning');
          return false;
        }
      }
    }

    return true;
  };

  // Trechos
  const addTrecho = (tipo) => u('trechos', [...form.trechos, novoTrecho(tipo)]);
  const updTrecho = (id, data) => u('trechos', form.trechos.map(t => t.id === id ? data : t));
  const remTrecho = (id) => u('trechos', form.trechos.filter(t => t.id !== id));
  const duplicateTrecho = (trecho) => {
    const novoT = { ...trecho, id: Math.random().toString(36).substr(2, 9) };
    u('trechos', [...form.trechos, novoT]);
    showToast('Trecho duplicado com sucesso!');
  };

  // Ordenar trechos por data
  const ordenarTrechosPorData = () => {
    const trechosOrdenados = [...form.trechos].sort((a, b) => {
      if (!a.data) return 1;
      if (!b.data) return -1;
      return new Date(a.data) - new Date(b.data);
    });
    u('trechos', trechosOrdenados);
    showToast('Trechos ordenados por data!');
  };

  // Hospedagens
  const addHosp = () => u('hospedagens', [...form.hospedagens, novaHosp()]);
  const updHosp = (id, data) => u('hospedagens', form.hospedagens.map(h => h.id === id ? data : h));
  const remHosp = (id) => u('hospedagens', form.hospedagens.filter(h => h.id !== id));
  const duplicateHosp = (hosp) => {
    const novaH = { ...hosp, id: Math.random().toString(36).substr(2, 9) };
    u('hospedagens', [...form.hospedagens, novaH]);
    showToast('Hospedagem duplicada com sucesso!');
  };

  // Ordenar hospedagens por check-in
  const ordenarHospedagensPorData = () => {
    const hospOrdenadas = [...form.hospedagens].sort((a, b) => {
      if (!a.inicio) return 1;
      if (!b.inicio) return -1;
      return new Date(a.inicio) - new Date(b.inicio);
    });
    u('hospedagens', hospOrdenadas);
    showToast('Hospedagens ordenadas por check-in!');
  };

  // Ingressos
  const addIngresso = () => u('ingressos', [...form.ingressos, novoIngresso()]);
  const updIngresso = (id, data) => u('ingressos', form.ingressos.map(i => i.id === id ? data : i));
  const remIngresso = (id) => u('ingressos', form.ingressos.filter(i => i.id !== id));
  const duplicateIngresso = (ingresso) => {
    const novoI = { ...ingresso, id: Math.random().toString(36).substr(2, 9) };
    u('ingressos', [...form.ingressos, novoI]);
    showToast('Ingresso duplicado com sucesso!');
  };

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

  // Notas gerais
  const updateNotaGlobal = (key, value) => {
    u('notasGerais', { ...form.notasGerais, [key]: value });
  };

  // Gerar PDF
  const gerarPDF = async () => {
    if (!validarFormulario()) return;
    
    setSaving(true);
    showToast('Gerando PDF...', 'info');
    
    const el = previewRef.current;
    const nomeArq = (form.nomes[0] || 'cliente').toLowerCase().replace(/\s+/g, '_');
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `itinerario_${nomeArq}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await window.html2pdf().set(opt).from(el).save();
      showToast('PDF gerado com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao gerar PDF: ' + e.message, 'error');
    }
    setSaving(false);
  };

  // Copiar resumo
  const copiarResumo = () => {
    const resumo = gerarResumoTexto();
    navigator.clipboard.writeText(resumo);
    showToast('Resumo copiado para área de transferência!', 'success');
  };

  // Gerar resumo em texto
  const gerarResumoTexto = () => {
    const totalDias = calcularDuracaoViagem(form.dataIda, form.dataVolta);
    const totalVoos = form.trechos.length;
    const totalHospedagens = form.hospedagens.length;
    const totalIngressos = form.ingressos.length;
    
    return `✈️ RESUMO DA VIAGEM - GVS
━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Destino: ${form.destino || 'Não informado'}
📅 Período: ${fmtDate(form.dataIda) || '—'} a ${fmtDate(form.dataVolta) || '—'}
⏱ Duração: ${totalDias} dias

📊 ESTATÍSTICAS:
• ${totalVoos} voo(s)
• ${totalHospedagens} hospedagem(ns)
• ${totalIngressos} ingresso(s)/passeio(s)

👤 Passageiro(s): ${form.nomes.filter(Boolean).join(', ')}

━━━━━━━━━━━━━━━━━━━━━━━━━
Emitido por: ${form.consultor}
Data: ${new Date().toLocaleDateString('pt-BR')}`;
  };

  // WhatsApp melhorado
  const exportarWhatsApp = () => {
    const nomes = form.nomes.filter(Boolean).join(', ');
    
    const trechos = form.trechos.map(t => {
      const duracao = calcularDuracaoVoo(t.horaSaida, t.horaChegada);
      return `✈️ *${t.tipo}*: ${t.origemCod || '???'} → ${t.destinoCod || '???'}
   📅 ${fmtDate(t.data)} • ${t.horaSaida || '--:--'} → ${t.horaChegada || '--:--'} (${duracao})
   🏢 ${t.cia} ${t.numVoo}`;
    }).join('\n\n');
    
    const hosps = form.hospedagens.map(h => {
      let texto = `🏨 *${h.hotel || 'Hotel'}*
   📅 Check-in: ${fmtDate(h.inicio)}${h.checkinHorario ? ` às ${h.checkinHorario}` : ''}
   📅 Check-out: ${fmtDate(h.fim)}${h.checkoutHorario ? ` às ${h.checkoutHorario}` : ''}`;
      
      if (h.endereco) texto += `\n   📍 ${h.endereco}, ${h.numero} - ${h.cidade}`;
      if (h.cafeIncluso) texto += `\n   ☕ Café da manhã incluso${h.tipoCafe ? ` (${h.tipoCafe})` : ''}`;
      if (h.quartoNumero || h.tipoQuarto) texto += `\n   🛏 Quarto: ${h.quartoNumero ? `nº ${h.quartoNumero}` : ''} ${h.tipoQuarto || ''}`;
      if (h.contatoHotel) texto += `\n   📞 ${h.contatoHotel}`;
      
      return texto;
    }).join('\n\n');
    
    const ingressos = form.ingressos.map(i =>
      `🎟️ *${i.nome}* • ${fmtDate(i.data)} ${i.horario} • ${i.quantidade} ingresso(s)`
    ).join('\n');
    
    const totalDias = calcularDuracaoViagem(form.dataIda, form.dataVolta);
    
    const msg = `✈️ *ITINERÁRIO GVS - ${form.destino || 'Destino'}* ✈️
━━━━━━━━━━━━━━━━━━━━━━━━━

📅 *Período:* ${fmtDate(form.dataIda)} a ${fmtDate(form.dataVolta)} (${totalDias} dias)
👤 *Passageiro(s):* ${nomes}

━━━━━━━━━━━━━━━━━━━━━━━━━
*✈️ VOOS*
${trechos}

${hosps ? `━━━━━━━━━━━━━━━━━━━━━━━━━
*🏨 HOSPEDAGEM*
${hosps}` : ''}

${ingressos ? `━━━━━━━━━━━━━━━━━━━━━━━━━
*🎟️ INGRESSOS/PASSEIOS*
${ingressos}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
*Consultor:* ${form.consultor}
*Emissão:* ${new Date().toLocaleDateString('pt-BR')}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Mensagem preparada para WhatsApp!', 'success');
  };

  // Limpar tudo
  const limpar = () => {
    const userConfirmed = window.confirm('Limpar todos os dados? Essa ação não pode ser desfeita.');
    
    if (userConfirmed) {
      const novo = {
        nomes: [''],
        telefone: '',
        consultor: 'Guilherme Vieira Santos',
        cargo: 'Gestor de Milhas',
        origem: '',
        destino: '',
        dataIda: '',
        dataVolta: '',
        pax: 1,
        tipos: ['Aéreos'],
        trechos: [novoTrecho('IDA')],
        hospedagens: [],
        ingressos: [],
        notasGerais: notasGlobais,
        imagemDestino: '',
        logoPersonalizado: '',
        tema: 'light'
      };
      setForm(novo);
      localStorage.setItem('gvs_itinerario', JSON.stringify(novo));
      showToast('Dados limpos com sucesso!', 'success');
    }
  };

  // Métricas para resumo
  const totalDias = calcularDuracaoViagem(form.dataIda, form.dataVolta);
  const totalVoos = form.trechos.length;
  const totalHospedagens = form.hospedagens.length;
  const totalIngressos = form.ingressos.length;

  const tituloViagem = [form.destino, form.dataIda && form.dataVolta ? `${fmtDate(form.dataIda)} a ${fmtDate(form.dataVolta)}` : ''].filter(Boolean).join(' • ');
  const trechoIda = form.trechos.filter(t => t.tipo === 'IDA');
  const trechoVolta = form.trechos.filter(t => t.tipo === 'VOLTA');

  return (
    <div className={`app ${modoEscuro ? 'dark-theme' : 'light-theme'}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* TOPO */}
      <div className="top-header">
        {form.logoPersonalizado ? (
          <img src={form.logoPersonalizado} alt="Logo Personalizado" className="header-logo" />
        ) : (
          <img src={LOGO_URL} alt="GVS Logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        )}
        <div style={{ display: 'none' }} className="logo-placeholder">GVS</div>
        <div className="header-title">
          <h1>Gerador de Itinerário</h1>
          <p>Guilherme Vieira Santos • Gestor de Milhas</p>
        </div>
        <button 
          className="theme-toggle" 
          onClick={() => setModoEscuro(!modoEscuro)}
          title={modoEscuro ? 'Modo claro' : 'Modo escuro'}
        >
          {modoEscuro ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="app-layout">
        {/* ===== PAINEL ESQUERDO: FORMULÁRIO ===== */}
        <div className="form-panel" ref={formRef}>

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
              <input 
                placeholder="+55 47 9xxxx-xxxx" 
                value={form.telefone} 
                onChange={e => u('telefone', mascaraTelefone(e.target.value))} 
              />
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
              {['Aéreos', 'Hotéis', 'Ingressos'].map(t => (
                <span key={t} className={`tipo-tag ${(form.tipos || []).includes(t) ? 'active' : ''}`} onClick={() => toggleTipo(t)}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* VOOS */}
          <div className="section-header">
            <div className="section-label">Trechos de Voo</div>
            {form.trechos.length > 1 && (
              <button className="btn-sort" onClick={ordenarTrechosPorData}>📅 Ordenar por data</button>
            )}
          </div>
          {form.trechos && form.trechos.map((t, i) => (
            <TrechoForm 
              key={t.id} 
              trecho={t} 
              idx={i} 
              onChange={data => updTrecho(t.id, data)} 
              onRemove={() => remTrecho(t.id)}
              onDuplicate={() => duplicateTrecho(t)}
            />
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn-add" onClick={() => addTrecho('IDA')}>+ Trecho de Ida</button>
            <button className="btn-add" onClick={() => addTrecho('VOLTA')}>+ Trecho de Volta</button>
          </div>

          {/* HOSPEDAGEM */}
          <div className="section-header">
            <div className="section-label">Hospedagem</div>
            {form.hospedagens.length > 1 && (
              <button className="btn-sort" onClick={ordenarHospedagensPorData}>📅 Ordenar por check-in</button>
            )}
          </div>
          {form.hospedagens && form.hospedagens.map((h, i) => (
            <HospedagemForm 
              key={h.id} 
              hosp={h} 
              idx={i} 
              onChange={data => updHosp(h.id, data)} 
              onRemove={() => remHosp(h.id)}
              onDuplicate={() => duplicateHosp(h)}
            />
          ))}
          <button className="btn-add" onClick={addHosp}>+ Adicionar Hospedagem</button>

          {/* INGRESSOS/PASSEIOS */}
          <div className="section-label">Ingressos e Passeios</div>
          {form.ingressos && form.ingressos.map((ing, i) => (
            <IngressoForm 
              key={ing.id} 
              ingresso={ing} 
              idx={i} 
              onChange={data => updIngresso(ing.id, data)} 
              onRemove={() => remIngresso(ing.id)}
              onDuplicate={() => duplicateIngresso(ing)}
            />
          ))}
          <button className="btn-add" onClick={addIngresso}>+ Adicionar Ingresso/Passeio</button>

          {/* NOTAS GERAIS */}
          <div className="section-label">Checklist de Viagem</div>
          <div className="checklist-group">
            <label><input type="checkbox" checked={form.notasGerais?.passaporte} onChange={e => updateNotaGlobal('passaporte', e.target.checked)} /> Passaporte</label>
            <label><input type="checkbox" checked={form.notasGerais?.visto} onChange={e => updateNotaGlobal('visto', e.target.checked)} /> Visto</label>
            <label><input type="checkbox" checked={form.notasGerais?.vacinas} onChange={e => updateNotaGlobal('vacinas', e.target.checked)} /> Vacinas em dia</label>
            <label><input type="checkbox" checked={form.notasGerais?.seguro} onChange={e => updateNotaGlobal('seguro', e.target.checked)} /> Seguro viagem</label>
            <label><input type="checkbox" checked={form.notasGerais?.checkinRealizado} onChange={e => updateNotaGlobal('checkinRealizado', e.target.checked)} /> Check-in realizado</label>
          </div>
          
          <div className="field-group full">
            <div className="field-wrap">
              <label>Observações Gerais da Viagem</label>
              <textarea 
                placeholder="Informações adicionais importantes..." 
                value={form.notasGerais?.observacoes || ''} 
                onChange={e => updateNotaGlobal('observacoes', e.target.value)} 
                rows={3}
              />
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
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: '#4a8a4a', letterSpacing: 2, textAlign: 'center', fontWeight: 500 }}>
              ✔ SALVO AUTOMATICAMENTE NO NAVEGADOR
            </div>
          </div>
        </div>

        {/* ===== PAINEL DIREITO: PREVIEW ===== */}
        <div className="preview-panel">
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#555', textAlign: 'center', fontWeight: 600, marginBottom: 12 }}>
            Preview em Tempo Real — Layout do PDF
          </div>
          <div ref={previewRef} className="preview-wrapper">
            <div className="preview-watermark">GVS</div>

            {/* HEADER DO PREVIEW */}
            <div className="prev-header">
              {form.logoPersonalizado ? (
                <img src={form.logoPersonalizado} alt="Logo" className="prev-logo" />
              ) : (
                <img src={LOGO_URL} alt="GVS" className="prev-logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              )}
              <div style={{ display: 'none' }} className="prev-logo-placeholder">GVS</div>
              <div className="prev-header-info">
                <div className="prev-titulo-viagem">{tituloViagem || 'Itinerário de Viagens'}</div>
                <div className="prev-consultor">
                  Consultor: <span>{form.consultor || '—'}</span>
                </div>
                <div className="prev-consultor" style={{ marginTop: 2 }}>{form.cargo}</div>
              </div>
            </div>

            {/* Imagem do Destino */}
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
                  {form.hospedagens.map(h => <PreviewHospedagem key={h.id} h={h} />)}
                </div>
              )}

              {/* INGRESSOS/PASSEIOS */}
              {form.ingressos && form.ingressos.length > 0 && (
                <div className="prev-section">
                  <div className="prev-section-title">Ingressos e Passeios</div>
                  {form.ingressos.map(i => <PreviewIngresso key={i.id} i={i} />)}
                </div>
              )}

              {/* CHECKLIST */}
              <div className="prev-section">
                <div className="prev-section-title">✓ Checklist de Viagem</div>
                <div className="checklist-preview">
                  <div className={`checklist-item ${form.notasGerais?.passaporte ? 'checked' : ''}`}>
                    {form.notasGerais?.passaporte ? '✓' : '○'} Passaporte
                  </div>
                  <div className={`checklist-item ${form.notasGerais?.visto ? 'checked' : ''}`}>
                    {form.notasGerais?.visto ? '✓' : '○'} Visto
                  </div>
                  <div className={`checklist-item ${form.notasGerais?.vacinas ? 'checked' : ''}`}>
                    {form.notasGerais?.vacinas ? '✓' : '○'} Vacinas em dia
                  </div>
                  <div className={`checklist-item ${form.notasGerais?.seguro ? 'checked' : ''}`}>
                    {form.notasGerais?.seguro ? '✓' : '○'} Seguro viagem
                  </div>
                  <div className={`checklist-item ${form.notasGerais?.checkinRealizado ? 'checked' : ''}`}>
                    {form.notasGerais?.checkinRealizado ? '✓' : '○'} Check-in realizado
                  </div>
                </div>
              </div>

              {/* OBSERVAÇÕES GERAIS */}
              {form.notasGerais?.observacoes && (
                <div className="prev-section">
                  <div className="prev-section-title">📝 Observações Gerais</div>
                  <div className="prev-obs-text">{form.notasGerais.observacoes}</div>
                </div>
              )}

              {/* RODAPÉ INFO */}
              <div style={{ borderTop: '1px solid #d4af3733', paddingTop: 12, marginTop: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2, fontWeight: 600 }}>
                    Importante
                  </div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: '#444', fontStyle: 'italic' }}>
                    Apresente este documento e seus documentos pessoais válidos no momento do embarque. Verifique as exigências de visto e saúde para o destino.
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
                  <div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: '#888', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>
                      Emitido por
                    </div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, color: '#b8960c', fontWeight: 800 }}>
                      {form.consultor}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, color: '#888', letterSpacing: 1, fontWeight: 500 }}>
                      {form.cargo}
                    </div>
                  </div>
                  
                  {/* RESUMO DA VIAGEM NO RODAPÉ */}
                  <div style={{ textAlign: 'right', background: '#f5f0e0', padding: '8px 12px', borderRadius: 8, minWidth: 180 }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 600, color: '#b8960c', marginBottom: 4 }}>
                      📊 RESUMO DA VIAGEM
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', fontSize: 10 }}>
                      <span style={{ color: '#666' }}>📅 Duração:</span>
                      <span style={{ fontWeight: 600, color: '#333' }}>{totalDias} dias</span>
                      <span style={{ color: '#666' }}>✈️ Voos:</span>
                      <span style={{ fontWeight: 600, color: '#333' }}>{totalVoos}</span>
                      <span style={{ color: '#666' }}>🏨 Hospedagens:</span>
                      <span style={{ fontWeight: 600, color: '#333' }}>{totalHospedagens}</span>
                      <span style={{ color: '#666' }}>🎟️ Ingressos:</span>
                      <span style={{ fontWeight: 600, color: '#333' }}>{totalIngressos}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="prev-footer">
              <div className="prev-footer-txt">
                GVS <span>•</span> Guilherme Vieira Santos <span>•</span> Gestor de Milhas
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