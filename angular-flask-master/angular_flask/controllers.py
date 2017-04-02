import os

import json
import collections
import oauth2
import cgi
import twitter
import urllib

from flask import Flask, request, Response, session, flash
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort

from angular_flask import app

# routing for API endpoints, generated from the models designated as API_MODELS
from angular_flask.core import api_manager, etsy, twittero, t
from angular_flask.models import *

for model_name in app.config['API_MODELS']:
    model_class = app.config['API_MODELS'][model_name]
    api_manager.create_api(model_class, methods=['GET', 'POST'])

api_session = api_manager.session

consumer = oauth2.Consumer(t['consumer_key'], t['consumer_secret'])
client = oauth2.Client(consumer)


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/about')
@app.route('/blog')
def basic_pages(**kwargs):
    return make_response(open('angular_flask/templates/index.html').read())

@app.route('/login')
def login_page():
    return render_template('index.html')
    #return make_response(open('angular_flask/templates/index.html').read())

@app.route('/templates/lightbox.html')
def lightbox_temp():
    return make_response(open('angular_flask/templates/lightbox.html').read())

@app.route('/home')
def home_page():
    resp = etsy.get('https://openapi.etsy.com/v2/users/__SELF__/profile')
    print ("RESPONSE 2 status = ")

    stringified = json.dumps(resp.data)
    print (stringified)

    return render_template('index.html', token=session['etsy_token'], user_data=stringified)
    #return make_response(open('angular_flask/templates/index.html').read())

@etsy.tokengetter
def get_etsy_token(token=None):
    return session.get('etsy_token')

@twittero.tokengetter
def get_twitter_token(token=None):
    return session.get('twitter_token')


@app.route('/login2')
def login2():
    print ('login2 is reached...')
    print ('request.args.get("next")', request.args.get('next'))
    print ('request.referrer', request.referrer)
    return etsy.authorize(callback=url_for('oauth_authorized',
        next=request.args.get('next') or request.referrer or None))

@app.route('/login3')
def login3():
    resp, content = client.request(t['request_token_url'], "GET")
    # print ('RESPONSE:\n', resp)
    # print ('CONTENT:\n', content)
    # stringified_resp = json.dumps(resp.data)
    # stringified_content = json.dumps(content.data)
    # print ('String_RESPONSE:\n', stringified_resp)
    # print ('String_CONTENT:\n', stringified_content)

    # if resp['status'] != '200':
        # raise Exception("Invalid response from Twitter.")
    # resp2, content2 = twittero.get(t['request_token_url'])
    print (session)
    temp = {}
    temp['request_token'] = dict(urllib.parse.parse_qsl(content))
    print (temp)
    session['request_token'] = {}
    print ('-----------------')
    for k, v in temp['request_token'].items():
        # session['request_token'] =
        print (k, type(k), k.decode("utf-8"), type(k.decode("utf-8")))
        print (v, type(v), v.decode("utf-8"), type(v.decode("utf-8")))
        session['request_token'][k.decode("utf-8")] = v.decode("utf-8")
        print ('-----------------')
    print (session)
    # session['request_token'] = dict(cgi.parse_qsl(content))
    # session2 = {}
    # session2['request_token'] = {} # dict(cgi.parse_qsl(content))
    # print ("session['request_token']", session['request_token'])
    # print ("session['request_token']['ouath_token']", session['request_token']['oauth_token'])
    # for k, v in session['request_token'].items():
        # session2['request_token'][k.decode("utf-8")] = v.decode("utf-8")
        # print (k, type(k))
        # print (v, type(v))
        # print (k.decode("utf-8")  == 'oauth_token')
        # print ('----------')
    # session.update(session2)
    # session = session2
    # for k, v in session2['request_token'].items():
        # session2['request_token'][k.decode("utf-8")] = v.decode("utf-8")
        # print (k, type(k))
        # print (v, type(v))
        # print ('----------')
    url = "%s?oauth_token=%s" % (t['authorize_url'], session['request_token']['oauth_token'])
    # print (url)
    # url = "https://www.google.com"
    # api = twitter.Api(consumer_key=t['consumer_key'],
    #                   consumer_secret=t['consumer_secret'],
    #                   access_token_key=session['request_token']['oauth_token'],
    #                   access_token_secret=session['request_token']['oauth_token'])
    # print(api.VerifyCredentials())
    return redirect(url, 302)
    # return HttpResponseRedirect(url)
    # print ('login3 is reached...')
    # print ('request.args.get("next")', request.args.get('next'))
    # print ('request.referrer', request.referrer)
    # print ('url_for("login_page")', url_for("login_page"))
    # return twitter.authorize(callback=url_for('oauth_authorized_twitter',
    #     next=request.args.get('next') or url_for('login_page') or None))

