# Stepful Scheduling

Welcome to Stepful Scheduling! This project aims to manage 1-on-1 coaching calls between students and coaches efficiently. Below is the detailed information about the setup, functionalities, and features of the website.

## Technologies Used

- **Frontend:** React, TypeScript
- **Backend:** Flask
- **Database:** PostgreSQL

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your system:

- Node.js
- Python 3.9+
- PostgreSQL
- npm (Node Package Manager)
- pip (Python Package Installer)

### Prerequisites

- Node.js and npm
- Python 3.x
- PostgreSQL
- Homebrew (for MacOS users)

### Backend Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/vincentkhdo/stepful-scheduling.git
    cd stepful-scheduling
    ```

2. **Set up a virtual environment and activate it**:
    ```sh
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install backend dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

4. **Start PostgreSQL service**:
    ```sh
    brew services start postgresql@14
    ```
    If PostgreSQL is already running, stop it first and then start:
    ```sh
    brew services stop postgresql@14
    brew services start postgresql@14
    ```

5. **Run database migrations**:
    ```sh
    flask db upgrade
    ```

6. **Start the backend server**:
    ```sh
    python run.py
    ```
    The backend should now be running at `http://127.0.0.1:5001/` and should display "Welcome to Stepful!".

### Frontend Setup

1. **Navigate to the frontend directory**:
    ```sh
    cd frontend
    ```

2. **Install frontend dependencies**:
    ```sh
    npm install
    ```

3. **Start the frontend server**:
    ```sh
    npm start
    ```

## Usage

- Navigate to `http://localhost:3000` to access the application.
- Switch between coach and student views using the provided buttons.
- Coaches can add availability slots and record feedback.
- Students can book slots and view their bookings.

## Project Structure

### Backend

- `app.py`: Initializes the Flask app and sets up configurations.
- `models.py`: Defines database models for Slot and Student.
- `routes.py`: Contains API routes for managing slots and students.
- `migrations/`: Contains database migration files.

### Frontend

- `src/components/`: Contains React components for the application.
  - `AddSlotForm.tsx`: Form for coaches to add availability slots.
  - `SlotCalendar.tsx`: Displays a calendar of slots for coaches.
  - `StudentView.tsx`: Displays available slots and bookings for students.
  - `RecordFeedback.tsx`: Form for coaches to record feedback after a call.
- `src/App.tsx`: Main application component.

## Site Functions and Features

### Coach Features

1. **Add Slots:**
   - Coaches can add slots of availability to their calendars. These slots are always 2 hours long and each slot can be booked by exactly one student.
   - Slots can be added using the "Add Slot" form in the coach view.

2. **View Upcoming Slots:**
   - Coaches can view their own upcoming slots in the calendar.
   - They can click on any slot to view its details.

3. **Record Feedback:**
   - After completing a call, coaches can record the student's satisfaction (an integer between 1-5) and write free-form notes.
   - Coaches can also choose to share their feedback with the student by checking the "Share with student" checkbox.

4. **Review Past Scores and Notes:**
   - Coaches can review their past scores and notes for all their calls in the slot details.

### Student Features

1. **Book Slots:**
   - Students can book upcoming, available slots for any coach.
   - Slots that are already booked by another student will not be available for booking.

2. **View Booked Slots:**
   - Students can view their booked slots in the "My Slots" section.

3. **View Coach and Student Details:**
   - Once a slot is booked, both the student and coach can view each other’s phone numbers.

4. **View Feedback:**
   - If the coach shares feedback, students can view the feedback details in the slot details.

### Additional Features

1. **Toggle Between Views:**
   - Users can easily switch between coach and student views using the "Switch to Student View/Coach View" button in the header.

2. **Manage Students:**
   - In the student view, users can add new students and delete existing student profiles.

3. **Clear All Slots:**
   - Coaches can clear all slots using the "Clear All Slots" button in the header.

4. **Chronological Sort:**
   - Events will be listed in chronological order based on date, regardless of when they were created.

### Website Screenshots

![Coach View](screenshots/coachview.png)
![Student View](screenshots/studentview.png)