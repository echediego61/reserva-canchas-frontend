import { useState, useEffect } from 'react';

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState('');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Estados para crear nueva reserva (Modo Admin)
  const [mostrarFormCrear, setMostrarFormCrear] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevaCancha, setNuevaCancha] = useState('1');
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');

  // Estados para controlar la edición en línea
  const [editandoId, setEditandoId] = useState(null);
  const [editCancha, setEditCancha] = useState('1');
  const [editFecha, setEditFecha] = useState('');
  const [editHora, setEditHora] = useState('');

  const cargarReservas = (usuario) => {
    fetch(`http://localhost:5000/api/reservas?id_usuario=${usuario.id_usuario}&rol=${usuario.rol}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al obtener las reservas');
        return data;
      })
      .then(data => setReservas(data))
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
        const usuarioActual = JSON.parse(datosUsuario);
        setUsuarioLogueado(usuarioActual);
        cargarReservas(usuarioActual);
    }
  }, []);

  const manejarCrearReservaAdmin = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_cancha: parseInt(nuevaCancha, 10),
            fecha: nuevaFecha,
            hora: nuevaHora,
            rol: usuarioLogueado.rol,
            codigo_institucional: nuevoCodigo
        })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        alert("Reserva institucional registrada correctamente.");
        setNuevoCodigo('');
        setNuevaFecha('');
        setNuevaHora('');
        setMostrarFormCrear(false);
        cargarReservas(usuarioLogueado);
    })
    .catch(err => alert("Error al crear reserva: " + err.message));
  };

  const iniciarEdicion = (reserva) => {
    setEditandoId(reserva.id_reserva);
    setEditFecha(reserva.fecha ? reserva.fecha.split('T')[0] : '');
    setEditHora(reserva.hora);
    if (reserva.cancha === 'Cancha 1') setEditCancha('1');
    else if (reserva.cancha === 'Cancha 2') setEditCancha('2');
    else setEditCancha('3');
  };

  const guardarCambios = (id_reserva) => {
    fetch(`http://localhost:5000/api/reservas/${id_reserva}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_cancha: parseInt(editCancha, 10),
            fecha: editFecha,
            hora: editHora,
            rol: usuarioLogueado.rol
        })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setEditandoId(null);
        cargarReservas(usuarioLogueado);
    })
    .catch(err => alert("Error al editar: " + err.message));
  };

  const eliminarReserva = (id_reserva) => {
    if (window.confirm("¿Seguro que deseas cancelar esta reserva definitivamente?")) {
        fetch(`http://localhost:5000/api/reservas/${id_reserva}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol: usuarioLogueado.rol })
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            cargarReservas(usuarioLogueado);
        })
        .catch(err => alert("Error al cancelar: " + err.message));
    }
  };

  return (
    <div className="dashboardContainer" style={{ maxWidth: '1100px', margin: '2rem auto' }}>
      <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {usuarioLogueado?.rol === 'admin' ? 'Módulo de Control' : 'Mis Transacciones'}
            </span>
            <h2 style={{ color: '#0f172a', margin: '0.2rem 0 0 0', fontWeight: '800', fontSize: '1.8rem' }}>
              {usuarioLogueado?.rol === 'admin' ? ' Gestión Global de Reservas' : ' Mi Historial de Reservas'}
            </h2>
          </div>
                    {usuarioLogueado?.rol === 'admin' && (
            <button 
              onClick={() => setMostrarFormCrear(!mostrarFormCrear)} 
              style={{ background: mostrarFormCrear ? '#64748b' : '#2563eb', color: 'white', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'background-color 0.2s', fontSize: '0.9rem' }}
            >
              {mostrarFormCrear ? ' Cerrar Formulario' : ' Crear Reserva Nueva'}
            </button>
          )}
        </div>
        
        {error && <div className="errorBox">{error}</div>}
        {usuarioLogueado?.rol === 'admin' && mostrarFormCrear && (
          <form onSubmit={manejarCrearReservaAdmin} style={{ background: '#f8fafc', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
            <h3 style={{ margin: '0 0 1.2rem 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>Asignar Reserva Universitaria</h3>
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              
              <div style={{ flex: '1 1 220px' }}>
                <label className="labelForm">Código del Usuario (Alumno/Docente):</label>
                <input type="text" required className="inputForm" value={nuevoCodigo} onChange={e => setNuevoCodigo(e.target.value)} placeholder="Ej: 20261042" />
              </div>

              <div style={{ flex: '1 1 180px' }}>
                <label className="labelForm">Seleccionar Cancha:</label>
                <select className="inputForm" value={nuevaCancha} onChange={e => setNuevaCancha(e.target.value)} style={{ appearance: 'none', background: '#fff' }}>
                  <option value="1">Cancha 1 (Fútbol 7)</option>
                  <option value="2">Cancha 2 (Fútbol 7)</option>
                  <option value="3">Cancha 3 (Fútbol 7)</option>
                </select>
              </div>

              <div style={{ flex: '1 1 150px' }}>
                <label className="labelForm">Fecha:</label>
                <input type="date" required className="inputForm" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} />
              </div>

              <div style={{ flex: '1 1 130px' }}>
                <label className="labelForm">Hora:</label>
                <input type="time" required className="inputForm" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)} />
              </div>

              <button type="submit" className="btnSubmit" style={{ flex: '0 0 auto', width: 'auto', padding: '0.65rem 1.5rem', height: '39px' }}>
                Registrar Reserva
              </button>
            </div>
          </form>
        )}
        {reservas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
             No se encontraron reservas registradas en este momento.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '1rem', fontWeight: '700' }}>ID</th>
                  <th style={{ padding: '1rem', fontWeight: '700' }}>Usuario</th>
                  <th style={{ padding: '1rem', fontWeight: '700' }}>Código / ID</th> 
                  <th style={{ padding: '1rem', fontWeight: '700' }}>Cancha</th>
                  <th style={{ padding: '1rem', fontWeight: '700' }}>Fecha</th>
                  <th style={{ padding: '1rem', fontWeight: '700' }}>Hora</th>
                  {usuarioLogueado?.rol === 'admin' && <th style={{ padding: '1rem', fontWeight: '700', textAlign: 'center' }}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => {
                  const estaEditando = editandoId === reserva.id_reserva;
                  const esCancelada = reserva.estado === 'cancelada';

                  return (
                    <tr 
                      key={reserva.id_reserva} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        background: esCancelada ? '#f8fafc' : '#fff', 
                        opacity: esCancelada ? 0.65 : 1,
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <td style={{ padding: '1rem', color: '#64748b', fontWeight: '600' }}>#{reserva.id_reserva}</td>
                      <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b', textDecoration: esCancelada ? 'line-through' : 'none' }}>
                        {reserva.usuario}
                      </td>
                      
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: '600' }}>
                          {reserva.codigo_institucional || 'N/A'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>
                        {estaEditando ? (
                          <select className="inputForm" value={editCancha} onChange={e => setEditCancha(e.target.value)} style={{ padding: '0.3rem', fontSize: '0.9rem' }}>
                            <option value="1">Cancha 1 (Fútbol 7)</option>
                            <option value="2">Cancha 2 (Fútbol 7)</option>
                            <option value="3">Cancha 3 (Fútbol 7)</option>
                          </select>
                        ) : (
                          <span> {reserva.cancha}</span>
                        )}
                      </td>

                      <td style={{ padding: '1rem', color: '#334155' }}>
                        {estaEditando ? (
                          <input type="date" className="inputForm" value={editFecha} onChange={e => setEditFecha(e.target.value)} style={{ padding: '0.3rem', fontSize: '0.9rem' }} />
                        ) : (
                          reserva.fecha ? reserva.fecha.split('T')[0] : ''
                        )}
                      </td>

                      <td style={{ padding: '1rem', color: '#334155', fontWeight: '500' }}>
                        {estaEditando ? (
                          <input type="time" className="inputForm" value={editHora} onChange={e => setEditHora(e.target.value)} style={{ padding: '0.3rem', fontSize: '0.9rem' }} />
                        ) : (
                          <span> {reserva.hora}</span>
                        )}
                      </td>
                      {usuarioLogueado?.rol === 'admin' && (
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {esCancelada ? (
                            <span className="badgeEstado ocupado" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                               Cancelada
                            </span>
                          ) : estaEditando ? (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button onClick={() => guardarCambios(reserva.id_reserva)} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>✓ Guardar</button>
                              <button onClick={() => setEditandoId(null)} style={{ background: '#94a3b8', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}>Volver</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button onClick={() => iniciarEdicion(reserva)} style={{ background: '#fef08a', color: '#854d0e', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', transition: 'background 0.2s' }}> Editar</button>
                              <button onClick={() => eliminarReserva(reserva.id_reserva)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', transition: 'background 0.2s' }}> Cancelar</button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}