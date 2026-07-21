import { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import imagenCancha from '../assets/LogoUnp.png';
export default function Login({ onLogin }) { 
  const [correo, setCorreo] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 
  const handleSubmit = (e) => {
    e.preventDefault(); 
    setError('');
    fetch('http://localhost:5000/api/usuarios/login', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ correo, password })
    }) 
    .then(async res => {
      const data = await res.json(); 
      if (!res.ok) throw new Error(data.error || 'Error en el servidor'); 
      return data; 
    }) 
    .then(usuario => { 
      localStorage.setItem('usuario', JSON.stringify(usuario));
      onLogin(usuario); 
      navigate('/'); 
    }) 
    .catch(err => setError(err.message)); 
  };

  return ( 
    <div className="authContainer"> 
    
      <div className="authCard" style={{ backdropFilter: 'blur(4px)' }}> 
        
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
         src={imagenCancha} 
         alt="Logo Universidad Nacional de Piura" 
         className="logoInstitucional" 
          />   
          <h2 style={{ color: '#0f172a', margin: '0.5rem 0 0 0', fontWeight: '700' }}>Canchas UNP</h2>
          <p style={{ color: '#64748b', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>Gestión de Reservas de Canchas</p>
        </div>

        {error && <div className="errorBox"> {error}</div>} 

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div> 
            <label className="labelForm">Correo Electrónico</label>
            <input 
              type="email" 
              required 
              className="inputForm"
              placeholder="ejemplo@universidad.edu"
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
          <button type="submit" className="btnSubmit">
            Ingresar
          </button> 
          <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}> 
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
              Regístrate aquí
            </Link>
          </p> 
        </form> 
      </div> 
    </div> 
  ); 
}