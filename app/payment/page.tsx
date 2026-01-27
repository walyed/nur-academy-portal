"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Booking {
  id: number;
  tutor_name: string;
  subject: string;
  date: string;
  time: string;
  amount: number;
  paid: boolean;
}

export default function PaymentPage() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBookings()
      .then((data) => {
        const unpaidBookings = data.filter((b: Booking) => !b.paid);
        setBookings(unpaidBookings);
        if (unpaidBookings.length > 0) {
          setSelectedBooking(unpaidBookings[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!cardNumber) newErrors.cardNumber = "Card number is required";
    if (!expiry) newErrors.expiry = "Expiry date is required";
    if (!cvv) newErrors.cvv = "CVV is required";
    if (!name) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedBooking) return;

    setProcessing(true);
    try {
      await api.processPayment(selectedBooking.id);
      setSuccess(true);
    } catch {
      setErrors({ general: "Payment failed. Please try again." });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "420px",
          margin: "60px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2>Payment Successful!</h2>
          <p style={{ color: "hsl(220 10% 50%)", marginBottom: "24px" }}>
            Your booking has been confirmed.
          </p>
          <button onClick={() => router.push("/student-dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h2>No Pending Payments</h2>
          <p style={{ color: "hsl(220 10% 50%)", marginBottom: "24px" }}>
            You have no unpaid bookings.
          </p>
          <button onClick={() => router.push("/student-dashboard")}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
      <div className="card">
        <h2 style={{ marginBottom: "20px" }}>💳 Payment</h2>

        {errors.general && (
          <div
            style={{
              color: "hsl(0 70% 50%)",
              marginBottom: "16px",
              padding: "10px",
              background: "hsl(0 70% 95%)",
              borderRadius: "6px",
            }}
          >
            {errors.general}
          </div>
        )}

        {bookings.length > 1 && (
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Select Booking
            </label>
            <select
              title="Select Booking"
              value={selectedBooking?.id || ""}
              onChange={(e) => {
                const booking = bookings.find(
                  (b) => b.id === parseInt(e.target.value),
                );
                setSelectedBooking(booking || null);
              }}
              style={{ width: "100%" }}
            >
              {bookings.map((booking) => (
                <option key={booking.id} value={booking.id}>
                  {booking.subject} - {booking.date} {booking.time}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBooking && (
          <div
            style={{
              background: "hsl(220 20% 98%)",
              padding: "16px",
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid hsl(220 15% 85%)",
            }}
          >
            <h4
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                color: "hsl(220 10% 50%)",
              }}
            >
              ORDER SUMMARY
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Tutor</span>
              <span>{selectedBooking.tutor_name}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Subject</span>
              <span>{selectedBooking.subject}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Date & Time</span>
              <span>
                {selectedBooking.date} {selectedBooking.time}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 600,
                fontSize: "18px",
                paddingTop: "12px",
                borderTop: "1px solid hsl(220 15% 85%)",
              }}
            >
              <span>Total</span>
              <span style={{ color: "hsl(210 60% 45%)" }}>
                ${selectedBooking.amount}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Cardholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={{ width: "100%" }}
            />
            {errors.name && (
              <span style={{ color: "hsl(0 70% 50%)", fontSize: "13px" }}>
                {errors.name}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              style={{ width: "100%" }}
            />
            {errors.cardNumber && (
              <span style={{ color: "hsl(0 70% 50%)", fontSize: "13px" }}>
                {errors.cardNumber}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Expiry
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                style={{ width: "100%" }}
              />
              {errors.expiry && (
                <span style={{ color: "hsl(0 70% 50%)", fontSize: "13px" }}>
                  {errors.expiry}
                </span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={4}
                style={{ width: "100%" }}
              />
              {errors.cvv && (
                <span style={{ color: "hsl(0 70% 50%)", fontSize: "13px" }}>
                  {errors.cvv}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={processing || !selectedBooking}
            style={{ width: "100%", padding: "14px" }}
          >
            {processing
              ? "Processing..."
              : `Pay $${selectedBooking?.amount || 0}`}
          </button>
        </form>
      </div>
    </div>
  );
}
