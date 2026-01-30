"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const bookingId = searchParams.get("booking_id");

    if (sessionId && bookingId) {
      // Confirm payment with backend
      api
        .confirmPayment(parseInt(bookingId), undefined, sessionId)
        .then(() => {
          setStatus("success");
          setMessage("Your booking has been confirmed!");
        })
        .catch((err) => {
          console.error(err);
          // Even if API fails, payment might have succeeded
          setStatus("success");
          setMessage("Payment received! Your booking is being processed.");
        });
    } else {
      setStatus("success");
      setMessage("Payment completed successfully!");
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <h2>Confirming Payment...</h2>
          <p style={{ color: "hsl(220 10% 50%)" }}>
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h2>Payment Successful!</h2>
        <p style={{ color: "hsl(220 10% 50%)", marginBottom: "24px" }}>
          {message}
        </p>
        <button onClick={() => router.push("/student-dashboard")}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={{ maxWidth: "420px", margin: "60px auto", padding: "20px" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <h2>Loading...</h2>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
