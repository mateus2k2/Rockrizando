from flask import jsonify
from app.util.validators import string_to_date
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from app.models.party import PartyModel
from app.models.ticket import TicketModel
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
        

        try:
            party_date = datetime.strptime(party_date_str, '%d-%m-%Y')
        except ValueError:
            return {'message': 'Invalid Party Date'}, 400

        party = PartyModel(name=name, description=description, party_date=party_date, location=location)
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
        print(data['party_picture'])
        if data['party_picture']:
            print(11)
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
        