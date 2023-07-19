from flask import jsonify, request
from app.util.validators import string_to_date
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from app.models.party import PartyModel
from app.models.user import UserModel
from app.models.ticket import TicketModel
from app.models.purchases import PurchasesModel
# from app.util.logz import create_logger
from sqlalchemy import func
from app.config.db import db
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from werkzeug.datastructures import FileStorage
import json

class NewPartyData(Resource):
    def __init__(self):
        pass

    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True, help='Not Blank')
    parser.add_argument('description', type=str, required=True, help='Not Blank')
    parser.add_argument('party_date', type=str, required=True, help='Not Blank')
    parser.add_argument('location', type=str, required=True, help='Not Blank')
    parser.add_argument('ticket_type', type=dict, action='append', required=True, help='Not Blank')

    @jwt_required()
    def post(self):
        data = NewPartyData.parser.parse_args()
        
        name = data['name']
        description = data['description']
        party_date_str = data['party_date']
        location = data['location']
        ticket_types = data['ticket_type']
        party_date = None
        created_id = get_jwt_identity()

        try:
            party_date = datetime.strptime(party_date_str, '%d-%m-%Y')
        except ValueError:
            return {'message': 'Invalid Party Date'}, 400

        party = PartyModel(name=name, description=description, party_date=party_date, location=location, creator_id=created_id['user'])
        party.save_to_db()

        for ticket_type in ticket_types:
            ticket = TicketModel(party_id=party.id, name=ticket_type["name"], price=float(ticket_type["price"]), description=ticket_type["description"])
            ticket.save_to_db()

        return {'message': 'party has been created successfully.'}, 201


class NewPartyPicture(Resource):
    
    def __init__(self):
        pass

    parser = reqparse.RequestParser()  
    parser.add_argument('name', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('party_picture', type=FileStorage, location='files', required=False)
    
    @jwt_required()
    def post(self):
        data = NewPartyPicture.parser.parse_args()
        name = data['name']
        party_picture = None



        party = PartyModel.find_by_name(name)
        print(name)
        print(data['party_picture'])
        if data['party_picture']:
            print("Achou a imagem")
            file = data['party_picture']
            if file.filename == '':
                return {'message': 'No file selected'}, 400
            
            file.filename = 'party_picture_' + str(party.id) + '.jpg'
            filename = secure_filename(file.filename)
            file_path = os.path.join('./app/files/party', filename)
            file.save(file_path)
            party_picture = file_path
            print(party_picture)
        
        PartyModel.set_party_picture(party, party_picture)
        party.save_to_db()

        return {'message': 'party has been created successfully.'}, 201



class PartiesData(Resource):

    def get(self):
        parties = PartyModel.query.all()
        party_data = []

        for party in parties:
            party_tickets = []
            for ticket in party.tickets:
                party_tickets.append({
                    'id': ticket.id,
                    'name': ticket.name,
                    'price': ticket.price,
                    'description': ticket.description
                })

            party_data.append({
                'id': party.id,
                'name': party.name,
                'description': party.description,
                'party_date': party.party_date.isoformat(),
                'location': party.location,
                'party_picture': party.party_picture,
                'tickets': party_tickets
            })

        return party_data, 200
    
class PartyData(Resource):

    def get(self, partyID):
        party = PartyModel.find_by_id(partyID)
        party_tickets = []
        if party:
            for ticket in party.tickets:
                party_tickets.append({
                    'id': ticket.id,
                    'name': ticket.name,
                    'price': ticket.price,
                    'description': ticket.description
                })

            party_data = {
                'id': party.id,
                'name': party.name,
                'description': party.description,
                'party_date': party.party_date.isoformat(),
                'location': party.location,
                'party_picture': party.party_picture,
                'tickets': party_tickets
            }

            return party_data, 200
        
        else:
            return {'message': 'Party not found'}, 404

class UserParties(Resource):

    @jwt_required()
    def get(self, userID):
        jwt = get_jwt_identity()
        
        if(jwt['user'] != userID):
            return {'message': 'Unauthorized'}, 401
        
        parties = PartyModel.query.filter_by(creator_id=jwt['user']).all()
        party_data = []
        
        for party in parties:
            party_tickets = []
            for ticket in party.tickets:
                party_tickets.append({
                    'id': ticket.id,
                    'name': ticket.name,
                    'price': ticket.price,
                    'description': ticket.description
                })

            party_data.append({
                'id': party.id,
                'name': party.name,
                'description': party.description,
                'party_date': party.party_date.isoformat(),
                'location': party.location,
                'party_picture': party.party_picture,
                'tickets': party_tickets
            })

        return party_data, 200

class UserParty(Resource):

    @jwt_required()
    def get(self, userID, partyID):
        jwt = get_jwt_identity()
        
        if(jwt['user'] != userID):
            return {'message': 'Unauthorized'}, 401
        
        party = PartyModel.query.filter_by(creator_id=jwt['user'], id=partyID).first()
        party_data = []
        
        party_tickets = []
        for ticket in party.tickets:
            party_tickets.append({
                'id': ticket.id,
                'name': ticket.name,
                'price': ticket.price,
                'description': ticket.description
            })

        party_data.append({
            'id': party.id,
            'name': party.name,
            'description': party.description,
            'party_date': party.party_date.isoformat(),
            'location': party.location,
            'party_picture': party.party_picture,
            'tickets': party_tickets
        })

        return party_data, 200      

class PartyBuy(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('userID', type=int, required=True, help='User ID is required')
    parser.add_argument('partyName', type=str, required=True, help='Party name is required')
    parser.add_argument('tickets', type=dict, required=True, help='Amount and tickets data is required', action="append")

    @jwt_required()
    def post(self, partyID):
        data = PartyBuy.parser.parse_args()

        user = UserModel.find_by_id(data['userID'])
        if not user:
            return {'message': 'User not found'}, 404

        party = PartyModel.find_by_id(partyID)
        if not party:
            return {'message': 'Party not found'}, 404

        participants_data = data['tickets']

        participants_list = []
        for participant_data in participants_data:
            
            ticket_id = participant_data.get('ticketID')
            participant_name = participant_data.get('name')
            participant_email = participant_data.get('email')

            ticket = TicketModel.find_by_id(ticket_id)
            if not ticket:
                participants_list.append( {'message': f'Ticket with ID {ticket_id} not found'} )

            else:
                participant = PurchasesModel(user_id=data['userID'], party_id=partyID, ticket_id=ticket_id, name = participant_name, email = participant_email)
                participant.save_to_db()

                participants_list.append(participant.json())

        return {'message': 'Purchase successful', 'participants': participants_list}, 201
