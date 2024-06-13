# backend/routes.py

from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from dateutil import parser
from .app import db
from .models import Slot, Student

routes = Blueprint('routes', __name__)

@routes.route('/api/slots', methods=['POST'])
def add_slot():
    data = request.json
    start_time_str = data.get('startTime')
    start_time = parser.isoparse(start_time_str)
    end_time = start_time + timedelta(hours=2)

    # Check for conflicts
    conflicts = Slot.query.filter(Slot.start_time < end_time, Slot.end_time > start_time).all()
    if conflicts:
        return jsonify({'error': 'Slot conflicts with an existing one'}), 400

    new_slot = Slot(
        start_time=start_time,
        end_time=end_time
    )
    db.session.add(new_slot)
    db.session.commit()
    return jsonify({
        'id': new_slot.id,
        'startTime': new_slot.start_time,
        'endTime': new_slot.end_time
    }), 201

@routes.route('/api/slots', methods=['GET'])
def get_slots():
    slots = Slot.query.all()
    return jsonify([{
        'id': slot.id,
        'startTime': slot.start_time,
        'endTime': slot.end_time,
        'bookedBy': slot.booked_by,
        'studentPhone': slot.student_phone,
        'coachPhone': slot.coach_phone,
        'satisfaction': slot.satisfaction,
        'notes': slot.notes,
        'feedbackSubmitted': slot.feedback_submitted,
        'shareWithStudent': slot.share_with_student
    } for slot in slots])

@routes.route('/api/slots/student/<int:student_id>', methods=['GET'])
def get_student_slots(student_id):
    slots = Slot.query.filter_by(student_id=student_id).all()
    return jsonify([{
        'id': slot.id,
        'startTime': slot.start_time,
        'endTime': slot.end_time,
        'bookedBy': slot.booked_by,
        'studentPhone': slot.student_phone,
        'coachPhone': slot.coach_phone,
        'satisfaction': slot.satisfaction,
        'notes': slot.notes,
        'feedbackSubmitted': slot.feedback_submitted,
        'shareWithStudent': slot.share_with_student
    } for slot in slots])

@routes.route('/api/slots/<int:slot_id>/book', methods=['POST'])
def book_slot(slot_id):
    data = request.json
    booked_by = data.get('bookedBy')
    student_phone = data.get('studentPhone')
    student_id = data.get('studentId')

    slot = Slot.query.get(slot_id)
    if slot:
        if slot.booked_by:
            return jsonify({'error': 'Slot already booked'}), 400
        slot.booked_by = booked_by
        slot.student_phone = student_phone
        slot.student_id = student_id
        db.session.commit()
        return jsonify({
            'id': slot.id,
            'startTime': slot.start_time,
            'endTime': slot.end_time,
            'bookedBy': slot.booked_by,
            'studentPhone': slot.student_phone,
            'coachPhone': slot.coach_phone,
            'satisfaction': slot.satisfaction,
            'notes': slot.notes,
            'feedbackSubmitted': slot.feedback_submitted
        }), 200

    return jsonify({'error': 'Slot not found'}), 404

@routes.route('/api/slots/<int:slot_id>/feedback', methods=['POST'])
def submit_feedback(slot_id):
    data = request.json
    satisfaction = data.get('satisfaction')
    notes = data.get('notes')
    share_with_student = data.get('shareWithStudent')

    slot = Slot.query.get(slot_id)
    if slot:
        slot.satisfaction = satisfaction
        slot.notes = notes
        slot.feedback_submitted = True
        slot.share_with_student = share_with_student
        db.session.commit()
        return jsonify({
            'id': slot.id,
            'startTime': slot.start_time,
            'endTime': slot.end_time,
            'bookedBy': slot.booked_by,
            'studentPhone': slot.student_phone,
            'coachPhone': slot.coach_phone,
            'satisfaction': slot.satisfaction,
            'notes': slot.notes,
            'feedbackSubmitted': slot.feedback_submitted,
            'shareWithStudent': slot.share_with_student
        }), 200


    return jsonify({'error': 'Slot not found'}), 404

@routes.route('/api/slots/clear', methods=['POST'])
def clear_slots():
    db.session.query(Slot).delete()
    db.session.commit()
    return jsonify({'message': 'All slots cleared'}), 200

@routes.route('/api/students', methods=['POST'])
def create_student():
    data = request.json
    name = data.get('name')
    phone = data.get('phone')

    new_student = Student(name=name, phone=phone)
    db.session.add(new_student)
    db.session.commit()
    return jsonify({
        'id': new_student.id,
        'name': new_student.name,
        'phone': new_student.phone
    }), 201

@routes.route('/api/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([{
        'id': student.id,
        'name': student.name,
        'phone': student.phone
    } for student in students])

@routes.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get(student_id)
    if student:
        db.session.delete(student)
        db.session.commit()
        return jsonify({'message': 'Student deleted'}), 200
    return jsonify({'error': 'Student not found'}), 404

@routes.route('/')
def home():
    return "Welcome to Stepful!"
