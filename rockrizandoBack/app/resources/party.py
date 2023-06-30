from flask import jsonify
from app.util.validators import string_to_date
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, JWTManager
from app.models.party import PartyModel
# from app.util.logz import create_logger
from sqlalchemy import func
from app.config.db import db


class NewParty(Resource):
    def __init__(self):
        # self.logger = create_logger()
        pass

    @jwt_required()
    def post(self):
        
        current_user = get_jwt_identity()
        print(current_user)
        
        return "Secret data", 200
        