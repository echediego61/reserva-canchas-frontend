export default function Titulo({ text }) {
  return (
    <h1 style={{ color: '#0f172a', borderBottom: '2px solid #2563eb', paddingBottom: '0.5rem' }}>
      {text}
    </h1>
  );
}