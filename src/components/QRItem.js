import React, { useRef, useEffect } from 'react';

const QRItem = ({ data, label }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && data && window.QRCode) {
      ref.current.innerHTML = '';
      try {
        new window.QRCode(ref.current, {
          text: data,
          width: 60,
          height: 60,
          colorDark: '#0d0d0d',
          colorLight: '#f8f6f0'
        });
      } catch (e) {
        console.error('QR Code generation error:', e);
      }
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="prev-qr-item">
      <div ref={ref} />
      <div className="prev-qr-label">{label}</div>
    </div>
  );
};

export default QRItem;