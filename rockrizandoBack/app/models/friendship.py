from app.config.db import db
from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship

class FriendshipModel(db.Model):
    __tablename__ = 'friendships'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    friend_id = db.Column(db.Integer, ForeignKey('users.id'))
    status = db.Column(Enum('pending', 'accepted', 'rejected', name='friendship_status'))

    user = relationship('UserModel', foreign_keys=[user_id])
    friend = relationship('UserModel', foreign_keys=[friend_id])

    def __init__(self, user_id, friend_id, status='pending'):
        self.user_id = user_id
        self.friend_id = friend_id
        self.status = status

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_ids(cls, user_id, friend_id):
        return cls.query.filter_by(user_id=user_id, friend_id=friend_id).first()

    @classmethod
    def find_pending_friendships(cls, user_id):
        return cls.query.filter_by(user_id=user_id, status='pending').all()

    @classmethod
    def find_accepted_friendships(cls, user_id):
        return cls.query.filter_by(user_id=user_id, status='accepted').all()

    @classmethod
    def find_friendship_requests(cls, user_id):
        return cls.query.filter_by(friend_id=user_id, status='pending').all()

    def accept_friendship(self):
        self.status = 'accepted'
        db.session.commit()

    def reject_friendship(self):
        self.status = 'rejected'
        db.session.commit()

    def cancel_friendship_request(self):
        self.status = 'rejected'
        db.session.commit()

    def unfriend(self):
        db.session.delete(self)
        db.session.commit()
