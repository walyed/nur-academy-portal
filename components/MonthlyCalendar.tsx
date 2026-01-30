"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

interface MonthlyCalendarProps {
  slots: TimeSlot[];
  onSlotClick?: (slot: TimeSlot) => void;
  editable?: boolean;
}

export default function MonthlyCalendar({
  slots,
  onSlotClick,
  editable = false,
}: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getSlotsForDate = (date: Date): TimeSlot[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return slots.filter((slot) => slot.date === dateStr);
  };

  const getDateStatus = (
    date: Date,
  ): "available" | "booked" | "mixed" | "none" => {
    const dateSlots = getSlotsForDate(date);
    if (dateSlots.length === 0) return "none";

    const availableCount = dateSlots.filter((s) => s.available).length;
    const bookedCount = dateSlots.filter((s) => !s.available).length;

    if (availableCount > 0 && bookedCount > 0) return "mixed";
    if (availableCount > 0) return "available";
    return "booked";
  };

  const selectedDateSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            title="Previous Month"
            className="p-2 rounded-lg hover:bg-[hsl(220_15%_95%)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[hsl(220_10%_40%)]" />
          </button>
          <h3 className="text-xl font-semibold text-[hsl(220_25%_20%)]">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            title="Next Month"
            className="p-2 rounded-lg hover:bg-[hsl(220_15%_95%)] transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[hsl(220_10%_40%)]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((weekDay) => (
            <div
              key={weekDay}
              className="text-center text-sm font-medium text-[hsl(220_10%_50%)] py-2"
            >
              {weekDay}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((dayDate, idx) => {
            const status = getDateStatus(dayDate);
            const isCurrentMonth = isSameMonth(dayDate, currentMonth);
            const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
            const isToday = isSameDay(dayDate, new Date());
            const hasSlots = status !== "none";

            const getBackgroundColor = () => {
              if (!isCurrentMonth || !hasSlots) return "bg-white";
              if (isSelected) return "ring-2 ring-[hsl(210_60%_50%)]";
              if (status === "available")
                return "bg-[hsl(145_60%_88%)] hover:bg-[hsl(145_60%_82%)]";
              if (status === "booked")
                return "bg-[hsl(0_65%_90%)] hover:bg-[hsl(0_65%_85%)]";
              if (status === "mixed")
                return "bg-gradient-to-br from-[hsl(145_60%_88%)] to-[hsl(0_65%_90%)] hover:from-[hsl(145_60%_82%)] hover:to-[hsl(0_65%_85%)]";
              return "bg-white";
            };

            return (
              <button
                key={idx}
                onClick={() => hasSlots && setSelectedDate(dayDate)}
                disabled={!hasSlots}
                className={`
                  relative aspect-square p-1 rounded-lg transition-all duration-200
                  flex flex-col items-center justify-center border
                  ${!isCurrentMonth ? "opacity-30 border-transparent" : "border-[hsl(220_15%_90%)]"}
                  ${getBackgroundColor()}
                  ${hasSlots ? "cursor-pointer" : "cursor-default"}
                  ${isToday ? "ring-2 ring-[hsl(210_60%_60%)] ring-offset-1" : ""}
                `}
              >
                <span
                  className={`
                  text-sm font-semibold
                  ${status === "available" && isCurrentMonth ? "text-[hsl(145_60%_25%)]" : ""}
                  ${status === "booked" && isCurrentMonth ? "text-[hsl(0_65%_35%)]" : ""}
                  ${status === "mixed" && isCurrentMonth ? "text-[hsl(220_25%_25%)]" : ""}
                  ${!hasSlots || !isCurrentMonth ? "text-[hsl(220_10%_60%)]" : ""}
                `}
                >
                  {format(dayDate, "d")}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[hsl(220_15%_90%)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(145_60%_45%)]" />
            <span className="text-sm text-[hsl(220_10%_50%)]">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(0_65%_55%)]" />
            <span className="text-sm text-[hsl(220_10%_50%)]">Booked</span>
          </div>
        </div>
      </div>

      <div className="lg:w-72 bg-[hsl(220_20%_97%)] rounded-xl p-4">
        <h4 className="font-semibold text-[hsl(220_25%_20%)] mb-4">
          {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date"}
        </h4>

        {selectedDate ? (
          selectedDateSlots.length > 0 ? (
            <div className="space-y-2">
              {selectedDateSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`
                    p-3 rounded-lg flex items-center justify-between
                    ${
                      slot.available
                        ? "bg-[hsl(145_60%_94%)] border border-[hsl(145_60%_80%)]"
                        : "bg-[hsl(0_65%_95%)] border border-[hsl(0_65%_85%)]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-2 h-2 rounded-full
                      ${slot.available ? "bg-[hsl(145_60%_45%)]" : "bg-[hsl(0_65%_55%)]"}
                    `}
                    />
                    <span className="font-medium text-[hsl(220_25%_25%)]">
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </div>

                  {editable && onSlotClick && (
                    <>
                      {slot.available ? (
                        <button
                          onClick={() => onSlotClick(slot)}
                          className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors bg-[hsl(0_65%_55%)] text-white hover:bg-[hsl(0_65%_45%)]"
                        >
                          Block
                        </button>
                      ) : (
                        <span className="text-xs font-medium px-3 py-1.5 text-[hsl(0_65%_40%)]">
                          Booked
                        </span>
                      )}
                    </>
                  )}

                  {!editable && onSlotClick && slot.available && (
                    <button
                      onClick={() => onSlotClick(slot)}
                      className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors bg-[hsl(210_60%_50%)] text-white hover:bg-[hsl(210_60%_40%)]"
                    >
                      Book
                    </button>
                  )}

                  {!editable && !slot.available && (
                    <span className="text-xs font-medium px-2 py-1 rounded text-[hsl(0_65%_40%)]">
                      Booked
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[hsl(220_10%_50%)]">
              No slots for this date
            </p>
          )
        ) : (
          <p className="text-sm text-[hsl(220_10%_50%)]">
            Click on a date with colored dots to view time slots
          </p>
        )}
      </div>
    </div>
  );
}
