from flask_restful import Resource, reqparse
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import current_user
from app.models.user import UserModel
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
