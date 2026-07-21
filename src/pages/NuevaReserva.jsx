import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Titulo from '../components/Titulo';

export default function NuevaReserva({ usuarioLogueado }) {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [canchas, setCanchas] = useState([]);
  const [formData, setFormData] = useState({
    id_usuario: usuarioLogueado?.id_usuario || 1, 
    id_cancha: '',
    fecha: '',
    hora: ''
  });

  // Definimos la constante de la API una sola vez arriba para reusarla
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // 1. Modificado para traer las canchas dinámicamente
    fetch(`${API_URL}/api/canchas`)
      .then(res => res.json())
      .then(data => setCanchas(data))
      .catch(err => console.error('Error al cargar canchas:', err));
  }, [API_URL]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 2. Modificado para registrar la reserva en la nube
    fetch(`${API_URL}/api/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo registrar la reserva.');
      }
      return data;
    })
    .then(() => {
      navigate('/reservas');
    })
    .catch(err => {
      setError(err.message);
      console.error("Validación fallida:", err.message);
    });
  };

  return (
    <div className="dashboardContainer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="authCard" style={{ maxWidth: '460px', width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Reserva de Turnos
          </span>
          <h2 style={{ color: '#0f172a', margin: '0.3rem 0 0 0', fontWeight: '800', fontSize: '1.6rem' }}>
             Nueva Reserva
          </h2>
        </div>
        {error && (
          <div className="errorBox" style={{ marginBottom: '1.5rem' }}>
            <strong>¡Atención!</strong> {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label className="labelForm">Selecciona la Cancha:</label>
            <select 
              required 
              className="inputForm" 
              style={{ appearance: 'none', background: '#fff' }}
              onChange={e => setFormData({...formData, id_cancha: e.target.value})}
            >
              <option value="">-- Elegir Cancha --</option>
              {canchas.map(c => (
                <option key={c.id_cancha} value={c.id_cancha}>
                   {c.nombre} ({c.tipo})
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label className="labelForm">Fecha del Turno:</label>
            <input 
              type="date" 
              required 
              className="inputForm"
              onChange={e => setFormData({...formData, fecha: e.target.value})} 
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label className="labelForm">Hora de Inicio:</label>
            <input 
              type="time" 
              required 
              className="inputForm"
              onChange={e => setFormData({...formData, hora: e.target.value})} 
            />
          </div>
          <button type="submit" className="btnSubmit">
            Confirmar y Guardar Reserva
          </button>
        </form>
      </div>
    </div>
  );
}