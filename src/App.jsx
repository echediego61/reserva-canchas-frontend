import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Canchas from './pages/Canchas';
import Reservas from './pages/Reservas';
import NuevaReserva from './pages/NuevaReserva';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Recuperar sesión activa al cargar la app
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('usuario');
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // SI NO HAY USUARIO: Solo renderiza Login o Registro, protegiendo todo lo demás
  if (!usuario) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={setUsuario} />} />
        <Route path="/registro" element={<Registro />} />
        {/* Cualquier intento de entrar a otra URL redirige al Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // SI HAY USUARIO: Interfaz completa y acceso libre a las rutas protegidas
  return (
    <>
      <nav style={{ background: '#1e293b', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
          <Link to="/canchas" style={{ color: 'white', textDecoration: 'none' }}>Canchas</Link>
        <Link to="/reservas" style={{ color: 'white', textDecoration: 'none' }}>
    {usuario.rol === 'admin' ? ' Gestionar Reservas' : 'Mis Reservas'}
  </Link>
  {usuario.rol !== 'admin' && (
    <Link to="/nueva-reserva" style={{ color: 'white', textDecoration: 'none' }}>Nueva Reserva</Link>
  )}
</div>
        <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Hola, <strong>{usuario.nombre}</strong></span>
          <button onClick={cerrarSesion} className="btn btn-danger" style={{ padding: '0.3rem 0.7rem' }}>Salir</button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/canchas" element={<Canchas />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/nueva-reserva" element={<NuevaReserva usuarioLogueado={usuario} />} />
        {/* Si está logueado e intenta ir a login/registro, lo regresa al inicio */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/registro" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;