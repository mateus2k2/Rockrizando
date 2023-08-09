import os
import qrcode
from flask import Flask, send_from_directory
from flask_restful import Api, Resource

USER_UPLOAD_DIRECTORY = "./../app/files/user"

class UserFile(Resource):
    def get(self, filename):
        try:
            return send_from_directory(USER_UPLOAD_DIRECTORY, filename)
        except FileNotFoundError:
            return {'message': 'File not found.'}, 404


PARTY_UPLOAD_DIRECTORY = "./../app/files/party"

class PartyFile(Resource):
    def get(self, filename):
        try:
            return send_from_directory(PARTY_UPLOAD_DIRECTORY, filename)
        except FileNotFoundError:
            return {'message': 'File not found.'}, 404

class TicketFile(Resource):
    def get(self, uuid):
        print(1)
        try:
            return send_from_directory('./../app/files/ticket', uuid + '.png')
        except FileNotFoundError:
            return {'message': 'File not found.'}, 404