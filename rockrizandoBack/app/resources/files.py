import os
from flask import Flask, send_from_directory
from flask_restful import Api, Resource

USER_UPLOAD_DIRECTORY = "./../app/files/user"

class UserFile(Resource):
    def get(self, filename):
        try:
            return send_from_directory(USER_UPLOAD_DIRECTORY, filename)
        except FileNotFoundError:
            return {'message': 'File not found.'}, 404


PARTY_UPLOAD_DIRECTORY = "./../app/files/user"

class PartyFile(Resource):
    def get(self, filename):
        try:
            return send_from_directory(PARTY_UPLOAD_DIRECTORY, filename)
        except FileNotFoundError:
            return {'message': 'File not found.'}, 404
