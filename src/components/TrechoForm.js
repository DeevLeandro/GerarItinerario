import React from 'react';
import LocalizadoresInput from './LocalizadoresInput';
import { CIAS } from '../utils/helpers';

const TrechoForm = ({ trecho, onChange, onRemove, idx }) => {
  const u = (field, val) => onChange({ ...trecho, [field]: val });

  return (
    <div className="trecho-card">
      <div className="trecho-header">
        <span className={`trecho-badge ${trecho.tipo === 'IDA' ? 'ida' : 'volta'}`}>
          {trecho.tipo === 'IDA' ? '✈ IDA' : '✈ VOLTA'}  #{idx + 1}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <select 
            value={trecho.tipo} 
            onChange={e => u('tipo', e.target.value)} 
            style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
          >
            <option>IDA</option>
            <option>VOLTA</option>
          </select>
          <button className="btn-remove" onClick={onRemove}>Remover</button>
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Origem (código)</label>
          <input placeholder="NVT" value={trecho.origemCod} onChange={e => u('origemCod', e.target.value.toUpperCase())} />
        </div>
        <div className="field-wrap">
          <label>Destino (código)</label>
          <input placeholder="GRU" value={trecho.destinoCod} onChange={e => u('destinoCod', e.target.value.toUpperCase())} />
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Cidade Origem</label>
          <input placeholder="Navegantes" value={trecho.cidadeOrigem} onChange={e => u('cidadeOrigem', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Cidade Destino</label>
          <input placeholder="Guarulhos" value={trecho.cidadeDestino} onChange={e => u('cidadeDestino', e.target.value)} />
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Data do Voo</label>
          <input type="date" value={trecho.data} onChange={e => u('data', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Companhia Aérea</label>
          <select value={trecho.cia} onChange={e => u('cia', e.target.value)}>
            <option value="">Selecione...</option>
            {CIAS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Hora Saída</label>
          <input type="time" value={trecho.horaSaida} onChange={e => u('horaSaida', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Hora Chegada</label>
          <input type="time" value={trecho.horaChegada} onChange={e => u('horaChegada', e.target.value)} />
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Nº do Voo</label>
          <input placeholder="LA3021" value={trecho.numVoo} onChange={e => u('numVoo', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Indicador</label>
          <select value={trecho.indicador} onChange={e => u('indicador', e.target.value)}>
            <option value="">Mesmo dia</option>
            <option value="+1">+1 dia</option>
            <option value="+2">+2 dias</option>
          </select>
        </div>
      </div>
      <div className="field-group">
        <div className="field-wrap">
          <label>Bagagem Despachada (qtd)</label>
          <input type="number" min="0" value={trecho.bagQtd} onChange={e => u('bagQtd', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Peso (kg)</label>
          <input type="number" min="0" value={trecho.bagKg} onChange={e => u('bagKg', e.target.value)} />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Bagagem de Mão</label>
          <input placeholder="1 bagagem de mão (10kg)" value={trecho.bagMao} onChange={e => u('bagMao', e.target.value)} />
        </div>
      </div>
      <div className="field-group full" style={{ marginTop: 8 }}>
        <div className="field-wrap">
          <label>Localizadores</label>
          <LocalizadoresInput 
            locs={trecho.localizadores || []} 
            onChange={locs => u('localizadores', locs)} 
          />
        </div>
      </div>
      <div className="field-group full">
        <div className="field-wrap">
          <label>Observações do Trecho</label>
          <textarea 
            placeholder="Ex: trechos separados, bagagem diferenciada por passageiro..." 
            value={trecho.obs} 
            onChange={e => u('obs', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default TrechoForm;