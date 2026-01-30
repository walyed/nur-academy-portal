"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import { MessageSquare, Calendar, Users } from "lucide-react";

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
  student_name: string;
  date: string;
  start_time: string;
  end_time: string;
  subject: string;
  status: string;
}

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlotDate, setNewSlotDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [slotMessage, setSlotMessage] = useState("");
  const [slotError, setSlotError] = useState("");

  useEffect(() => {
    Promise.all([api.getSlots(), api.getBookings()])
      .then(([slotsData, bookingsData]) => {
        setSlots(slotsData);
        setBookings(bookingsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async (slot: {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    available: boolean;
  }) => {
    try {
      await api.updateSlot(Number(slot.id), { available: !slot.available });
      setSlots((prev) =>
        prev.map((s) =>
          s.id === Number(slot.id) ? { ...s, available: !s.available } : s,
        ),
      );
    } catch (error) {
      console.error("Failed to update slot:", error);
    }
  };

  const addNewSlot = async () => {
    setSlotMessage("");
    setSlotError("");

    if (!newSlotDate) {
      setSlotError("Please select a date");
      return;
    }

    if (!startTime || !endTime) {
      setSlotError("Please select start and end times");
      return;
    }

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const isPM = hour >= 12;
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = isPM ? "PM" : "AM";
      return minutes === "00"
        ? `${displayHour}:00 ${period}`
        : `${displayHour}:${minutes} ${period}`;
    };

    const formattedStart = formatTime(startTime);
    const formattedEnd = formatTime(endTime);

    const startMinutes =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);
    const endMinutes =
      parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

    if (endMinutes <= startMinutes) {
      setSlotError("End time must be after start time");
      return;
    }

    try {
      const response = await api.createSlot({
        date: newSlotDate,
        start_time: formattedStart,
        end_time: formattedEnd,
      });

      setSlots((prev) => [...prev, response]);
      setSlotMessage("Slot added successfully");
      setNewSlotDate("");
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (error) {
      let message = "Failed to create slot";
      if (error instanceof Error) {
        message = error.message;
        // Check for permission errors
        if (message.includes("Only tutors") || message.includes("403") || message.includes("Forbidden")) {
          message = "❌ Permission denied. Please ensure you're logged in as a tutor. Try logging out and logging in again.";
        }
      }
      setSlotError(message);
      console.error("Create slot error:", error);
    }
  };

  const availableCount = slots.filter((s) => s.available).length;
  const bookedCount = slots.filter((s) => !s.available).length;
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-8 text-center">Loading...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[hsl(220_25%_20%)] mb-2">
          👨‍🏫 Tutor Dashboard
        </h2>
        <p className="text-[hsl(220_10%_50%)]">
          Welcome back, {user?.name || "Tutor"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[hsl(145_60%_96%)] border border-[hsl(145_60%_85%)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(145_60%_45%)] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[hsl(145_60%_30%)]">
              Available Slots
            </span>
          </div>
          <p className="text-3xl font-bold text-[hsl(145_60%_30%)]">
            {availableCount}
          </p>
        </div>

        <div className="bg-[hsl(0_65%_97%)] border border-[hsl(0_65%_88%)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(0_65%_55%)] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[hsl(0_65%_35%)]">
              Booked Slots
            </span>
          </div>
          <p className="text-3xl font-bold text-[hsl(0_65%_35%)]">
            {bookedCount}
          </p>
        </div>

        <div className="bg-[hsl(210_60%_97%)] border border-[hsl(210_60%_88%)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(210_60%_50%)] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[hsl(210_60%_35%)]">
              Upcoming Sessions
            </span>
          </div>
          <p className="text-3xl font-bold text-[hsl(210_60%_35%)]">
            {upcomingCount}
          </p>
        </div>
      </div>

      <section className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[hsl(220_25%_20%)] mb-1">
              📅 My Availability
            </h3>
            <p className="text-sm text-[hsl(220_10%_50%)]">
              Click on dates to view and manage your time slots
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap items-end">
          <div>
            <label className="block text-sm font-medium text-[hsl(220_10%_40%)] mb-1">
              Date
            </label>
            <input
              title="Select Date"
              type="date"
              value={newSlotDate}
              onChange={(e) => setNewSlotDate(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(220_10%_40%)] mb-1">
              From
            </label>
            <input
              title="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[hsl(220_10%_40%)] mb-1">
              To
            </label>
            <input
              title="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <button onClick={addNewSlot} className="px-4 py-2">
            Add Slots
          </button>
        </div>

        {slotMessage && (
          <div className="mb-4 p-3 rounded-lg bg-[hsl(145_60%_95%)] text-[hsl(145_60%_30%)]">
            {slotMessage}
          </div>
        )}
        {slotError && (
          <div className="mb-4 p-3 rounded-lg bg-[hsl(0_70%_95%)] text-[hsl(0_70%_40%)]">
            {slotError}
          </div>
        )}

        <MonthlyCalendar
          slots={slots.map((s) => ({ ...s, id: String(s.id) }))}
          onSlotClick={toggleAvailability}
          editable={true}
        />
      </section>

      <section className="card mb-6">
        <h3 className="text-lg font-semibold text-[hsl(220_25%_20%)] mb-4">
          📋 Booked Sessions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">
                  Student
                </th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">
                  Date
                </th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">
                  Time
                </th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">
                  Subject
                </th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-[hsl(220_15%_92%)]"
                >
                  <td className="py-3 font-medium text-[hsl(220_25%_25%)]">
                    {session.student_name}
                  </td>
                  <td className="py-3 text-[hsl(220_10%_40%)]">
                    {session.date}
                  </td>
                  <td className="py-3 text-[hsl(220_10%_40%)]">
                    {session.start_time} - {session.end_time}
                  </td>
                  <td className="py-3 text-[hsl(220_10%_40%)]">
                    {session.subject}
                  </td>
                  <td className="py-3">
                    <span
                      className={`
                      inline-flex px-3 py-1 rounded-full text-xs font-medium
                      ${
                        session.status === "upcoming"
                          ? "bg-[hsl(210_60%_95%)] text-[hsl(210_60%_40%)]"
                          : session.status === "completed"
                            ? "bg-[hsl(145_60%_94%)] text-[hsl(145_60%_30%)]"
                            : "bg-[hsl(220_15%_92%)] text-[hsl(220_10%_50%)]"
                      }
                    `}
                    >
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-[hsl(220_10%_50%)]"
                  >
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Link href="/chat">
        <button className="flex items-center gap-2 bg-[hsl(210_60%_50%)] text-white px-5 py-3 rounded-lg hover:bg-[hsl(210_60%_45%)] transition-colors">
          <MessageSquare className="w-5 h-5" />
          Open Chat
        </button>
      </Link>
    </div>
  );
}
