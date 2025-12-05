import { addMinutes, format, parse, isBefore, isEqual, startOfDay } from "date-fns";

export const SLOT_DURATION = 30; // minutes

export const generateTimeSlots = (
  startTime: string, // HH:mm
  endTime: string,   // HH:mm
  date: Date,
  bookedSlots: string[] = [] // Array of HH:mm strings
): string[] => {
  const slots: string[] = [];
  const today = new Date();
  const isToday = startOfDay(date).getTime() === startOfDay(today).getTime();

  let current = parse(startTime, "HH:mm", date);
  const end = parse(endTime, "HH:mm", date);

  while (isBefore(current, end)) {
    const timeString = format(current, "HH:mm");
    
    // Check if slot is in the past (if date is today)
    let isPast = false;
    if (isToday) {
      const now = new Date();
      if (isBefore(current, now)) {
        isPast = true;
      }
    }

    if (!bookedSlots.includes(timeString) && !isPast) {
      slots.push(timeString);
    }

    current = addMinutes(current, SLOT_DURATION);
  }

  return slots;
};
