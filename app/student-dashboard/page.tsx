"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import StarRating from "@/components/StarRating";
import MonthlyCalendar from "@/components/MonthlyCalendar";

interface Tutor {
  id: number;
  name: string;
  subject: string;
  rating: number;
  hourly_rate: number;
}

interface TimeSlot {
  id: number;
  tutor: number;
  date: string;
  time: string;
  available: boolean;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<number | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getTutors()
      .then(setTutors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedTutor) {
      api.getSlots(selectedTutor).then(setSlots).catch(console.error);
    }
  }, [selectedTutor]);

  const handleBook = async (slot: TimeSlot) => {
    if (!slot.available) return;

    try {
      await api.createBooking(slot.id);
      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, available: false } : s)),
      );
      setBookingConfirmed(`Booking confirmed for ${slot.date} at ${slot.time}`);
      setTimeout(() => setBookingConfirmed(null), 3000);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const selectedTutorData = tutors.find((t) => t.id === selectedTutor);

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "30px 20px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "8px" }}>🎓 Student Dashboard</h2>
        <p style={{ color: "hsl(220 10% 50%)" }}>
          Welcome back, {user?.name || "Student"}
        </p>
      </div>

      {bookingConfirmed && (
        <div className="success-message" style={{ marginBottom: "20px" }}>
          ✅ {bookingConfirmed}
        </div>
      )}

      <section className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>👨‍🏫 Available Tutors</h3>

        <div style={{ display: "grid", gap: "16px" }}>
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background:
                  selectedTutor === tutor.id
                    ? "hsl(210 60% 97%)"
                    : "hsl(220 20% 98%)",
                borderRadius: "12px",
                border:
                  selectedTutor === tutor.id
                    ? "2px solid hsl(210 60% 45%)"
                    : "1px solid hsl(220 15% 88%)",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "hsl(210 60% 90%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    color: "hsl(210 60% 40%)",
                  }}
                >
                  {tutor.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                    {tutor.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "hsl(220 10% 50%)" }}>
                    {tutor.subject} • <StarRating rating={tutor.rating} />
                  </div>
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "24px" }}
              >
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "hsl(210 60% 45%)",
                    }}
                  >
                    ${tutor.hourly_rate}
                  </div>
                  <div style={{ fontSize: "12px", color: "hsl(220 10% 50%)" }}>
                    per hour
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href={`/chat?contact=${tutor.id}`}>
                    <button
                      className="btn-secondary"
                      style={{ padding: "8px 14px", fontSize: "14px" }}
                    >
                      💬 Chat
                    </button>
                  </Link>
                  <button
                    onClick={() =>
                      setSelectedTutor(
                        selectedTutor === tutor.id ? null : tutor.id,
                      )
                    }
                    style={{ padding: "8px 14px", fontSize: "14px" }}
                  >
                    {selectedTutor === tutor.id ? "✕ Close" : "📅 View Slots"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTutor && selectedTutorData && (
        <section className="card" style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>
                📅 {selectedTutorData.name}&apos;s Availability
              </h3>
              <p
                style={{
                  color: "hsl(220 10% 50%)",
                  fontSize: "14px",
                  margin: "4px 0 0 0",
                }}
              >
                Click on a date to view and book available slots
              </p>
            </div>
            <Link href="/payment">
              <button>💳 Proceed to Payment</button>
            </Link>
          </div>

          <MonthlyCalendar
            slots={slots.map((s) => ({ ...s, id: String(s.id) }))}
            onSlotClick={(slot) =>
              handleBook({ ...slot, id: Number(slot.id), tutor: selectedTutor })
            }
            editable={false}
          />
        </section>
      )}
    </div>
  );
}
