import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/canchas">Canchas</Link>
      <Link to="/reservas">Reservas</Link>
      <Link to="/nueva-reserva">Nueva Reserva</Link>
    </nav>
  );
}