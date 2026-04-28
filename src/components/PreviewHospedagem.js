import React from 'react';
import { fmtDate } from '../utils/helpers';

const PreviewHospedagem = ({ h }) => {
  const enderecoCompleto = [
    h.endereco,
    h.numero,
    h.bairro,
    h.cidade,
    h.estado,
    h.cep
  ].filter(Boolean).join(', ');

  return (
    <div className="prev-hosp">
      <div className="prev-hosp-header">
        <div className="prev-hosp-hotel">{h.hotel || 'Hotel não informado'}</div>
        {h.codigo && <div className="prev-hosp-cod">{h.codigo}</div>}
      </div>
      
      {/* Endereço */}
      {enderecoCompleto && (
        <div className="prev-hosp-endereco">
          📍 {enderecoCompleto}{h.pais ? `, ${h.pais}` : ''}
        </div>
      )}
      
      {/* Datas e Horários */}
      <div className="prev-hosp-datas">
        📅 Check-in: {fmtDate(h.inicio) || '—'} {h.checkinHorario ? `às ${h.checkinHorario}` : ''}
        <br />
        📅 Check-out: {fmtDate(h.fim) || '—'} {h.checkoutHorario ? `às ${h.checkoutHorario}` : ''}
      </div>
      
      {/* Café da manhã */}
      <div className="prev-hosp-cafe">
        ☕ Café da manhã: {h.cafeIncluso ? `Incluso${h.tipoCafe ? ` (${h.tipoCafe})` : ''}` : 'Não incluso'}
      </div>
      
      {/* Serviços */}
      <div className="prev-hosp-servicos">
        {h.wifi && <span>📶 Wi-Fi incluso</span>}
        {h.estacionamento && <span>🚗 Estacionamento incluso</span>}
      </div>
      
      {/* Quarto */}
      {(h.quartoNumero || h.tipoQuarto) && (
        <div className="prev-hosp-quarto">
          🛏 Quarto: {h.quartoNumero && `nº ${h.quartoNumero}`} {h.tipoQuarto && `(${h.tipoQuarto})`}
        </div>
      )}
      
      {/* Contato */}
      {(h.contatoHotel || h.emailHotel) && (
        <div className="prev-hosp-contato">
          📞 Contato: {h.contatoHotel}{h.contatoHotel && h.emailHotel && ' • '}{h.emailHotel}
        </div>
      )}
      
      {/* Link Maps */}
      {h.linkMaps && (
        <div className="prev-hosp-maps">
          🗺 <a href={h.linkMaps} target="_blank" rel="noopener noreferrer">Ver localização no Google Maps</a>
        </div>
      )}
      
      {/* Instruções */}
      {h.instrucoesCheckin && (
        <div className="prev-hosp-instrucoes">
          ℹ️ {h.instrucoesCheckin}
        </div>
      )}
      
      {/* Observações */}
      {h.obs && <div className="prev-obs" style={{ marginTop: 8 }}>{h.obs}</div>}
    </div>
  );
};

export default PreviewHospedagem;