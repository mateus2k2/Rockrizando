from flask_restful import Resource, reqparse
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import current_user
from app.models.user import UserModel
from app.models.party import PartyModel
from app.models.ticket import TicketModel
from app.models.purchases import PurchasesModel
from app.config.db import db
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from werkzeug.datastructures import FileStorage

class UserLogin(Resource):
    def __init__(self):
        pass

    parser = reqparse.RequestParser() 
    parser.add_argument('email', type=str, required=True, help='Not Blank')
    parser.add_argument('password', type=str, required=True, help='Not Blank')

    def post(self):
        data = UserLogin.parser.parse_args()
        email = data['email']
        password = data['password']

        user = db.session.query(UserModel).filter_by(email=email).one_or_none()
        if not user or not user.check_password(password):
            return {'status': 'Login failed.'}, 401
        
        access_token = create_access_token(identity={"user": user.id, "email": user.email})
        # access_token = create_access_token(identity=json.dumps(user, cls=AlchemyEncoder))
        return jsonify(
            token=access_token,
            status="APPROVED"
        )


class UserRegister(Resource):
    def __init__(self):
        pass

    parser = reqparse.RequestParser()  
    parser.add_argument('email', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('password', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('username', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('birth_date', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('profile_picture', type=FileStorage, location='files', required=False)

    def post(self):
        data = UserRegister.parser.parse_args()
                
        email = data['email']
        password = data['password']
        username = data['username']
        birth_date_str = data['birth_date']
        birth_date = None
        profile_picture = None
        
        if UserModel.find_by_email(data['email']):
            return {'message': 'user has already been created.'}, 400

        try:
            birth_date = datetime.strptime(birth_date_str, '%d-%m-%Y')
        except ValueError:
            return {'message': 'Invalid Birth Date'}, 400

        user = UserModel(email=email, username=username, birth_date=birth_date, password=password)
        user.set_password(data['password'])  
        user.save_to_db()
        
        user = UserModel.find_by_email(email)
        if not user:
            return {'message': 'Internal Error'}, 400
        
        if data['profile_picture']:
            file = data['profile_picture']
            if file.filename == '':
                return {'message': 'No file selected'}, 400
            
            file.filename = 'profile_picture_' + str(user.id) + '.jpg'
            filename = secure_filename(file.filename)
            file_path = os.path.join('./app/files/user', filename)
            file.save(file_path)
            profile_picture = file_path
        
        UserModel.set_profile_picture(user, profile_picture)
        user.save_to_db()
        

        return {'message': 'user has been created successfully.'}, 201
    
    
class GetUserData(Resource):
    def __init__(self):
        pass

    @jwt_required()
    def get(self, userID):
        user = UserModel.find_by_id(userID)
        if not user:
            return {'message': 'User not found'}, 404
        
        return {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'birth_date': user.birth_date.strftime('%d-%m-%Y'),
        }, 200        


class UpdateUserData(Resource):
    parser = reqparse.RequestParser()  
    parser.add_argument('email', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('password', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('username', type=str, required=True, help='Not Blank', location = 'form')
    parser.add_argument('profile_picture', type=FileStorage, location='files', required=False)
    
    @jwt_required()
    def patch(self, userID):
        jwtID = get_jwt_identity()
        
        if(jwtID['user'] != userID):
            return {'message': 'Unauthorized'}, 401
        
        data = UpdateUserData.parser.parse_args()
                
        email = data['email']
        password = data['password']
        username = data['username']
        profile_picture = None
        
        print(profile_picture)
        user = UserModel.find_by_id(userID)
        if not user:
            return {'message': 'User not found'}, 404
        
        if UserModel.find_by_email(email) and user.email != email:
            return {'message': 'user has already been created.'}, 400
        
        user.email = email
        user.username = username
        user.set_password(password)
        
        if data['profile_picture']:
            file = data['profile_picture']
            if file.filename == '':
                return {'message': 'No file selected'}, 400
            
            file.filename = 'profile_picture_' + str(user.id) + '.jpg'
            filename = secure_filename(file.filename)
            file_path = os.path.join('./app/files/user', filename)
            file.save(file_path)
            profile_picture = file_path
        
        UserModel.set_profile_picture(user, profile_picture)
        user.save_to_db()
        
        return {'message': 'user has been updated successfully.'}, 201

class UserTicketData(Resource):
    def get(self, uuid):
        purchase = PurchasesModel.find_by_uuid(uuid)
        if not purchase:
            return {'message': 'Purchase not found'}, 404
        
        user = UserModel.find_by_id(purchase.user_id)
        if not user:
            return {'message': 'User not found'}, 404
        
        ticket = TicketModel.find_by_id(purchase.ticket_id)
        if not ticket:
            return {'message': 'Ticket not found'}, 404

        return {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'birth_date': user.birth_date.strftime('%d-%m-%Y'),
            'ticket': {
                'id': ticket.id,
                'name': ticket.name,
                'description': ticket.description,
                'price': ticket.price,
                'party_id': ticket.party_id,
            },
            'PurchaseName': purchase.name,
            'PurchaseEmail': purchase.email            
        }, 200
        

class UserPurchaseTicket(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('userID', type=int, required=True, help='User ID is required')
    parser.add_argument('partyID', type=str, required=True, help='Party name is required')
    
    
    @jwt_required()
    def get(self, useridURL, partyidURL):
        data = UserPurchaseTicket.parser.parse_args()
        
        jwt = get_jwt_identity()

        if jwt['user'] != data['userID']:
            return {'message': 'Unauthorized'}, 401

        participants = PurchasesModel.query.filter_by(party_id=data['partyID'], user_id=data['userID']).all() 
        allTickets = []
        
        for participant in participants:
            ticket_id = participant.ticket_id
            ticket = TicketModel.find_by_id(ticket_id)
            if ticket:
                allTickets.append({
                    'ticket_id': ticket.id,
                    'ticket_name': ticket.name,
                    'ticket_description': ticket.description,
                    'ticket_price': ticket.price,
                    'party_id': ticket.party_id,
                })
        
        return allTickets, 200

class UserPurchases(Resource):
    def get(self, userID):
        purchases = PurchasesModel.find_by_user_id(userID)
        if not purchases:
            return {'message': 'User not found'}, 404
        
        ##remove repeated parties
        parties_ids = []
        parties = []
        for purchase in purchases:
            if purchase.party_id not in parties:
                parties_ids.append(purchase.party_id)

        for party_id in parties_ids:
            party = PartyModel.find_by_id(party_id)
            if party:
                parties.append(party)
        
        return {
            'parties': [party.json() for party in parties]
        }, 200
