import { useState, useEffect } from 'react';
import fotoPrincipal from '../assets/Canchas.png'; 
export default function Canchas() {
  const [canchas, setCanchas] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/canchas')
      .then(res => res.json())
      .then(data => setCanchas(data))
      .catch(err => console.error('Error al traer canchas:', err));
  }, []);

  const obtenerClaseEstado = (estado) => {
    if (!estado) return 'mantenimiento';
    const est = estado.toLowerCase();
    if (est === 'disponible') return 'disponible';
    if (est === 'ocupado' || est === 'reservado') return 'ocupado';
    return 'mantenimiento';
  };
  return (
    <div className="dashboardContainer" style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Campos Deportivos
        </span>
        <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '2.5rem', margin: '0.2rem 0 0 0' }}>
          Sintéticos UNP
        </h1>
        <div style={{ width: '60px', height: '4px', background: '#2563eb', borderRadius: '2px', marginTop: '0.8rem' }} />
      </div>
      <div className="splitCanchasLayout">
        <div className="canchasSideLeft">
          <img 
            src={fotoPrincipal} 
            alt="Campos Sintéticos UNP" 
            className="mainCanchaImg"
          />
        </div>
        <div className="canchasSideRight">
          {canchas.map(cancha => (
            <div key={cancha.id_cancha} className="canchaCard" style={{ width: '100%' }}>
              <div className="canchaHeader">
                <h3 className="canchaTitle"> {cancha.nombre}</h3>
              </div>
              <div className="canchaBody">
                <div className="canchaInfoRow">
                  <span><strong>Tipo de Terreno:</strong></span>
                  <span>{cancha.tipo}</span>
                </div>
                <div className="canchaInfoRow" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span><strong>Precio por Hora:</strong></span>
                  <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem' }}>
                    S/. {cancha.precio}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                    ESTADO:
                  </span>
                  <span className={`badgeEstado ${obtenerClaseEstado(cancha.estado)}`}>
                    {cancha.estado}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}