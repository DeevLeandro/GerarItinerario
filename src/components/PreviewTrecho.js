import React from 'react';
import { fmtDate, calcularDuracaoVoo } from '../utils/helpers';

const PreviewTrecho = ({ t }) => {
  const locs = (t.localizadores || []).filter(l => l.code);
  const locStr = locs.length ? locs.map(l => l.code).join(' e ') : '';
  const duracao = calcularDuracaoVoo(t.horaSaida, t.horaChegada);

  // Função para mostrar texto da conexão
  const getConexaoTexto = () => {
    if (!t.conexao || t.conexao === '') return null;
    
    const numConexoes = parseInt(t.conexao);
    if (numConexoes === 1) {
      return `🔁 1 conexão em ${t.conexaoLocal || 'local não informado'}${t.conexaoDuracao ? ` (espera de ${t.conexaoDuracao})` : ''}`;
    } else if (numConexoes === 2) {
      return `🔁 2 conexões: ${t.conexaoLocal || '?'}${t.conexaoDuracao ? ` (${t.conexaoDuracao})` : ''} e ${t.conexaoLocal2 || '?'}${t.conexaoDuracao2 ? ` (${t.conexaoDuracao2})` : ''}`;
    } else {
      return `🔁 ${numConexoes} conexões`;
    }
  };

  const conexaoTexto = getConexaoTexto();

  return (
    <div className="prev-trecho">
      <div className="prev-trecho-header">
        <span className={`prev-trecho-badge ${t.tipo === 'IDA' ? 'ida' : 'volta'}`}>
          {t.tipo === 'IDA' ? '✈ IDA' : '✈ VOLTA'}
        </span>
        <span className="prev-trecho-cia">
          {t.cia}{t.numVoo ? ` • ${t.numVoo}` : ''}
        </span>
      </div>
      <div className="prev-rota">
        <div className="prev-aeroporto">
          <div className="prev-aeroporto-cod">{t.origemCod || '---'}</div>
          <div className="prev-aeroporto-cidade">{t.cidadeOrigem}</div>
        </div>
        <div className="prev-rota-line">
          <div className="prev-rota-times">
            <span className="prev-rota-time">{t.horaSaida || '--:--'}</span>
            <span className="prev-rota-duracao">{duracao}</span>
            <span className="prev-rota-time">
              {t.horaChegada || '--:--'}
              {t.indicador ? <sup style={{ color: '#d4af37', fontSize: 9 }}> {t.indicador}</sup> : ''}
            </span>
          </div>
          <div className="prev-rota-arrow" />
          <div className="prev-rota-data">{fmtDate(t.data)}</div>
        </div>
        <div className="prev-aeroporto" style={{ textAlign: 'right' }}>
          <div className="prev-aeroporto-cod">{t.destinoCod || '---'}</div>
          <div className="prev-aeroporto-cidade">{t.cidadeDestino}</div>
        </div>
      </div>
      
      {/* EXIBIR CONEXÃO - NOVO */}
      {conexaoTexto && (
        <div className="prev-conexao">
          <span className="prev-conexao-icon">🔄</span>
          <span className="prev-conexao-text">{conexaoTexto}</span>
        </div>
      )}
      
      {locStr && (
        <div className="prev-localizadores">
          <div className="prev-loc-label">Localizador</div>
          <div className="prev-loc-value">({locStr})</div>
          {locs.filter(l => l.pax).map(l => (
            <div key={l.id} style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, color: '#888', marginTop: 2 }}>
              ● {l.code} — {l.pax}
            </div>
          ))}
        </div>
      )}
      <div className="prev-bagagem">
        {t.bagQtd ? (
          <span className="prev-bag-item">
            🧳 {t.bagQtd} bagagem(ns) despachada(s){t.bagKg ? ` • ${t.bagKg}kg` : ''}{t.bagPorPax ? ' • por passageiro' : ''}
          </span>
        ) : null}
        {(t.bagMaoQtd || t.bagMao) ? (
          <span className="prev-bag-item">
            👜 {t.bagMaoQtd ? `${t.bagMaoQtd} bagagem(ns) de mão` : t.bagMao}{t.bagMaoKg ? ` • ${t.bagMaoKg}kg` : ''}{t.bagMaoPorPax ? ' • por passageiro' : ''}
          </span>
        ) : null}
      </div>
      {t.obs && <div className="prev-obs">* {t.obs}</div>}
    </div>
  );
};

export default PreviewTrecho;