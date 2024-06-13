// StudentView.tsx

import React, { useState, useEffect } from 'react';
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

interface Student {
  id: number;
  name: string;
  phone: string;
}

interface StudentViewProps {
  slots: Slot[];
  onBookSlot: (updatedSlot: Slot) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  currentStudent: Student | null;
  setCurrentStudent: React.Dispatch<React.SetStateAction<Student | null>>;
  handleCreateStudent: (name: string, phone: string) => Promise<void>;
  handleDeleteStudent: (studentId: number) => Promise<void>;
  setSelectedSlot: React.Dispatch<React.SetStateAction<Slot | null>>;
  handleBookSelectedSlot: (slot: Slot) => Promise<void>;
}

const StudentView: React.FC<StudentViewProps> = ({
  slots,
  onBookSlot,
  students,
  setStudents,
  currentStudent,
  setCurrentStudent,
  handleCreateStudent,
  handleDeleteStudent,
  setSelectedSlot,
  handleBookSelectedSlot,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentSlots, setStudentSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlotState] = useState<Slot | null>(null);

  const handleDelete = async (studentId: number) => {
    try {
      await handleDeleteStudent(studentId);
      setCurrentStudent(null);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  useEffect(() => {
    if (currentStudent) {
      const fetchStudentSlots = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/slots/student/${currentStudent.id}`);
          setStudentSlots(response.data);
        } catch (error) {
          console.error('Error fetching student slots:', error);
        }
      };
      fetchStudentSlots();
    }
  }, [currentStudent]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const handleAddStudent = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/students', {
        name: studentName,
        phone: studentPhone,
      });
      setStudents([...students, response.data]);
      setStudentName('');
      setStudentPhone('');
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleBookSlotClick = (slot: Slot) => {
    setSelectedSlotState(slot);
    handleBookSelectedSlot(slot);
  };

  const handleBook = async (slot: Slot) => {
    if (!currentStudent) {
      alert('Please select a student.');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:5001/api/slots/${slot.id}/book`, {
        bookedBy: currentStudent.name,
        studentPhone: currentStudent.phone,
        studentId: currentStudent.id,
      });
      onBookSlot(response.data);
      setSelectedSlotState(null); // Clear the selected slot
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };

  return (
    <div className="student-view">
      <div className="student-column">
        <h2>Students</h2>
        <select onChange={(e) => setCurrentStudent(students.find(student => student.id === parseInt(e.target.value)) || null)}>
          <option value="">Select a student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <div className="add-student-container">
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Student Name"
          />
          <input
            type="tel"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            placeholder="Student Phone"
          />
          <button onClick={handleAddStudent}>Add Student</button>
        </div>
        {currentStudent && (
          <button onClick={() => handleDelete(currentStudent.id)}>Delete Student</button>
        )}
        <h2>Available Slots</h2>
        <ul>
          {slots.filter(slot => !slot.bookedBy).map(slot => (
            <li key={slot.id} className={`${slot.bookedBy ? 'booked' : ''} ${slot.feedbackSubmitted ? 'feedback-submitted' : ''}`}>
              {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
              {!slot.bookedBy && <button onClick={() => handleBookSlotClick(slot)}>Book</button>}
            </li>
          ))}
        </ul>
      </div>
      <div className="student-column">
        {selectedSlot ? (
          <div>
            <h2>Slot Details</h2>
            {selectedSlot.bookedBy ? (
              <>
                <p><strong>Booked by:</strong> {selectedSlot.bookedBy}</p>
                <p><strong>Student's phone:</strong> {selectedSlot.studentPhone}</p>
                <p><strong>Coach's phone:</strong> {selectedSlot.coachPhone}</p>
                {selectedSlot.shareWithStudent && (
                  <>
                    <p><strong>Coach's Feedback:</strong> {selectedSlot.notes}</p>
                    <p><strong>Satisfaction:</strong> {selectedSlot.satisfaction}</p>
                  </>
                )}
              </>
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleBook(selectedSlot);
              }}>
                <label>
                  Your Name:
                  <input
                    type="text"
                    value={currentStudent?.name || ''}
                    readOnly
                  />
                </label>
                <label>
                  Your Phone:
                  <input
                    type="tel"
                    value={currentStudent?.phone || ''}
                    readOnly
                  />
                </label>
                <button type="submit">Confirm Booking</button>
              </form>
            )}
          </div>
        ) : (
          <p>Select a slot to view details or book.</p>
        )}
      </div>
    </div>
  );
};

export default StudentView;
