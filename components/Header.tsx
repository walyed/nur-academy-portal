"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header style={{ 
      background: 'white', 
      borderBottom: '1px solid hsl(220 15% 85%)', 
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '22px', 
            color: 'hsl(210 60% 45%)',
            fontWeight: 700
          }}>
            📚 Nur Academy
          </h1>
        </Link>
        
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'hsl(220 10% 50%)' }}>
                Welcome, <strong style={{ color: 'hsl(220 20% 20%)' }}>{user.name}</strong>
              </span>
              <Link href={user.role === 'student' ? '/student-dashboard' : '/tutor-dashboard'}>
                Dashboard
              </Link>
              <Link href="/chat">Chat</Link>
              <button 
                onClick={handleLogout} 
                className="btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">
                <button style={{ padding: '8px 20px' }}>Sign Up</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
