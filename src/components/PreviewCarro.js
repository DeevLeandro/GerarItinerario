import React from 'react';
import { fmtDate, TIPOS_CARRO } from '../utils/helpers';

const PreviewCarro = ({ c }) => {
  const tipoInfo = TIPOS_CARRO.find(t => t.value === c.tipo) || { label: c.tipo };
  const isAluguel = c.tipo === 'ALUGUEL';

  return (
    <div className="prev-trecho prev-carro">
      <div className="prev-trecho-header">
        <span className="prev-trecho-badge carro">{tipoInfo.label}</span>
        {c.empresa && <span className="prev-trecho-cia">{c.empresa}</span>}
      </div>

      {isAluguel ? (
        /* ── Preview Aluguel: retirada → devolução ── */
        <div className="prev-aluguel">
          <div className="prev-aluguel-linha">
            <div className="prev-aluguel-bloco">
              <div className="prev-aluguel-label">📍 Retirada</div>
              <div className="prev-aluguel-local">{c.origem || '—'}</div>
              <div className="prev-aluguel-data">
                {fmtDate(c.data) || '—'}{c.horaSaida ? ` às ${c.horaSaida}` : ''}
              </div>
            </div>
            <div className="prev-aluguel-seta">🚗</div>
            <div className="prev-aluguel-bloco" style={{ textAlign: 'right' }}>
              <div className="prev-aluguel-label">🏁 Devolução</div>
              <div className="prev-aluguel-local">{c.destino || '—'}</div>
              <div className="prev-aluguel-data">
                {fmtDate(c.dataFim) || '—'}{c.horaChegada ? ` às ${c.horaChegada}` : ''}
              </div>
            </div>
          </div>
          <div className="prev-bagagem" style={{ marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
            {c.veiculo && <span className="prev-bag-item">🚗 {c.veiculo}</span>}
            {c.confirmacao && (
              <span className="prev-bag-item" style={{ color: '#b8960c', fontWeight: 700 }}>
                🔖 {c.confirmacao}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* ── Preview outros tipos: saída → chegada ── */
        <div className="prev-rota">
          <div className="prev-aeroporto">
            <div className="prev-aeroporto-cod" style={{ fontSize: 16, lineHeight: 1.3 }}>
              {c.origem || '—'}
            </div>
          </div>
          <div className="prev-rota-line">
            <div className="prev-rota-times">
              <span className="prev-rota-time">{c.horaSaida || '--:--'}</span>
              {c.duracaoEstimada && (
                <span className="prev-rota-duracao">🕐 {c.duracaoEstimada}</span>
              )}
              <span className="prev-rota-time">{c.horaChegada || '--:--'}</span>
            </div>
            <div className="prev-rota-arrow prev-rota-arrow-carro" />
            <div className="prev-rota-data"><strong>{fmtDate(c.data)}</strong></div>
          </div>
          <div className="prev-aeroporto" style={{ textAlign: 'right' }}>
            <div className="prev-aeroporto-cod" style={{ fontSize: 16, lineHeight: 1.3 }}>
              {c.destino || '—'}
            </div>
          </div>
        </div>
      )}

      <div className="prev-bagagem" style={{ flexWrap: 'wrap', gap: 8 }}>
        {!isAluguel && c.veiculo && <span className="prev-bag-item">🚗 {c.veiculo}</span>}
        {!isAluguel && c.motorista && <span className="prev-bag-item">👤 {c.motorista}</span>}
        {!isAluguel && c.confirmacao && (
          <span className="prev-bag-item" style={{ color: '#b8960c', fontWeight: 700 }}>
            🔖 {c.confirmacao}
          </span>
        )}
      </div>

      {c.obs && <div className="prev-obs">* {c.obs}</div>}
    </div>
  );
};

export default PreviewCarro;