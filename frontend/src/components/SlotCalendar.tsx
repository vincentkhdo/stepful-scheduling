import React from 'react';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  bookedBy?: string;
  studentPhone?: string;
  coachPhone?: string;
  satisfaction?: number;
  notes?: string;
  feedbackSubmitted?: boolean;
}

interface SlotCalendarProps {
  slots: Slot[];
  onEdit: (slot: Slot) => void;
}

const SlotCalendar: React.FC<SlotCalendarProps> = ({ slots, onEdit }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const sortedSlots = slots.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div>
      <h2>Upcoming Slots</h2>
      <ul>
        {sortedSlots.map(slot => (
          <li key={slot.id} className={`${slot.bookedBy ? 'booked' : ''} ${slot.feedbackSubmitted ? 'feedback-submitted' : ''}`}>
            {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
            <button onClick={() => onEdit(slot)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SlotCalendar;
  