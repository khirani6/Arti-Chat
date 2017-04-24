# Artisan-Hub

Artisan-Hub (previously Arti-Chat) is a platform where Etsy sellers can easily manage their orders and communicate with customers.

The "Arti-Chat_iOS" folder contains code from our final presentation/demo from Fall 2016. It is written in Swift. Since then, we have changed focus to building a web app called Artisan-Hub for Spring 2017. The following release notes are for the Artisan-Hub web application.


### Release Notes

**New Features**
- Etsy login integration- Facebook and Twitter integration- Dashboard Page for managing open orders on Etsy store
- Announcements Page for posting to social media- Settings page for managing social media integrations**Bug Fixes**
- ​​No current bug fixes with current release**Known Bugs**
- User is allowed to go directly to /home without logging into Etsy first- After logging into Facebook, have to click “Login with Facebook” one more time for the integration to actually work- Posting a message to Twitter & Facebook causes an error without logging in and authenticating your accounts first- Testing data occasionally fails to load when visiting the dashboard the first time.- The Etsy API key used is still in “development” status, so calls are rate limited, and the accounts allowed to log into Artisan–Hub are limited### Installation Information**Pre-Requisites & Dependent Libraries** (must be installed)
- [Python3](​https://www.python.org/downloads/)​- [pip3](https://pip.pypa.io/en/latest/installing/)​ (should already be installed automatically with Python3)
**Download Instructions**
Download this repository by clicking the “Clone or download” button on this page and selecting “Download ZIP.” Then unzip the downloaded file and move the “Arti-Chat” folder to wherever you desire.**Build Instructions & Installation**Using the command line, navigate to the “Arti-Chat” folder on your machine and then run the following commands:

```cd angular-flask-masterpip3 install virtualenvvirtualenv venvsource venv/bin/activate￼￼pip3 install -r requirements.txtpython3 runserver.py
```**Running**
Visit `​http://localhost:5000/​` in your browser after typing in the command `python3 runserver.py` in the command line (see above for details). To stop running the application, go to your terminal and press Control-C.**Troubleshooting**
When you have trouble loading features of Artisan-Hub, you can use Private Browsing in Firefox or Incognito Mode in Google Chrome to avoid having to clear the cache.
