import os

from flask import Flask, request, Response, session
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort

from angular_flask import app

# routing for API endpoints, generated from the models designated as API_MODELS
from angular_flask.core import api_manager, etsy
from angular_flask.models import *

for model_name in app.config['API_MODELS']:
    model_class = app.config['API_MODELS'][model_name]
    api_manager.create_api(model_class, methods=['GET', 'POST'])

api_session = api_manager.session


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/about')
@app.route('/blog')
@app.route('/login')
def basic_pages(**kwargs):
    return make_response(open('angular_flask/templates/index.html').read())


@etsy.tokengetter
def get_etsy_token(token=None):
    return session.get('etsy_token')


@app.route('/login2')
def login2():
    return etsy.authorize(callback=url_for('oauth_authorized',
        next=request.args.get('next') or request.referrer or None))


@app.route('/oauth-authorized')
def oauth_authorized():
    next_url = request.args.get('next') or url_for('basic_pages')
    resp = etsy.authorized_response()
    if resp is None:
        flash(u'You denied the request to sign in.')
        return redirect(next_url)

    session['etsy_token'] = (
        resp['oauth_token'],
        resp['oauth_token_secret']
    )
    session['etsy_user'] = resp['screen_name']

    flash('You were signed in as %s' % resp['screen_name'])
    return redirect(next_url)


# routing for CRUD-style endpoints
# passes routing onto the angular frontend if the requested resource exists
from sqlalchemy.sql import exists

crud_url_models = app.config['CRUD_URL_MODELS']


@app.route('/<model_name>/')
@app.route('/<model_name>/<item_id>')
def rest_pages(model_name, item_id=None):
    if model_name in crud_url_models:
        model_class = crud_url_models[model_name]
        if item_id is None or api_session.query(exists().where(
                model_class.id == item_id)).scalar():
            return make_response(open(
                'angular_flask/templates/index.html').read())
    abort(404)


# special file handlers and error handlers
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'img/favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
