from app.config.db import db

class ParticipantsModel(db.Model):
    __tablename__ = 'participants'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    party_id = db.Column(db.Integer, db.ForeignKey('party.id'))
    ticket_id = db.Column(db.Integer, db.ForeignKey('ticket.id'))

    user = db.relationship('UserModel')
    party = db.relationship('PartyModel')
    ticket = db.relationship('TicketModel')

    def __init__(self, user_id, party_id, ticket_id):
        self.user_id = user_id
        self.party_id = party_id
        self.ticket_id = ticket_id

    def json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'party_id': self.party_id,
            'ticket_id': self.ticket_id
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
