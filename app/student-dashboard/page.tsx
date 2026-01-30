"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  start_time: string;
  end_time: string;
  available: boolean;
}

interface Booking {
  id: number;
  tutor_name: string;
  subject: string;
  date: string;
  time: string;
  amount: number;
  paid: boolean;
  status: string;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<number | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTutors(), api.getBookings()])
      .then(([tutorsData, bookingsData]) => {
        setTutors(tutorsData);
        setBookings(bookingsData);
      })
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
      const response = await api.createBooking(slot.id);
      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, available: false } : s))
      );
      setBookingConfirmed(
        `Booking created! Redirecting to payment...`
      );
      // Refresh bookings to show the new booking
      api.getBookings().then(setBookings).catch(console.error);
      // Redirect to payment page after a brief delay
      setTimeout(() => {
        router.push("/payment");
      }, 1500);
    } catch (error) {
      console.error("Booking failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to book this slot. It may have already been booked.";
      alert(errorMessage);
      // Refresh slots to get updated availability
      if (selectedTutor) {
        api.getSlots(selectedTutor).then(setSlots).catch(console.error);
      }
    }
  };

  const handleChatClick = async (tutorId: number) => {
    try {
      await api.sendMessage(
        tutorId,
        "Hello! I'm interested in booking a session."
      );
      router.push(`/chat?contact=${tutorId}`);
    } catch (error) {
      console.error("Failed to initiate chat:", error);
      router.push(`/chat?contact=${tutorId}`);
    }
  };

  const selectedTutorData = tutors.find((t) => t.id === selectedTutor);
  
  // Filter upcoming classes (paid bookings with upcoming status)
  const upcomingClasses = bookings.filter(
    (b) => b.paid && b.status === "upcoming"
  );
  
  // Filter unpaid bookings
  const unpaidBookings = bookings.filter((b) => !b.paid);

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

      {/* Unpaid Bookings Alert */}
      {unpaidBookings.length > 0 && (
        <section
          className="card"
          style={{
            marginBottom: "24px",
            background: "hsl(45 100% 96%)",
            border: "1px solid hsl(45 80% 70%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "8px", color: "hsl(45 80% 30%)" }}>
                ⚠️ Pending Payments
              </h3>
              <p style={{ color: "hsl(45 60% 35%)", margin: 0 }}>
                You have {unpaidBookings.length} booking
                {unpaidBookings.length > 1 ? "s" : ""} awaiting payment.
              </p>
            </div>
            <button
              onClick={() => router.push("/payment")}
              style={{
                background: "hsl(45 80% 45%)",
                color: "white",
                padding: "10px 20px",
              }}
            >
              Pay Now
            </button>
          </div>
        </section>
      )}

      {/* Upcoming Classes Card */}
      <section className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>📚 My Upcoming Classes</h3>

        {upcomingClasses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "hsl(220 20% 98%)",
              borderRadius: "12px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
            <p style={{ color: "hsl(220 10% 50%)", margin: 0 }}>
              No upcoming classes scheduled.
            </p>
            <p
              style={{ color: "hsl(220 10% 60%)", margin: "8px 0 0 0", fontSize: "14px" }}
            >
              Book a session with a tutor below to get started!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {upcomingClasses.map((booking) => (
              <div
                key={booking.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "hsl(210 60% 97%)",
                  borderRadius: "12px",
                  border: "1px solid hsl(210 60% 90%)",
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
                      background: "hsl(210 60% 45%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      color: "white",
                    }}
                  >
                    {booking.tutor_name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {booking.subject} with {booking.tutor_name}
                    </div>
                    <div
                      style={{ fontSize: "14px", color: "hsl(220 10% 50%)" }}
                    >
                      📅 {booking.date} • ⏰ {booking.time}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      padding: "6px 12px",
                      background: "hsl(140 60% 90%)",
                      color: "hsl(140 60% 30%)",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    ✓ Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Available Tutors Section */}
      <section className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ marginBottom: "20px" }}>👨‍🏫 Available Tutors</h3>

        <div style={{ display: "grid", gap: "16px" }}>
          {tutors.map((tutor) => (
            <div key={tutor.id}>
              <div
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
                    <div
                      style={{ fontSize: "14px", color: "hsl(220 10% 50%)" }}
                    >
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
                    <div
                      style={{ fontSize: "12px", color: "hsl(220 10% 50%)" }}
                    >
                      per hour
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleChatClick(tutor.id)}
                      className="btn-secondary"
                      style={{ padding: "8px 14px", fontSize: "14px" }}
                    >
                      💬 Chat
                    </button>
                    <button
                      onClick={() =>
                        setSelectedTutor(
                          selectedTutor === tutor.id ? null : tutor.id
                        )
                      }
                      style={{ padding: "8px 14px", fontSize: "14px" }}
                    >
                      {selectedTutor === tutor.id ? "✕ Close" : "📅 View Slots"}
                    </button>
                  </div>
                </div>
              </div>

              {selectedTutor === tutor.id && selectedTutorData && (
                <div
                  className="card"
                  style={{
                    marginTop: "12px",
                    marginLeft: "64px",
                    background: "hsl(210 60% 99%)",
                  }}
                >
                  <h4 style={{ marginBottom: "12px", fontSize: "16px" }}>
                    📅 {selectedTutorData.name}&apos;s Availability
                  </h4>
                  <MonthlyCalendar
                    slots={slots.map((s) => ({ ...s, id: String(s.id) }))}
                    onSlotClick={(slot) =>
                      handleBook({
                        ...slot,
                        id: Number(slot.id),
                        tutor: selectedTutor,
                      })
                    }
                    editable={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
