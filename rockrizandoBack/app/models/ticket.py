from app.config.db import db

class TicketModel(db.Model):
    __tablename__ = 'ticket'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Integer)
    description = db.Column(db.String())
    party_id = db.Column(db.Integer, db.ForeignKey('party.id'))  

    party = db.relationship('PartyModel', backref='tickets') 

    def __init__(self, name, price, description, party_id):
        self.name = name
        self.price = price
        self.description = description
        self.party_id = party_id

    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'party_id': self.party_id
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
