import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Titulo from '../components/Titulo';
export default function Inicio() {
  const [rol, setRol] = useState('usuario'); 
  const [nombre, setNombre] = useState('');
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const user = JSON.parse(usuarioGuardado);
        setRol(user.rol || 'usuario'); 
        setNombre(user.nombre || '');
      } catch (e) {
        console.error("Error al leer la sesión", e);
      }
    }
  }, []);
  if (rol === 'admin') {
    return (
      <div className="dashboardContainer">
        <div className="welcomeSection" style={{ textAlign: 'left', borderTop: '4px solid #2563eb' }}>
          <span className="adminBadge">Modo Administrador</span>
          <Titulo text={`Panel de Control General`} />
          <p className="welcomeSubtitle">Hola, {nombre}. Controla el uso del complejo deportivo y gestiona los turnos asignados.</p>
        </div>
        <div className="featuresGrid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          <div className="featureCard">
            <div>
              <div className="cardIcon"></div>
              <h3 className="cardTitle">Gestionar Reservas</h3>
              <p className="cardDescription">
                Revisa las solicitudes de los alumnos y docentes en tiempo real. Modifica estados, aprueba turnos o cancela reservas de ser necesario.
              </p>
            </div>
            <Link to="/reservas" className="btnAction">
              Abrir Panel de Control →
            </Link>
          </div>
          <div className="featureCard">
            <div>
              <div className="cardIcon"></div>
              <h3 className="cardTitle">Ver Canchas disponibles</h3>
              <p className="cardDescription">
                Visualiza el estado actual de las canchas del campus.
              </p>
            </div>
            <Link to="/canchas" className="btnAction" style={{ background: '#475569' }}>
              Ver Canchas
            </Link>
          </div>

        </div>
      </div>
    );
  }
  return (
    <div className="dashboardContainer">
      <div className="welcomeSection">
        <span style={{ fontSize: '3.5rem' }}></span>
        <Titulo text={`¡Hola de nuevo, ${nombre}!`} />
        <p className="welcomeSubtitle">
          Reserva tus espacios deportivos de forma rápida y eficiente en el campus.
        </p>
      </div>
      <div className="featuresGrid">
        <div className="featureCard">
          <div>
            <div className="cardIcon"></div>
            <h3 className="cardTitle">Separar Cancha</h3>
            <p className="cardDescription">Revisa los horarios disponibles en tiempo real, selecciona tu turno y asegura tu partido en un par de clics.</p>
          </div>
          <Link to="/nueva-reserva" className="btnAction">Ir a Reservas →</Link>
        </div>
        <div className="featureCard">
          <div>
            <div className="cardIcon"></div>
            <h3 className="cardTitle">Mis Reservas</h3>
            <p className="cardDescription">Consulta el historial de tus partidos programados, verifica estados de confirmación.</p>
          </div>
          <Link to="/reservas" className="btnAction" style={{ background: '#475569' }}>Ver Mis Turnos</Link>
        </div>
        <div className="featureCard">
          <div>
            <div className="cardIcon"></div>
            <h3 className="cardTitle">Ver Canchas disponibles</h3>
            <p className="cardDescription">Visualiza el estado actual de las canchas del campus.</p>
          </div>
          <Link to="/canchas" className="btnAction" style={{ background: '#475569' }}>Ver Canchas</Link>
        </div>
      </div>
    </div>
  );
}