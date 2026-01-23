import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!expiry) newErrors.expiry = 'Expiry date is required';
    if (!cvv) newErrors.cvv = 'CVV is required';
    if (!name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ maxWidth: '420px', margin: '60px auto', padding: '20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2>Payment Successful!</h2>
          <p style={{ color: 'hsl(220 10% 50%)', marginBottom: '24px' }}>
            Your booking has been confirmed.
          </p>
          <button onClick={() => navigate('/student-dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', padding: '20px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>💳 Payment</h2>
        
        <div style={{ 
          background: 'hsl(220 20% 98%)', 
          padding: '16px', 
          marginBottom: '24px', 
          borderRadius: '8px',
          border: '1px solid hsl(220 15% 85%)'
        }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'hsl(220 10% 50%)' }}>
            ORDER SUMMARY
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Tutoring Session</span>
            <span>Mathematics</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Duration</span>
            <span>1 hour</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: 600,
            fontSize: '18px',
            paddingTop: '12px',
            borderTop: '1px solid hsl(220 15% 85%)'
          }}>
            <span>Total</span>
            <span style={{ color: 'hsl(210 60% 45%)' }}>$30.00</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Cardholder Name</label>
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
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              style={{ width: '100%' }}
            />
            {errors.cardNumber && <span style={{ color: 'hsl(0 70% 50%)', fontSize: '13px' }}>{errors.cardNumber}</span>}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                style={{ width: '100%' }}
              />
              {errors.expiry && <span style={{ color: 'hsl(0 70% 50%)', fontSize: '13px' }}>{errors.expiry}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                style={{ width: '100%' }}
              />
              {errors.cvv && <span style={{ color: 'hsl(0 70% 50%)', fontSize: '13px' }}>{errors.cvv}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={processing}
            style={{ width: '100%', padding: '14px' }}
          >
            {processing ? 'Processing...' : 'Pay $30.00'}
          </button>
        </form>
      </div>
    </div>
  );
}
