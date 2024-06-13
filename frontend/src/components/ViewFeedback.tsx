// src/components/ViewFeedback.tsx
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
}

interface ViewFeedbackProps {
  slots: Slot[];
}

const ViewFeedback: React.FC<ViewFeedbackProps> = ({ slots }) => {
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

  return (
    <div>
      <h2>Past Feedback</h2>
      <ul>
        {slots.map(slot => (
          slot.satisfaction !== null && (
            <li key={slot.id}>
              {formatDate(slot.startTime)} - {formatDate(slot.endTime)}<br />
              Booked by: {slot.bookedBy}<br />
              Satisfaction: {slot.satisfaction}<br />
              Notes: {slot.notes}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default ViewFeedback;
