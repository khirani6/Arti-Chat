from flask import Flask
# from flaskext.mysql import MySQL
from flask_login import LoginManager

# mysql = MySQL()
lm = LoginManager()
app = Flask(__name__)
app.config.update(
    WTF_CSRF_ENABLED = True,
    DEBUG=True,
    SECRET_KEY='c11a678785091b7f1334c24a4123ee75'
)
# app.config['MYSQL_DATABASE_USER'] = 'root'
# app.config['MYSQL_DATABASE_PASSWORD'] = 'cs2340meenk'
# app.config['MYSQL_DATABASE_DB'] = 'jia_app'
# app.config['MYSQL_DATABASE_HOST'] = '128.61.104.207'
# app.config['MYSQL_DATABASE_'] = ''
# mysql.init_app(app)
# lm.init_app(app)

from app.general import views