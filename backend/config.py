import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://stepfuluser:password@localhost/stepful')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
