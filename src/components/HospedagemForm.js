import React from 'react';

const HospedagemForm = ({ hosp, onChange, onRemove, idx }) => {
  const u = (f, v) => onChange({ ...hosp, [f]: v });

  return (
    <div className="hosp-card">
      <div className="hosp-header">
        <span>🏨 Hospedagem #{idx + 1}</span>
        <button className="btn-remove" onClick={onRemove}>Remover</button>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Check-in</label>
          <input type="date" value={hosp.inicio} onChange={e => u('inicio', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Check-out</label>
          <input type="date" value={hosp.fim} onChange={e => u('fim', e.target.value)} />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Nome do Hotel</label>
          <input placeholder="Ex: Grand Hyatt São Paulo" value={hosp.hotel} onChange={e => u('hotel', e.target.value)} />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Código / Localizador</label>
          <input placeholder="Ex: 4GNJZ5" value={hosp.codigo} onChange={e => u('codigo', e.target.value.toUpperCase())} />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Observações</label>
          <textarea placeholder="Quarto, regime, notas especiais..." value={hosp.obs} onChange={e => u('obs', e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default HospedagemForm;