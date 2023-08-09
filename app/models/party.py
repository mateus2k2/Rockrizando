from app.config.db import db


class PartyModel(db.Model):
    __tablename__ = 'party'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.String(100))
    party_date = db.Column(db.Date)
    location = db.Column(db.String(50))
    party_picture = db.Column(db.String(200))
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # New field

    creator = db.relationship('UserModel')  # New relationship

    def __init__(self, name, description, party_date, location, creator_id):
        self.name = name
        self.description = description
        self.party_date = party_date
        self.location = location
        self.creator_id = creator_id

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'party_date': self.party_date.isoformat(),  # Convert date to ISO format
            'location': self.location,
            'party_picture': self.party_picture,
            'creator_id': self.creator_id
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def set_party_picture(self, party_picture):
        self.party_picture = party_picture

    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()
    
    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()