// RecordFeedback.tsx

import React, { useState } from 'react';
import axios from 'axios';

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
  shareWithStudent?: boolean;
}

interface RecordFeedbackProps {
  slot: Slot;
  onSubmit: (updatedSlot: Slot) => void;
}

const RecordFeedback: React.FC<RecordFeedbackProps> = ({ slot, onSubmit }) => {
  const [satisfaction, setSatisfaction] = useState(slot.satisfaction || 3);
  const [notes, setNotes] = useState(slot.notes || '');
  const [coachPhone, setCoachPhone] = useState(slot.coachPhone || '123-456-7890');
  const [phoneError, setPhoneError] = useState('');
  const [shareWithStudent, setShareWithStudent] = useState(slot.shareWithStudent || false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (notes.trim() === '') {
      alert('Notes cannot be empty.');
      return;
    }
    const updatedSlot = { ...slot, satisfaction, notes, feedbackSubmitted: true, shareWithStudent };

    try {
      const response = await axios.post(`http://localhost:5001/api/slots/${slot.id}/feedback`, {
        satisfaction,
        notes,
        shareWithStudent
      });
      onSubmit(response.data);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleCoachPhoneUpdate = async () => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(coachPhone)) {
      setPhoneError('Phone number must be in the format XXX-XXX-XXXX.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5001/api/slots/${slot.id}/update-coach-phone`, {
        coachPhone,
      });
      onSubmit(response.data);
      setPhoneError(''); // Clear the error message
    } catch (error) {
      console.error('Error updating coach phone:', error);
    }
  };

  return (
    <div>
      <h2>Record Feedback for Slot</h2>
      {slot.bookedBy ? (
        <>
          <p><strong>Booked by:</strong> {slot.bookedBy}</p>
          <p><strong>Student's phone:</strong> {slot.studentPhone}</p>
          <label>
            Coach's Phone:
            <input
              type="tel"
              value={coachPhone}
              onChange={(e) => setCoachPhone(e.target.value)}
              onBlur={handleCoachPhoneUpdate}  // Update phone on blur
            />
          </label>
          {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Satisfaction (1-5):
              <input
                type="number"
                value={satisfaction}
                onChange={(e) => setSatisfaction(Number(e.target.value))}
                min="1"
                max="5"
              />
            </label>
            <label>
              Notes:
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={shareWithStudent}
                onChange={(e) => setShareWithStudent(e.target.checked)}
              />
              <label>Share with student</label>
            </div>
            <button type="submit">Submit Feedback</button>
          </form>
        </>
      ) : (
        <p>The slot must be booked by a student before you can submit feedback.</p>
      )}
    </div>
  );
};

export default RecordFeedback;
