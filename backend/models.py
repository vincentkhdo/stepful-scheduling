from .app import db

class Slot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    booked_by = db.Column(db.String(80), nullable=True)
    student_phone = db.Column(db.String(20), nullable=True)
    coach_phone = db.Column(db.String(20), nullable=True, default='123-456-7890')
    satisfaction = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    feedback_submitted = db.Column(db.Boolean, default=False)
    share_with_student = db.Column(db.Boolean, default=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=True)

    def __repr__(self):
        return f"<Slot {self.id}>"

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"<Student {self.id}>"
