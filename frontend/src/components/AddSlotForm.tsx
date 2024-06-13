import React, { useState } from 'react';
import axios from 'axios';

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
}

interface AddSlotFormProps {
  onSubmit: (slot: Slot) => void;
  existingSlots: Slot[];
}

const AddSlotForm: React.FC<AddSlotFormProps> = ({ onSubmit, existingSlots }) => {
  const [startTime, setStartTime] = useState('');
  const [conflictError, setConflictError] = useState('');

  const hasConflict = (newSlot: Slot) => {
    return existingSlots.some((slot) => {
      const existingStart = new Date(slot.startTime).getTime();
      const existingEnd = new Date(slot.endTime).getTime();
      const newStart = new Date(newSlot.startTime).getTime();
      const newEnd = new Date(newSlot.endTime).getTime();

      return (
        (newStart < existingEnd && newStart >= existingStart) || 
        (newEnd > existingStart && newEnd <= existingEnd) ||    
        (newStart <= existingStart && newEnd >= existingEnd)    
      );
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    const endTime = endDate.toISOString();

    const newSlot: Slot = {
      id: Date.now(),
      startTime: startDate.toISOString(),
      endTime,
    };

    if (hasConflict(newSlot)) {
      setConflictError('Slot cannot be scheduled due to a conflict with an existing slot.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/slots', {
        startTime: newSlot.startTime,
      });
      if (response.status === 201) {
        onSubmit(response.data);
      } else {
        console.error('Error adding slot:', response.data);
      }
      setStartTime('');
      setConflictError('');
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  };

  return (
    <div>
      <h2>Add Slot</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <br />
        {conflictError && <p style={{ color: 'red' }}>{conflictError}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSlotForm;
