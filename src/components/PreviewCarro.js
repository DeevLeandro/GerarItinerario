import React from 'react';
import { fmtDate, TIPOS_CARRO } from '../utils/helpers';

const PreviewCarro = ({ c }) => {
  const tipoInfo = TIPOS_CARRO.find(t => t.value === c.tipo) || { label: c.tipo };

  return (
    <div className="prev-trecho prev-carro">
      <div className="prev-trecho-header">
        <span className="prev-trecho-badge carro">{tipoInfo.label}</span>
        {c.empresa && (
          <span className="prev-trecho-cia">{c.empresa}</span>
        )}
      </div>

      {/* Rota terrestre */}
      <div className="prev-rota">
        <div className="prev-aeroporto">
          <div className="prev-aeroporto-cod" style={{ fontSize: 18, lineHeight: 1.2 }}>
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
          <div className="prev-aeroporto-cod" style={{ fontSize: 18, lineHeight: 1.2 }}>
            {c.destino || '—'}
          </div>
        </div>
      </div>

      {/* Detalhes específicos */}
      <div className="prev-bagagem" style={{ flexWrap: 'wrap', gap: 8 }}>
        {c.distanciaKm && (
          <span className="prev-bag-item">📏 {c.distanciaKm} km</span>
        )}
        {c.veiculo && (
          <span className="prev-bag-item">🚗 {c.veiculo}</span>
        )}
        {c.motorista && (
          <span className="prev-bag-item">👤 Motorista: {c.motorista}</span>
        )}
        {c.confirmacao && (
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