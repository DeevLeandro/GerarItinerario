import React from 'react';
import { uid } from '../utils/helpers';

const LocalizadoresInput = ({ locs, onChange }) => {
  const add = () => onChange([...locs, { id: uid(), code: '', pax: '' }]);
  const upd = (id, field, val) => onChange(locs.map(l => l.id === id ? { ...l, [field]: val } : l));
  const rem = (id) => onChange(locs.filter(l => l.id !== id));

  return (
    <div>
      {locs && locs.map(l => (
        <div key={l.id} className="loc-row">
          <input 
            placeholder="Localizador (ex: AFG3GI)" 
            value={l.code} 
            onChange={e => upd(l.id, 'code', e.target.value)} 
            style={{ textTransform: 'uppercase' }}
          />
          <input 
            placeholder="Passageiro(s)" 
            value={l.pax} 
            onChange={e => upd(l.id, 'pax', e.target.value)}
          />
          <button className="btn-remove" onClick={() => rem(l.id)}>✕</button>
        </div>
      ))}
      <button className="btn-loc-add" onClick={add}>+ Adicionar Localizador</button>
    </div>
  );
};

export default LocalizadoresInput;