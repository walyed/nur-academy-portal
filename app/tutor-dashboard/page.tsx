"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { bookedSessions, tutorAvailability, TimeSlot } from '@/data/mockData';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import { MessageSquare, Calendar, Users } from 'lucide-react';

export default function TutorDashboardPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>(tutorAvailability);

  const toggleAvailability = (slot: TimeSlot) => {
    setSlots(prev => 
      prev.map(s => 
        s.id === slot.id ? { ...s, available: !s.available } : s
      )
    );
  };

  const mySession = bookedSessions.filter(s => s.tutorName === 'John Smith');
  const availableCount = slots.filter(s => s.available).length;
  const bookedCount = slots.filter(s => !s.available).length;

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[hsl(220_25%_20%)] mb-2">
          👨‍🏫 Tutor Dashboard
        </h2>
        <p className="text-[hsl(220_10%_50%)]">
          Welcome back, {user?.name || 'Tutor'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[hsl(145_60%_96%)] border border-[hsl(145_60%_85%)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(145_60%_45%)] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[hsl(145_60%_30%)]">Available Slots</span>
          </div>
          <p className="text-3xl font-bold text-[hsl(145_60%_30%)]">{availableCount}</p>
        </div>
        
        <div className="bg-[hsl(0_65%_97%)] border border-[hsl(0_65%_88%)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(0_65%_55%)] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[hsl(0_65%_35%)]">Booked Slots</span>
          </div>
          <p className="text-3xl font-bold text-[hsl(0_65%_35%)]">{bookedCount}</p>
        </div>
        
        <div className="bg-[hsl(210_60%_97%)] border border-[hsl(210_60%_88%)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[hsl(210_60%_50%)] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-[hsl(210_60%_35%)]">Upcoming Sessions</span>
          </div>
          <p className="text-3xl font-bold text-[hsl(210_60%_35%)]">{mySession.filter(s => s.status === 'upcoming').length}</p>
        </div>
      </div>

      {/* Calendar Section */}
      <section className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[hsl(220_25%_20%)] mb-1">📅 My Availability</h3>
            <p className="text-sm text-[hsl(220_10%_50%)]">
              Click on dates to view and manage your time slots
            </p>
          </div>
        </div>
        
        <MonthlyCalendar 
          slots={slots} 
          onSlotClick={toggleAvailability}
          editable={true}
        />
      </section>

      {/* Booked Sessions Table */}
      <section className="card mb-6">
        <h3 className="text-lg font-semibold text-[hsl(220_25%_20%)] mb-4">📋 Booked Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">Student</th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">Date</th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">Time</th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">Subject</th>
                <th className="text-left text-sm font-medium text-[hsl(220_10%_50%)] pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mySession.map((session) => (
                <tr key={session.id} className="border-t border-[hsl(220_15%_92%)]">
                  <td className="py-3 font-medium text-[hsl(220_25%_25%)]">{session.studentName}</td>
                  <td className="py-3 text-[hsl(220_10%_40%)]">{session.date}</td>
                  <td className="py-3 text-[hsl(220_10%_40%)]">{session.time}</td>
                  <td className="py-3 text-[hsl(220_10%_40%)]">{session.subject}</td>
                  <td className="py-3">
                    <span className={`
                      inline-flex px-3 py-1 rounded-full text-xs font-medium
                      ${session.status === 'upcoming' 
                        ? 'bg-[hsl(210_60%_95%)] text-[hsl(210_60%_40%)]' 
                        : session.status === 'completed'
                        ? 'bg-[hsl(145_60%_94%)] text-[hsl(145_60%_30%)]'
                        : 'bg-[hsl(220_15%_92%)] text-[hsl(220_10%_50%)]'
                      }
                    `}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Chat Link */}
      <Link href="/chat">
        <button className="flex items-center gap-2 bg-[hsl(210_60%_50%)] text-white px-5 py-3 rounded-lg hover:bg-[hsl(210_60%_45%)] transition-colors">
          <MessageSquare className="w-5 h-5" />
          Open Chat
        </button>
      </Link>
    </div>
  );
}
