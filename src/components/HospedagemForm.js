import React, { useState } from 'react';
import { TIPOS_QUARTO, TIPOS_CAFE } from '../utils/helpers';

const HospedagemForm = ({ hosp, onChange, onRemove, onDuplicate, idx }) => {
  const u = (f, v) => onChange({ ...hosp, [f]: v });
  const [mostrarEndereco, setMostrarEndereco] = useState(true);

  return (
    <div className="hosp-card">
      <div className="hosp-header">
        <span>🏨 Hospedagem #{idx + 1}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {onDuplicate && (
            <button className="btn-duplicate" onClick={onDuplicate}>📋 Duplicar</button>
          )}
          <button className="btn-remove" onClick={onRemove}>Remover</button>
        </div>
      </div>
      
      {/* Datas */}
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
      
      {/* Horários */}
      <div className="field-group">
        <div className="field-wrap">
          <label>Horário Check-in</label>
          <input type="time" value={hosp.checkinHorario} onChange={e => u('checkinHorario', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Horário Check-out</label>
          <input type="time" value={hosp.checkoutHorario} onChange={e => u('checkoutHorario', e.target.value)} />
        </div>
      </div>
      
      {/* Nome do Hotel */}
      <div className="field-group full">
        <div className="field-wrap">
          <label>Nome do Hotel</label>
          <input placeholder="Ex: Grand Hyatt São Paulo" value={hosp.hotel} onChange={e => u('hotel', e.target.value)} />
        </div>
      </div>
      
      {/* Endereço */}
      <div className="field-group">
        <div className="field-wrap" style={{ flex: 2 }}>
          <label>Endereço</label>
          <input placeholder="Rua/Avenida" value={hosp.endereco} onChange={e => u('endereco', e.target.value)} />
        </div>
        <div className="field-wrap" style={{ flex: 1 }}>
          <label>Número</label>
          <input placeholder="Nº" value={hosp.numero} onChange={e => u('numero', e.target.value)} />
        </div>
      </div>
      
      <div className="field-group">
        <div className="field-wrap">
          <label>Bairro</label>
          <input placeholder="Bairro" value={hosp.bairro} onChange={e => u('bairro', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Cidade</label>
          <input placeholder="Cidade" value={hosp.cidade} onChange={e => u('cidade', e.target.value)} />
        </div>
      </div>
      
      <div className="field-group">
        <div className="field-wrap">
          <label>Estado</label>
          <input placeholder="UF" value={hosp.estado} onChange={e => u('estado', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>País</label>
          <input placeholder="País" value={hosp.pais} onChange={e => u('pais', e.target.value)} />
        </div>
      </div>
      
      <div className="field-group">
        <div className="field-wrap">
          <label>CEP</label>
          <input placeholder="CEP" value={hosp.cep} onChange={e => u('cep', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Código / Localizador</label>
          <input placeholder="Ex: 4GNJZ5" value={hosp.codigo} onChange={e => u('codigo', e.target.value.toUpperCase())} />
        </div>
      </div>
      
      {/* Quarto */}
      <div className="field-group">
        <div className="field-wrap">
          <label>Nº do Quarto</label>
          <input placeholder="Número" value={hosp.quartoNumero} onChange={e => u('quartoNumero', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Tipo de Quarto</label>
          <select value={hosp.tipoQuarto} onChange={e => u('tipoQuarto', e.target.value)}>
            <option value="">Selecione...</option>
            {TIPOS_QUARTO.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      
      {/* Serviços */}
      <div className="field-group">
        <div className="field-wrap checkbox-wrap">
          <label>
            <input type="checkbox" checked={hosp.cafeIncluso} onChange={e => u('cafeIncluso', e.target.checked)} />
            Café da manhã incluso
          </label>
        </div>
        {hosp.cafeIncluso && (
          <div className="field-wrap">
            <label>Tipo de Café</label>
            <select value={hosp.tipoCafe} onChange={e => u('tipoCafe', e.target.value)}>
              <option value="">Selecione...</option>
              {TIPOS_CAFE.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}
      </div>
      
      <div className="field-group">
        <div className="field-wrap checkbox-wrap">
          <label>
            <input type="checkbox" checked={hosp.wifi} onChange={e => u('wifi', e.target.checked)} />
            Wi-Fi incluso
          </label>
        </div>
        <div className="field-wrap checkbox-wrap">
          <label>
            <input type="checkbox" checked={hosp.estacionamento} onChange={e => u('estacionamento', e.target.checked)} />
            Estacionamento incluso
          </label>
        </div>
      </div>
      
      {/* Contato */}
      <div className="field-group">
        <div className="field-wrap">
          <label>Telefone do Hotel</label>
          <input placeholder="(11) 99999-9999" value={hosp.contatoHotel} onChange={e => u('contatoHotel', e.target.value)} />
        </div>
        <div className="field-wrap">
          <label>Email do Hotel</label>
          <input type="email" placeholder="hotel@exemplo.com" value={hosp.emailHotel} onChange={e => u('emailHotel', e.target.value)} />
        </div>
      </div>
      
      {/* Link Maps */}
      <div className="field-group full">
        <div className="field-wrap">
          <label>Link Google Maps</label>
          <input placeholder="https://maps.google.com/..." value={hosp.linkMaps} onChange={e => u('linkMaps', e.target.value)} />
          {hosp.linkMaps && (
            <a href={hosp.linkMaps} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, marginTop: 4, display: 'inline-block' }}>
              📍 Abrir no Maps
            </a>
          )}
        </div>
      </div>
      
      {/* Instruções */}
      <div className="field-group full">
        <div className="field-wrap">
          <label>Instruções de Check-in</label>
          <textarea 
            placeholder="Ex: late check-in, recepção 24h, documento necessário..." 
            value={hosp.instrucoesCheckin} 
            onChange={e => u('instrucoesCheckin', e.target.value)} 
            rows={2}
          />
        </div>
      </div>
      
      {/* Observações */}
      <div className="field-group full">
        <div className="field-wrap">
          <label>Observações</label>
          <textarea 
            placeholder="Quarto, regime, notas especiais..." 
            value={hosp.obs} 
            onChange={e => u('obs', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default HospedagemForm;