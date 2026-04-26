import React from 'react';

const IngressoForm = ({ ingresso, onChange, onRemove, idx }) => {
  // Se ingresso for undefined, retorna null ou um fallback
  if (!ingresso) {
    console.warn('IngressoForm recebeu ingresso undefined');
    return null;
  }

  const u = (f, v) => {
    if (onChange) {
      onChange({ ...ingresso, [f]: v });
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="ingresso-card">
      <div className="ingresso-header">
        <span>🎟️ Ingresso/Passeio #{idx + 1}</span>
        <button className="btn-remove" onClick={handleRemove}>Remover</button>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Nome do Passeio/Atração</label>
          <input 
            placeholder="Ex: Disney World, Passeio de Barco, Museu..." 
            value={ingresso.nome || ''} 
            onChange={e => u('nome', e.target.value)} 
          />
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Data</label>
          <input 
            type="date" 
            value={ingresso.data || ''} 
            onChange={e => u('data', e.target.value)} 
          />
        </div>
        <div className="field-wrap">
          <label>Horário</label>
          <input 
            type="time" 
            value={ingresso.horario || ''} 
            onChange={e => u('horario', e.target.value)} 
          />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Código / QR Code / Voucher</label>
          <input 
            placeholder="Código de reserva" 
            value={ingresso.codigo || ''} 
            onChange={e => u('codigo', e.target.value)} 
          />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Quantidade de Ingressos</label>
          <input 
            type="number" 
            min="1" 
            placeholder="Quantidade" 
            value={ingresso.quantidade || '1'} 
            onChange={e => u('quantidade', e.target.value)} 
          />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Observações</label>
          <textarea 
            placeholder="Pontos de encontro, horários de check-in, etc..." 
            value={ingresso.obs || ''} 
            onChange={e => u('obs', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default IngressoForm;