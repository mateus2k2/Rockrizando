from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_cors import CORS
import json

import os

from app.resources.party import NewPartyPicture, NewPartyData, PartiesData, PartieBuy, PartyData
from app.resources.user import UserRegister, UserLogin, GetUserData, UpdateUserData
from app.resources.files import UserFile, PartyFile
from app.config.config import postgresqlConfig

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = postgresqlConfig
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "JWT123SACRETKEY"
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=60 * 24 * 30 * 360) # ---------------------------- 

app.config.from_pyfile('config/config.py')

jwt = JWTManager(app)
api = Api(app)


with app.app_context():
    from app.config.db import db
    db.init_app(app)
    db.create_all()


api.add_resource(UserFile, '/files/user/<string:filename>', methods=['GET'])
api.add_resource(PartyFile, '/files/party/<string:filename>', methods=['GET'])

api.add_resource(UserRegister, '/register', methods=['POST'])
api.add_resource(UserLogin, '/login', methods=['POST'])

api.add_resource(NewPartyData, '/newPartyData', methods=['POST'])
api.add_resource(NewPartyPicture, '/newPartyPicture', methods=['POST'])

api.add_resource(GetUserData, '/user/<int:userID>', methods=['GET'])
api.add_resource(UpdateUserData, '/user/<int:userID>/update', methods=['PATCH']) # ----------------------

api.add_resource(PartiesData, '/parties/', methods=['GET'])
api.add_resource(PartyData, '/party/<int:partyID>/', methods=['GET']) # ----------------------
api.add_resource(PartieBuy, '/party/<int:partyID>/buy', methods=['POST']) # ----------------------



if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000',debug=True)

# docker run    --name rockrizandoDB    -p 5432:5432    -e POSTGRES_USER=postgres    -e POSTGRES_PASSWORD=postgres    -e POSTGRES_DB=rockrizando    -d    postgres
# flask --app ./app/app.py --debug run


# vf activate rockrizando
# export FLASK_APP=./app/app
# flask run --host=localhost
    