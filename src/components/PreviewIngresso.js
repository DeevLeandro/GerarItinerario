import React from 'react';
import { fmtDate } from '../utils/helpers';

const PreviewIngresso = ({ i }) => {
  if (!i) {
    return null;
  }

  return (
    <div className="prev-ingresso">
      <div>
        <div className="prev-ingresso-nome">{i.nome || 'Ingresso não informado'}</div>
        <div className="prev-ingresso-detalhes">
          {fmtDate(i.data) || 'Data não definida'} {i.horario ? ` • ${i.horario}` : ''}
          {i.quantidade ? ` • ${i.quantidade} ingresso(s)` : ''}
        </div>
        {i.obs && <div className="prev-obs" style={{ marginTop: 4 }}>{i.obs}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {i.codigo && <div className="prev-ingresso-cod">{i.codigo}</div>}
      </div>
    </div>
  );
};

export default PreviewIngresso;