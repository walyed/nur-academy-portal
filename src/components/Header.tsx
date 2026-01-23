import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{ borderBottom: '1px solid #ccc', padding: '10px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
          <h1 style={{ margin: 0, fontSize: '20px' }}>Nur Academy</h1>
        </Link>
        
        <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <Link to={user.role === 'student' ? '/student-dashboard' : '/tutor-dashboard'}>
                Dashboard
              </Link>
              <Link to="/chat">Chat</Link>
              <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
