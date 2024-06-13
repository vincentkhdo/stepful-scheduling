# backend/app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)  # Enable CORS
    db.init_app(app)
    
    with app.app_context():
        from .models import Slot  # Import models here after initializing the db
        from .routes import routes  # Import routes here
        app.register_blueprint(routes)
        
    return app
