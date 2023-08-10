from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask_cors import CORS
import json

import os

from app.resources.party import NewPartyPicture, NewPartyData, PartiesData, PartyBuy, PartyData, UserParties, UserParty, PartyDelete, UpdateParty, UpdatePartyPicture
from app.resources.user import UserRegister, UserLogin, GetUserData, UpdateUserData, UserTicketData, UserPurchaseTicket, UserPurchases, UserSpecifiedTicket
from app.resources.files import UserFile, PartyFile, TicketFile
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
api.add_resource(TicketFile, '/files/ticket/<string:uuid>', methods=['GET']) # Retorna imagem do QR Code de uma festa pelo uuid

api.add_resource(UserRegister, '/register', methods=['POST'])
api.add_resource(UserLogin, '/login', methods=['POST'])

api.add_resource(NewPartyData, '/newPartyData', methods=['POST'])
api.add_resource(NewPartyPicture, '/newPartyPicture', methods=['POST'])

api.add_resource(GetUserData, '/user/<int:userID>', methods=['GET'])
api.add_resource(UpdateUserData, '/user/<int:userID>/update', methods=['PATCH'])

api.add_resource(PartiesData, '/parties/', methods=['GET'])
api.add_resource(PartyData, '/party/<int:partyID>/', methods=['GET'])
api.add_resource(PartyBuy, '/party/<int:partyID>/buy', methods=['POST']) # Fazer uuid e Gerar QR Code 

api.add_resource(UserParties, '/user/<int:userID>/parties/', methods=['GET']) 
api.add_resource(UserParty, '/user/<int:userID>/parties/<int:partyID>', methods=['GET']) 


# Retorna detalhes do ticket e do usuário
api.add_resource(UserTicketData, '/ticket/<string:uuid>', methods=['GET'])

# /user/:userid/purchases/                    Pegar lista festas compradas por um usuário
api.add_resource(UserPurchases, '/user/<int:userID>/purchases', methods=['GET'])

# /user/:userid/purchases/:party:id           Pegar lista Ingressos de uma festa de um usuário
api.add_resource(UserPurchaseTicket, '/user/<int:useridURL>/purchases/<int:partyidURL>', methods=['GET']) 

# /user/:userid/ticket/:ticketid              Pegar detalhes de um ingresso específico de um usuário
api.add_resource(UserSpecifiedTicket, '/user/<int:userID>/ticket/<int:purchaseID>', methods=['GET'])

# /user/:userid/party/<int:partyID>/delete/   Deletar festa
api.add_resource(PartyDelete, '/user/<int:userID>/party/<int:partyID>/delete', methods=['DELETE'])

# /user/:userid/party/<int:partyID>/update/   Update festa
api.add_resource(UpdateParty, '/user/<int:userID>/party/<int:partyID>/update/', methods=['PATCH'])

# /user/:userid/party/<int:partyID>/update/picture   Update festa
api.add_resource(UpdatePartyPicture, '/user/<int:userID>/party/<int:partyID>/update/picture', methods=['PATCH'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000',debug=True)

# docker run    --name rockrizandoDB    -p 5432:5432    -e POSTGRES_USER=postgres    -e POSTGRES_PASSWORD=postgres    -e POSTGRES_DB=rockrizando    -d    postgres
# flask --app ./app/app.py --debug run


# vf activate rockrizando
# export FLASK_APP=./app/app
# flask run --host=localhost 
    