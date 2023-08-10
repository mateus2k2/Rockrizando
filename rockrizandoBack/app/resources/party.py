from itertools import count
from flask import jsonify, request
from app.util.validators import string_to_date
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from app.models.party import PartyModel
from app.models.user import UserModel
from app.models.ticket import TicketModel
from app.models.purchases import PurchasesModel
from werkzeug.datastructures import FileStorage
# from app.util.logz import create_logger
from sqlalchemy import func
from app.config.db import db
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from werkzeug.datastructures import FileStorage
import uuid
import json
import qrcode
from PIL import Image

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

        if jwt['user'] != userID:
            return {'message': 'Unauthorized'}, 401

        # Get participants of the party for the given partyID
        participants = PurchasesModel.query.filter_by(party_id=partyID).all() 

        # Return amount of tickets sold
        total_tickets_sold = len(participants)

        # Return amount of tickets sold per ticket type and total money made per ticket type
        ticket_type_count = []
        ticket_type_amounts = {}

        for participant in participants:
            ticket_id = participant.ticket_id
            ticket = TicketModel.find_by_id(ticket_id)
            if ticket:
                ticket_id = ticket.id
                ticket_type_amounts[ticket_id] = ticket_type_amounts.get(ticket_id, 0) + 1

        for ticket_id, ticket_count in ticket_type_amounts.items():
            ticket = TicketModel.query.filter_by(id=ticket_id).first()
            if ticket:
                ticket_price = ticket.price
                total_money_made = ticket_count * ticket_price
                ticket_type_count.append({
                    'ticket_id': ticket_id,
                    'tickets_sold': ticket_count,
                    'money_made': total_money_made
                })

        # Return amount of money made from tickets sold
        total_money_made = 0
        for participant in participants:
            ticket_id = participant.ticket_id
            ticket = TicketModel.find_by_id(ticket_id)
            if ticket:
                total_money_made += ticket.price


        return {
            'total_tickets_sold': total_tickets_sold,
            'ticket_type_count': ticket_type_count,
            'total_money_made': total_money_made
        }, 200        

class PartyBuy(Resource):

    parser = reqparse.RequestParser()
    parser.add_argument('userID', type=int, required=True, help='User ID is required')
    parser.add_argument('partyID', type=str, required=True, help='Party name is required')
    parser.add_argument('tickets', type=dict, required=True, help='Amount and tickets data is required', action="append")

    @jwt_required()
    def post(self, partyID):
        jwt = get_jwt_identity()
        print(jwt['user'])
        
        data = PartyBuy.parser.parse_args()

        user = UserModel.find_by_id(jwt['user'])
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
                generated_uuid = uuid.uuid4()
                participant = PurchasesModel(user_id=jwt['user'], party_id=partyID, ticket_id=ticket_id, name = participant_name, email = participant_email, uuid = generated_uuid)
                
                participant.save_to_db()

                img = qrcode.make('http://localhost:3000/tickets/' + str(generated_uuid))
                img.save('app/files/ticket/' + str(generated_uuid) + '.png')

                participants_list.append(participant.json())

        return {'message': 'Purchase successful', 'participants': participants_list}, 201

class UpdateParty(Resource):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help='Party name is required')
        parser.add_argument('description', type=str, required=True, help='Party description is required')
        parser.add_argument('party_date', type=str, required=True, help='Party date is required')
        parser.add_argument('location', type=str, required=True, help='Party location is required')
        #parser.add_argument('tickets', type=dict, required=True, help='Tickets data is required', action="append")
    
        @jwt_required()
        def patch(self, userID, partyID):
            data = UpdateParty.parser.parse_args()
    
            party = PartyModel.find_by_id(partyID)
            if not party:
                return {'message': 'Party not found'}, 404
    
            party.name = data['name']
            party.description = data['description']
            party.party_date = data['party_date']
            party.location = data['location']
    
            party.save_to_db()
    
            # tickets_data = data['tickets']
            # for ticket_data in tickets_data:
            #     ticket_id = ticket_data.get('id')
            #     ticket_name = ticket_data.get('name')
            #     ticket_price = ticket_data.get('price')
            #     ticket_description = ticket_data.get('description')
    
            #     ticket = TicketModel.find_by_id(ticket_id)
            #     if not ticket:
            #         return {'message': 'Ticket not found'}, 404
    
            #     ticket.name = ticket_name
            #     ticket.price = ticket_price
            #     ticket.description = ticket_description
    
            #     ticket.save_to_db()
    
            return {'message': 'Party updated successfully'}, 200

class PartyDelete(Resource):
        @jwt_required()
        def delete(self, userID, partyID):
            jwt = get_jwt_identity()
            
            print(jwt['user'])
            
            if jwt['user'] != userID:
                return {'message': 'Unauthorized'}, 401
            
            party = PartyModel.find_by_id(partyID)
            if not party:
                return {'message': 'Party not found'}, 404
    
            if jwt['user'] != party.creator_id:
                return {'message': 'Unauthorized'}, 401
    
            party.delete_from_db()

            purchases = PurchasesModel.query.filter_by(party_id=partyID).all()
            for purchase in purchases:
                purchase.delete_from_db()

            tickets = TicketModel.query.filter_by(party_id=partyID).all()
            for ticket in tickets:
                ticket.delete_from_db()
                
            return {'message': 'Party deleted'}, 200

class UpdatePartyPicture(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('picture', type=FileStorage, location='files', required=True, help='Party picture is required')

    @jwt_required()
    def patch(self, userID, partyID):
        data = UpdatePartyPicture.parser.parse_args()

        party = PartyModel.find_by_id(partyID)
        if not party:
            return {'message': 'Party not found'}, 404

        file = data['picture']
        if file.filename == '':
            return {'message': 'No file selected'}, 400
        
        file.filename = 'party_picture_' + str(partyID) + '.jpg'
        filename = secure_filename(file.filename)
        file_path = os.path.join('./app/files/party', filename)
        file.save(file_path)
        party_picture = file_path

        party.set_party_picture(party_picture)

        party.save_to_db()

        return {'message': 'Party picture updated successfully'}, 200
