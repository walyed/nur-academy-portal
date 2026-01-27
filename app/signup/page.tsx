"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  
  const { signup } = useAuth();
  const router = useRouter();

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    signup(name, role);
    router.push(role === 'student' ? '/student-dashboard' : '/tutor-dashboard');
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '20px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
        <p style={{ color: 'hsl(220 10% 50%)', marginBottom: '24px' }}>
          Join Nur Academy today.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={{ width: '100%' }}
            />
            {errors.name && <span style={{ color: 'hsl(0 70% 50%)', fontSize: '13px' }}>{errors.name}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%' }}
            />
            {errors.email && <span style={{ color: 'hsl(0 70% 50%)', fontSize: '13px' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%' }}
            />
            {errors.password && <span style={{ color: 'hsl(0 70% 50%)', fontSize: '13px' }}>{errors.password}</span>}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>I am a:</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ 
                flex: 1, 
                padding: '12px', 
                border: `2px solid ${role === 'student' ? 'hsl(210 60% 45%)' : 'hsl(220 15% 85%)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                background: role === 'student' ? 'hsl(210 60% 95%)' : 'white'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  style={{ display: 'none' }}
                />
                🎓 Student
              </label>
              <label style={{ 
                flex: 1, 
                padding: '12px', 
                border: `2px solid ${role === 'tutor' ? 'hsl(210 60% 45%)' : 'hsl(220 15% 85%)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'center',
                background: role === 'tutor' ? 'hsl(210 60% 95%)' : 'white'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="tutor"
                  checked={role === 'tutor'}
                  onChange={() => setRole('tutor')}
                  style={{ display: 'none' }}
                />
                👨‍🏫 Tutor
              </label>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px' }}>
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'hsl(220 10% 50%)' }}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
