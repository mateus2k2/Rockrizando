from app.config.db import db
from passlib.hash import bcrypt

class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100))
    username = db.Column(db.String(100))
    password = db.Column(db.String(100))
    birth_date = db.Column(db.Date) 
    profile_picture = db.Column(db.String(200))


    def __init__(self, email, password, birth_date, username):
        self.email = email
        self.password = password
        self.birth_date = birth_date
        self.username = username

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def set_password(self, password):
        self.password = bcrypt.hash(password)
        
    def set_profile_picture(self, profile_picture):
        self.profile_picture = profile_picture

    def check_password(self, password):
        return bcrypt.verify(password, self.password)

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

