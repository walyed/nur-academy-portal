import { Link } from 'react-router-dom';

export default function Landing() {
  const features = [
    { icon: '👨‍🏫', title: 'Expert Tutors', desc: 'Learn from qualified professionals in various subjects' },
    { icon: '📅', title: 'Easy Booking', desc: 'Schedule sessions that fit your availability' },
    { icon: '💬', title: 'Direct Chat', desc: 'Communicate with tutors before and after sessions' },
    { icon: '⭐', title: 'Rated Reviews', desc: 'Choose tutors based on student feedback' },
  ];

  const stats = [
    { value: '500+', label: 'Active Tutors' },
    { value: '10K+', label: 'Students' },
    { value: '50K+', label: 'Sessions' },
    { value: '4.8', label: 'Avg Rating' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '80px 20px',
        background: 'linear-gradient(135deg, hsl(210 60% 98%) 0%, hsl(210 50% 94%) 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '8px 16px',
            background: 'hsl(210 60% 90%)',
            borderRadius: '20px',
            fontSize: '14px',
            color: 'hsl(210 60% 40%)',
            marginBottom: '20px'
          }}>
            ✨ Start learning today
          </div>
          
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            lineHeight: 1.2,
            color: 'hsl(220 25% 15%)'
          }}>
            Find Your Perfect <span style={{ color: 'hsl(210 60% 45%)' }}>Tutor</span>
          </h1>
          
          <p style={{ 
            fontSize: '18px',
            color: 'hsl(220 10% 45%)',
            marginBottom: '40px',
            lineHeight: 1.7
          }}>
            Connect with expert tutors, book sessions easily, and achieve your learning goals. 
            Nur Academy makes quality education accessible to everyone.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/signup">
              <button style={{ padding: '16px 36px', fontSize: '16px' }}>
                Get Started Free →
              </button>
            </Link>
            <Link to="/login">
              <button className="btn-secondary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                I have an account
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '40px 20px',
        background: 'hsl(210 60% 45%)',
      }}>
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          textAlign: 'center'
        }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: 'hsl(210 60% 85%)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Why Choose Nur Academy?</h2>
            <p style={{ color: 'hsl(220 10% 50%)', fontSize: '16px' }}>
              Everything you need for a great learning experience
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            {features.map((feature, i) => (
              <div 
                key={i}
                className="card"
                style={{ textAlign: 'center', padding: '32px 24px' }}
              >
                <div style={{ 
                  fontSize: '40px', 
                  marginBottom: '16px',
                  background: 'hsl(210 60% 95%)',
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: 'hsl(220 10% 50%)', fontSize: '14px', margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '60px 20px',
        background: 'hsl(220 20% 97%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>
            Ready to Start Learning?
          </h2>
          <p style={{ color: 'hsl(220 10% 50%)', marginBottom: '24px' }}>
            Join thousands of students already learning with Nur Academy
          </p>
          <Link to="/signup">
            <button style={{ padding: '14px 32px', fontSize: '16px' }}>
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: 'hsl(220 25% 12%)',
        color: 'hsl(220 15% 70%)',
        padding: '50px 20px 30px'
      }}>
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '18px' }}>
              📚 Nur Academy
            </h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
              Making quality education accessible to everyone, everywhere.
            </p>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px' }}>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Find Tutors</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Become a Tutor</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px' }}>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Help Center</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Contact Us</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '14px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px' }}>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Privacy Policy</a></li>
              <li style={{ marginBottom: '10px' }}><a href="#" style={{ color: 'inherit' }}>Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid hsl(220 15% 25%)',
          paddingTop: '24px',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          © 2026 Nur Academy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
