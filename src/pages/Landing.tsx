import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '80px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
      <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Welcome to Nur Academy</h1>
      <p style={{ 
        fontSize: '18px',
        color: 'hsl(220 10% 50%)',
        marginBottom: '40px',
        lineHeight: 1.7
      }}>
        Connect with qualified tutors and book sessions easily. 
        Start your learning journey today.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link to="/login">
          <button className="btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button style={{ padding: '14px 32px', fontSize: '16px' }}>
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
