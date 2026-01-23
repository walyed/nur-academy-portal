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
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        <h2>Payment Successful!</h2>
        <p style={{ marginTop: '20px' }}>Your booking has been confirmed.</p>
        <button 
          onClick={() => navigate('/student-dashboard')} 
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Payment</h2>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', marginBottom: '20px', border: '1px solid #ccc' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Order Summary</h4>
        <p style={{ margin: '5px 0' }}>Tutoring Session - Mathematics</p>
        <p style={{ margin: '5px 0' }}>Duration: 1 hour</p>
        <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Total: $30.00</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Cardholder Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Card Number *</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.cardNumber && <span style={{ color: 'red', fontSize: '12px' }}>{errors.cardNumber}</span>}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Expiry *</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            {errors.expiry && <span style={{ color: 'red', fontSize: '12px' }}>{errors.expiry}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>CVV *</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength={4}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
            {errors.cvv && <span style={{ color: 'red', fontSize: '12px' }}>{errors.cvv}</span>}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={processing}
          style={{ padding: '10px 20px', width: '100%' }}
        >
          {processing ? 'Processing...' : 'Pay $30.00'}
        </button>
      </form>
    </div>
  );
}
