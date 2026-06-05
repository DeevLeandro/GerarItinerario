import React from 'react';
import HospedagemForm from './HospedagemForm';
import { TIPOS_CARRO, novaHosp } from '../utils/helpers';

const CarroForm = ({
  carro, onChange, onRemove, onDuplicate, idx,
  onAddHosp, onUpdHosp, onRemHosp, onDuplicateHosp,
}) => {
  const u = (field, val) => onChange({ ...carro, [field]: val });
  const tipoLabel = TIPOS_CARRO.find(t => t.value === carro.tipo)?.label || carro.tipo;
  const isAluguel = carro.tipo === 'ALUGUEL';

  return (
    <div className="trecho-bloco">
      <div className="trecho-card carro-card">
        <div className="trecho-header">
          <span className="trecho-badge carro">
            {tipoLabel} #{idx + 1}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              value={carro.tipo}
              onChange={e => u('tipo', e.target.value)}
              style={{ background: '#222', border: '1px solid #444', color: '#fff', padding: '4px 8px', fontSize: '11px', borderRadius: '4px' }}
            >
              {TIPOS_CARRO.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {onDuplicate && <button className="btn-duplicate" onClick={onDuplicate}>📋 Duplicar</button>}
            <button className="btn-remove" onClick={onRemove}>Remover</button>
          </div>
        </div>

        {/* ── ALUGUEL DE CARRO: lógica de retirada/devolução ── */}
        {isAluguel ? (
          <>
            <div className="aluguel-bloco">
              <div className="aluguel-bloco-titulo">📍 Retirada</div>
              <div className="field-group">
                <div className="field-wrap">
                  <label>Local de Retirada</label>
                  <input
                    placeholder="Ex: Aeroporto GRU, Loja Localiza Centro..."
                    value={carro.origem}
                    onChange={e => u('origem', e.target.value)}
                  />
                </div>
                <div className="field-wrap">
                  <label>Data de Retirada</label>
                  <input type="date" value={carro.data} onChange={e => u('data', e.target.value)} />
                </div>
              </div>
              <div className="field-group">
                <div className="field-wrap">
                  <label>Horário de Retirada</label>
                  <input type="time" value={carro.horaSaida} onChange={e => u('horaSaida', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="aluguel-bloco">
              <div className="aluguel-bloco-titulo">🏁 Devolução</div>
              <div className="field-group">
                <div className="field-wrap">
                  <label>Local de Devolução</label>
                  <input
                    placeholder="Ex: Aeroporto MIA, mesma loja..."
                    value={carro.destino}
                    onChange={e => u('destino', e.target.value)}
                  />
                </div>
                <div className="field-wrap">
                  <label>Data de Devolução</label>
                  <input type="date" value={carro.dataFim || ''} onChange={e => u('dataFim', e.target.value)} />
                </div>
              </div>
              <div className="field-group">
                <div className="field-wrap">
                  <label>Horário de Devolução</label>
                  <input type="time" value={carro.horaChegada} onChange={e => u('horaChegada', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="field-group">
              <div className="field-wrap">
                <label>Empresa / Locadora</label>
                <input
                  placeholder="Ex: Localiza, Hertz, Movida..."
                  value={carro.empresa}
                  onChange={e => u('empresa', e.target.value)}
                />
              </div>
              <div className="field-wrap">
                <label>Modelo / Categoria</label>
                <input
                  placeholder="Ex: Toyota Corolla, SUV médio..."
                  value={carro.veiculo}
                  onChange={e => u('veiculo', e.target.value)}
                />
              </div>
            </div>
            <div className="field-group">
              <div className="field-wrap">
                <label>Nº de Confirmação</label>
                <input
                  placeholder="Ex: RES-4847321"
                  value={carro.confirmacao}
                  onChange={e => u('confirmacao', e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </>
        ) : (
          /* ── OUTROS TIPOS: Transfer, Uber, Ônibus, etc. ── */
          <>
            <div className="field-group">
              <div className="field-wrap">
                <label>Local de Saída</label>
                <input
                  placeholder="Ex: Hotel Hilton, Aeroporto GRU..."
                  value={carro.origem}
                  onChange={e => u('origem', e.target.value)}
                />
              </div>
              <div className="field-wrap">
                <label>Local de Chegada</label>
                <input
                  placeholder="Ex: Centro de Orlando..."
                  value={carro.destino}
                  onChange={e => u('destino', e.target.value)}
                />
              </div>
            </div>
            <div className="field-group">
              <div className="field-wrap">
                <label>Data</label>
                <input type="date" value={carro.data} onChange={e => u('data', e.target.value)} />
              </div>
              <div className="field-wrap">
                <label>Hora de Saída</label>
                <input type="time" value={carro.horaSaida} onChange={e => u('horaSaida', e.target.value)} />
              </div>
            </div>
            <div className="field-group">
              <div className="field-wrap">
                <label>Hora de Chegada (estimada)</label>
                <input type="time" value={carro.horaChegada} onChange={e => u('horaChegada', e.target.value)} />
              </div>
              <div className="field-wrap">
                <label>Duração Estimada</label>
                <input
                  placeholder="Ex: 45 min, 2h30..."
                  value={carro.duracaoEstimada}
                  onChange={e => u('duracaoEstimada', e.target.value)}
                />
              </div>
            </div>
            <div className="field-group">
              <div className="field-wrap">
                <label>Empresa / Serviço</label>
                <input
                  placeholder="Ex: Uber, Transfer VIP..."
                  value={carro.empresa}
                  onChange={e => u('empresa', e.target.value)}
                />
              </div>
              {carro.tipo === 'TRANSFER' && (
                <div className="field-wrap">
                  <label>Nome do Motorista</label>
                  <input
                    placeholder="Ex: João Silva"
                    value={carro.motorista}
                    onChange={e => u('motorista', e.target.value)}
                  />
                </div>
              )}
            </div>
            {carro.tipo === 'TRANSFER' && (
              <div className="field-group">
                <div className="field-wrap">
                  <label>Veículo / Placa</label>
                  <input
                    placeholder="Ex: Van Mercedes ABC-1234"
                    value={carro.veiculo}
                    onChange={e => u('veiculo', e.target.value)}
                  />
                </div>
                <div className="field-wrap">
                  <label>Nº de Confirmação</label>
                  <input
                    placeholder="Código de reserva"
                    value={carro.confirmacao}
                    onChange={e => u('confirmacao', e.target.value)}
                  />
                </div>
              </div>
            )}
            {(carro.tipo === 'UBER' || carro.tipo === 'OUTRO' || carro.tipo === 'ONIBUS' || carro.tipo === 'TREM') && (
              <div className="field-group">
                <div className="field-wrap">
                  <label>Código / Confirmação</label>
                  <input
                    placeholder="Código de reserva (se houver)"
                    value={carro.confirmacao}
                    onChange={e => u('confirmacao', e.target.value)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="field-group full">
          <div className="field-wrap">
            <label>Observações</label>
            <textarea
              placeholder="Instruções de retirada, endereço de encontro, observações especiais..."
              value={carro.obs}
              onChange={e => u('obs', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Hospedagens vinculadas */}
      {(carro.hospedagens || []).length > 0 && (
        <div className="hospedagens-vinculadas">
          <div className="hospedagens-vinculadas-label">
            <span className="hv-icon">🏨</span>
            Hospedagem após este trecho
            <div className="hv-linha" />
          </div>
          {(carro.hospedagens || []).map((h, hi) => (
            <HospedagemForm
              key={h.id}
              hosp={h}
              idx={hi}
              onChange={data => onUpdHosp(carro.id, h.id, data)}
              onRemove={() => onRemHosp(carro.id, h.id)}
              onDuplicate={() => onDuplicateHosp(carro.id, h)}
            />
          ))}
        </div>
      )}

      <button className="btn-add-hosp-trecho" onClick={() => onAddHosp(carro.id)}>
        🏨 Adicionar hospedagem após este trecho
      </button>
    </div>
  );
};

export default CarroForm;