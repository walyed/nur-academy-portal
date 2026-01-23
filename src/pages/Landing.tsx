import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>Welcome to Nur Academy</h1>
      <p style={{ marginTop: '20px', marginBottom: '30px' }}>
        Connect with tutors and book sessions easily.
      </p>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link to="/login">
          <button style={{ padding: '10px 30px', fontSize: '16px' }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ padding: '10px 30px', fontSize: '16px' }}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
