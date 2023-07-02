from flask import jsonify, request
from app.util.validators import string_to_date
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from app.models.friendship import FriendshipModel 
from app.models.user import UserModel
from app.models.participants import ParticipantsModel
# from app.util.logz import create_logger
from sqlalchemy import func
from app.config.db import db
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from werkzeug.datastructures import FileStorage

class FriendRequest(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('friend_id', type=int, required=True, help='Friend ID is required.')

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        data = FriendRequest.parser.parse_args()
        friend_id = data['friend_id']
        
        print(data)

        # Check if the friend ID is valid
        friend = UserModel.find_by_id(friend_id)
        if not friend:
            return {'message': 'Friend not found.'}, 404

        if friend_id == current_user_id['user']:
            return {'message': 'You cannot add yourself as a friend.'}, 400
        
        # Check if the friend request already exists
        existing_request = FriendshipModel.find_by_ids(current_user_id['user'], friend_id)
        if existing_request:
            return {'message': 'Friend request already sent.'}, 400

        # Create a new friend request
        friendship = FriendshipModel(current_user_id['user'], friend_id)
        friendship.save_to_db()

        return {'message': 'Friend request sent.'}, 201

class FriendRespond(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('friend_id', type=int, required=True, help='Friend ID is required.')
    parser.add_argument('action', type=str, required=True, help='Action is required.')
    parser.add_argument('action', type=str, required=True, help='Action is required.')

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        data = FriendRespond.parser.parse_args()
        friend_id = data['friend_id']
        action = data['action']

        # Check if the friend ID is valid
        friend = UserModel.find_by_id(friend_id)
        if not friend:
            return {'message': 'Friend not found.'}, 404

        # Check if the friend request exists
        friendship = FriendshipModel.find_by_ids(current_user_id['user'], friend_id)
        if not friendship or friendship.status != 'pending':
            return {'message': 'Friend request not found or already responded.'}, 404

        # Update the friend request status based on the action
        if action == 'accept':
            friendship.accept_friendship()
            return {'message': 'Friend request accepted.'}, 200
        elif action == 'reject':
            friendship.reject_friendship()
            return {'message': 'Friend request rejected.'}, 200
        else:
            return {'message': 'Invalid action.'}, 400


class FriendsData(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()

        # Retrieve all accepted friendships for the current user
        accepted_friendships = FriendshipModel.find_accepted_friendships(current_user_id['user'])

        friends = []
        for friendship in accepted_friendships:
            friend_id = friendship.friend_id
            friend = UserModel.find_by_id(friend_id)
            friends.append({
                'id': friend.id,
                'email': friend.email,
                'username': friend.username,
                'birth_date': str(friend.birth_date),
                'status': friendship.status
            })

        return {'friends': friends}, 200