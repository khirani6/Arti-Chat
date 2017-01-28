from angular_flask import app

from flask_sqlalchemy import SQLAlchemy
from flask_restless import APIManager
from flask_oauthlib.client import OAuth

db = SQLAlchemy(app)
oauth = OAuth()

etsy = oauth.remote_app('etsy',
    base_url='https://openapi.etsy.com/v2',
    request_token_url='https://openapi.etsy.com/v2/oauth/request_token?scope=profile_r%20email_r%20listings_r',
    access_token_url='https://openapi.etsy.com/v2/oauth/access_token',
    authorize_url='https://etsy.com/oauth/signin',
    consumer_key='jq4x92ncxfk5tawous7dcaxm',
    consumer_secret='5ywk81qg7d'
)

api_manager = APIManager(app, flask_sqlalchemy_db=db)
