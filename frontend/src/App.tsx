// App.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddSlotForm from './components/AddSlotForm';
import SlotCalendar from './components/SlotCalendar';
import StudentView from './components/StudentView';
import RecordFeedback from './components/RecordFeedback';
import './App.css';

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

function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [isCoachView, setIsCoachView] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/slots');
        setSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchSlots();
    fetchStudents();
  }, []);

  const handleAddSlot = (newSlot: Slot) => {
    setSlots([...slots, newSlot]);
  };

  const handleBookSlot = (updatedSlot: Slot) => {
    setSlots(slots.map(slot => slot.id === updatedSlot.id ? updatedSlot : slot));
  };

  const handleFeedbackSubmit = (updatedSlot: Slot) => {
    const updatedSlots = slots.map(slot => slot.id === updatedSlot.id ? { ...updatedSlot, feedbackSubmitted: true } : slot);
    setSlots(updatedSlots);
    setSelectedSlot(null);
  };

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleClearSlots = async () => {
    try {
      await axios.post('http://localhost:5001/api/slots/clear');
      setSlots([]);
      setSelectedSlot(null); // Reset right column
    } catch (error) {
      console.error('Error clearing slots:', error);
    }
  };

  const handleCreateStudent = async (name: string, phone: string) => {
    try {
      const response = await axios.post('http://localhost:5001/api/students', { name, phone });
      setStudents([...students, response.data]);
      setCurrentStudent(response.data); // Set the new student as the current student
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await axios.delete(`http://localhost:5001/api/students/${studentId}`);
      setStudents(students.filter(student => student.id !== studentId));
      if (currentStudent?.id === studentId) {
        setCurrentStudent(null);
        setSelectedSlot(null); // Reset right column
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleBookSelectedSlot = async (slot: Slot) => {
    if (!currentStudent) {
      alert('Please select a student.');
      return;
    }
    try {
      console.log('Booking slot:', slot); // Debugging line
      const response = await axios.post(`http://localhost:5001/api/slots/${slot.id}/book`, {
        bookedBy: currentStudent.name,
        studentPhone: currentStudent.phone,
        studentId: currentStudent.id,
      });
      handleBookSlot(response.data);
      setSelectedSlot(null); // Clear the selected slot
    } catch (error) {
      console.error('Error booking slot:', error);
    }
  };

  const handleViewSwitch = () => {
    setIsCoachView(!isCoachView);
    if (!isCoachView) {
      setCurrentStudent(null);
      setSelectedSlot(null); // Reset right column when switching to student view
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stepful Scheduling</h1>
        <button className="header-button" onClick={handleViewSwitch}>
          Switch to {isCoachView ? 'Student View' : 'Coach View'}
        </button>
        <button className="header-button" onClick={handleClearSlots}>Clear All Slots</button>
      </header>
      <div className="content">
        {isCoachView ? (
          <>
            <div className="column">
              <AddSlotForm onSubmit={handleAddSlot} existingSlots={slots} />
              <SlotCalendar slots={slots} onEdit={handleEditSlot} />
            </div>
            <div className="column">
              {selectedSlot ? (
                <RecordFeedback key={selectedSlot.id} slot={selectedSlot} onSubmit={handleFeedbackSubmit} />
              ) : (
                <p>Select a slot to view details and add or edit feedback.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="column">
              <StudentView
                slots={slots}
                onBookSlot={handleBookSlot}
                students={students}
                setStudents={setStudents}
                currentStudent={currentStudent}
                setCurrentStudent={setCurrentStudent}
                handleCreateStudent={handleCreateStudent}
                handleDeleteStudent={handleDeleteStudent}
                setSelectedSlot={setSelectedSlot}
                handleBookSelectedSlot={handleBookSelectedSlot}
              />
            </div>
            <div className="column">
              {currentStudent ? (
                <div>
                  <h2>{currentStudent.name}'s Slots</h2>
                  <ul>
                    {slots
                      .filter(slot => slot.bookedBy === currentStudent.name)
                      .map(slot => (
                        <li key={slot.id} className={`${slot.bookedBy ? 'booked' : ''} ${slot.feedbackSubmitted ? 'feedback-submitted' : ''}`}>
                          {`${slot.startTime} - ${slot.endTime}`}
                          <button onClick={() => setSelectedSlot(slot)}>View Details</button>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <p>Select a student to view their slots.</p>
              )}
              {selectedSlot && (
                <div>
                  <h2>Slot Details</h2>
                  <p><strong>Start Time:</strong> {selectedSlot.startTime}</p>
                  <p><strong>End Time:</strong> {selectedSlot.endTime}</p>
                  {selectedSlot.bookedBy && (
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
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
