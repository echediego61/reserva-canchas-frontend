import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoUnp from '../assets/LogoUnp.png'; 

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();
  const [codigoInstitucional, setCodigoInstitucional] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setExito(false);

    // Lee la variable de Render o recurre a localhost en tu PC
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    fetch(`${API_URL}/api/usuarios/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nombre, 
        correo, 
        password, 
        codigo_institucional: codigoInstitucional 
      })
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al registrar');
        return data;
    })
    .then(() => {
        setExito(true);
        setTimeout(() => {
            navigate('/login'); 
        }, 2000);
    })
    .catch(err => setError(err.message));
  };
  return (
    <div className="authContainer">
      <div className="authCard" style={{ backdropFilter: 'blur(4px)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img 
            src={logoUnp} 
            alt="Logo UNP" 
            className="logoInstitucional" 
          />
          <h2 style={{ color: '#0f172a', margin: '0.5rem 0 0 0', fontWeight: '700' }}>Canchas UNP</h2>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Crear Cuenta Nueva</p>
        </div>

        {error && <div className="errorBox">⚠️ {error}</div>}
        {exito && <div className="successBox"> ¡Registro exitoso! Redirigiendo...</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="labelForm">Nombre Completo</label>
            <input 
              type="text" 
              required 
              className="inputForm"
              placeholder="Ej. Juan Pérez"
              onChange={e => setNombre(e.target.value)} 
            />
          </div>
          <div>
            <label className="labelForm">Código Universitario / ID Personal</label>
            <input 
              type="text" 
              required 
              value={codigoInstitucional} 
              className="inputForm"
              placeholder="Ej. 20261042" 
              onChange={e => setCodigoInstitucional(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="labelForm">Correo Electrónico</label>
            <input 
              type="email" 
              required 
              className="inputForm"
              placeholder="ejemplo@unp.edu.pe"
              onChange={e => setCorreo(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="labelForm">Contraseña</label>
            <input 
              type="password" 
              required 
              className="inputForm"
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)} 
            />
          </div>      
          <button type="submit" className="btnSubmit" style={{ marginTop: '0.5rem' }}>
            Registrar Usuario
          </button>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}