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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handlePayWithStripe = async () => {
    if (!selectedBooking) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await api.createCheckoutSession(
        selectedBooking.id,
        `${window.location.origin}/payment/success`,
        `${window.location.origin}/payment`
      );

      // Redirect to Stripe Checkout
      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error(err);
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
        <h2 style={{ marginBottom: "20px" }}>💳 Complete Payment</h2>

        {error && (
          <div
            style={{
              color: "hsl(0 70% 50%)",
              marginBottom: "16px",
              padding: "10px",
              background: "hsl(0 70% 95%)",
              borderRadius: "6px",
            }}
          >
            {error}
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
                  (b) => b.id === parseInt(e.target.value)
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

        <button
          onClick={handlePayWithStripe}
          disabled={!selectedBooking || processing}
          style={{
            width: "100%",
            padding: "14px",
            background: "#635bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: processing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {processing ? (
            "Redirecting to Stripe..."
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
              </svg>
              Pay with Stripe - ${selectedBooking?.amount || 0}
            </>
          )}
        </button>

        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "hsl(220 20% 98%)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "hsl(220 10% 50%)",
            textAlign: "center",
          }}
        >
          🔒 You will be redirected to Stripe&apos;s secure payment page
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "hsl(220 10% 60%)",
            textAlign: "center",
          }}
        >
          Test card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3
          digits
        </div>
      </div>
    </div>
  );
}
