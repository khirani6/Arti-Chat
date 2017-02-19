from angular_flask import app

from flask_sqlalchemy import SQLAlchemy
from flask_restless import APIManager
from flask_oauthlib.client import OAuth

db = SQLAlchemy(app)
oauth = OAuth()

etsy = oauth.remote_app('etsy',
    base_url='https://openapi.etsy.com/v2',
    request_token_url='https://openapi.etsy.com/v2/oauth/request_token?scope=profile_r%20email_r%20listings_r%20transactions_r%20transactions_w%20shops_rw%20',
    access_token_url='https://openapi.etsy.com/v2/oauth/access_token',
    authorize_url='https://etsy.com/oauth/signin',
    consumer_key='fvfa290fd1oj7mz3q9sz8de3',
    consumer_secret='mrxd5mxylm'
)

twitter = oauth.remote_app('twitter',
    base_url='https://api.twitter.com/1/',
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authenticate',
    consumer_key='kk6nj3NXjgtKxxawy1rDrxtyV',
    consumer_secret='jgnoJfQvRqvYMCZFfLQzcBVZjbCX3eQartiycWw7htg6dpoyyT'
)


api_manager = APIManager(app, flask_sqlalchemy_db=db)