@app.route('/verify-twitter')
def verifty_twitter():
    accepted = 'n'
    while accepted.lower() == 'n':
        accepted = input('Have you authorized me? (y/n) ')
    oauth_verifier = input('What is the PIN? ')
    token = oauth2.Token(session['request_token']['oauth_token'], session['request_token']['oauth_token_secret'])
    token.set_verifier(oauth_verifier)
    client = oauth2.Client(consumer, token)
    resp, content = client.request(t['access_token_url'], "POST")
    access_token = {}
    access_token_2 = dict(urllib.parse.parse_qsl(content))
    for k, v in access_token_2.items():
        # session['request_token'] =
        print (k, type(k), k.decode("utf-8"), type(k.decode("utf-8")))
        print (v, type(v), v.decode("utf-8"), type(v.decode("utf-8")))
        # session['request_token'][k.decode("utf-8")] = v.decode("utf-8")
        access_token[k.decode("utf-8")] = v.decode("utf-8")
        print ('-----------------')
    # print( "Access Token:")
    # print( "    - oauth_token        = %s" % access_token['oauth_token'])
    # print( "    - oauth_token_secret = %s" % access_token['oauth_token_secret'])
    # print()
    # print( "You may now access protected resources using the access tokens above." )
    # print()
    print (access_token)
    api = twitter.Api(consumer_key=t['consumer_key'],
                      consumer_secret=t['consumer_secret'],
                      access_token_key=access_token['oauth_token'],
                      access_token_secret=access_token['oauth_token_secret'])
    status = api.PostUpdate('Wubba Lubba Dub Dub!!')
    ret = "%s just posted: %s" % (status.user.name, status.text)
    return ret


@app.route("/user/cart")
def show_cart_contents():
    "Grab some cart and user information"
    user_resp = etsy.get('users/__SELF__/') # __SELF__ is replaced with oauth'd userid by API
    cart_resp = etsy.get('users/__SELF__/listings/')

    print (cart_resp)
    return render_template('carts.html', carts=cart_resp.data, user=user_resp.data, logout_url=url_for('logout'))


@app.route("/listings/<listing_id>/images")
def get_thumbnails(listing_id):
    resp_url = "https://openapi.etsy.com/v2/listings/" + listing_id + "/images"
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified

@app.route("/listings/<listing_id>/transactions")
def get_all_transactions_for_listing(listing_id):
    resp_url = "https://openapi.etsy.com/v2/listings/" + listing_id + "/transactions"
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    return stringified


@app.route("/shops")
def get_listings():
    resp = etsy.get('https://openapi.etsy.com/v2/users/__SELF__/shops')
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified

    return render_template('index.html', token=session['etsy_token'], user_data=stringified)

@app.route("/shops/<shop_id>/listings/active")
def get_shop_active_listings(shop_id):
    resp_url = "https://openapi.etsy.com/v2/shops/" + shop_id + "/listings/active"
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)

    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified

@app.route("/shops/<shop_id>/transactions")
def get_shop_transactions(shop_id):
    resp_url = "https://openapi.etsy.com/v2/shops/" + shop_id + "/transactions"
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified

@app.route("/users/<user_id>/profile")
def get_user_profile(user_id):
    resp_url = "https://openapi.etsy.com/v2/users/" + user_id + "/profile"
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified

@app.route("/users/<user_id>/")
def get_user(user_id):
    resp_url = "https://openapi.etsy.com/v2/users/" + user_id
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified

@app.route("/receipts/<receipt_id>/")
def get_receipt(receipt_id):
    resp_url = "https://openapi.etsy.com/v2/receipts/" + receipt_id
    resp = etsy.get(resp_url)
    #print "TEST" + str(resp.data.shop_id)
    print (resp.data)


    stringified = json.dumps(resp.data)
    #print (stringified)
    return stringified



def convert(data):
    if isinstance(data, basestring):
        return str(data)
    elif isinstance(data, collections.Mapping):
        return dict(map(convert, data.iteritems()))
    elif isinstance(data, collections.Iterable):
        return type(data)(map(convert, data))
    else:
        return data


@app.route('/oauth-authorized')
@etsy.authorized_handler
def oauth_authorized(resp):
    next_url = url_for('home_page') # request.args.get('next') or
    print ("next_url = ", next_url)
    # resp = etsy.authorized_response()
    if resp is None:
        flash(u'You denied the request to sign in.')
        return redirect(next_url)

    session['etsy_token'] = (
        resp['oauth_token'],
        resp['oauth_token_secret']
    )

    print ("RESPONSE = ", resp)
    # session['etsy_user'] = resp['screen_name']
    #user_resp = etsy.get('https://openapi.etsy.com/v2/users/artisanhub195?api_key=fvfa290fd1oj7mz3q9sz8de3')
    #print (user_resp.data)
    # flash('You were signed in as %s' % resp['screen_name'])
    return redirect(next_url)
    #return render_template('home.html', resp=resp)


# @app.route('/oauth-authorized')
# @twitter.authorized_handler
# def oauth_authorized_twitter(resp):
#     print ('oauth_authorized_twitter is reached...')
#     next_url = url_for('home_page') #request.args.get('next') or url_for('index')
#     if resp is None:
#         flash(u'You denied the request to sign in.')
#         return redirect(next_url)

#     session['twitter_token'] = (
#         resp['oauth_token'],
#         resp['oauth_token_secret']
#     )
#     session['twitter_user'] = resp['screen_name']

#     # flash('You were signed in as %s' % resp['screen_name'])
#     return redirect(next_url)



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
