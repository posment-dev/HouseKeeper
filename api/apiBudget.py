from api import app

from flask import Flask, request, jsonify, json, make_response
from datetime import datetime, timezone, timedelta
from csv import reader
from enum import Enum, unique

class Entry:
    def __init__(self, date, category, description, value):
        self.date = date
        self.category = category
        self.description = description
        self.value = value

    def __str__(self):
        return f"Date: {self.date}\tValue: {self.value}\tCategory: {self.category}\tDesc: {self.description}"

@unique
class Categories(Enum):
    Groceries = 'Groceries'
    Vehicles = 'Vehicles'
    pTransport = 'Public Transport'
    CultureEntertainment = 'Culture & Entertainment'
    Travel = 'Travel'
    EatOut = 'Eating Out'
    Clothes = 'Clothes'
    Furniture = 'Furniture'
    Kitchen = 'Kitchen'
    Technology = 'Technology'
    Health = 'Health'
    RentExtra = 'Rent & Extra'
    Insurances = 'Insurances'
    Taxes = 'Taxes'
    Incoming = 'Incoming'

# Read Category Look Up File
with open('data/helper/cat_look_up.csv', 'r') as read_obj:
    # pass the file object to reader() to get the reader object
    csv_reader = reader(read_obj, delimiter=",")
    catLookUp = dict(csv_reader)

def getCategoryFromLookUp(description):
    if description in catLookUp.keys():
        return catLookUp[description]
    return 'uncategorized'

entries = []
# open file in read mode
with open('data/2022_10_account_statements.csv', 'r') as read_obj:
    # pass the file object to reader() to get the reader object
    csv_reader = reader(read_obj, delimiter=";")
    # Iterate over each row in the csv using reader object
    counter = 0
    for row in csv_reader:
        # row variable is a list that represents a row in csv
        if counter == 0:
            counter += 1
            continue
        if row[10] == 'yes':
            # Überspringen, wenn es Spaces Buchungen sind
            continue
        print(row)
        value = -1 * float(row[1])
        date = datetime. strptime(row[0], '%Y-%m-%d').date()
        description = row[5]
        subject = row[6]
        cat = getCategoryFromLookUp(description)
        if value < 0:
            cat = Categories.Incoming.value
            value *= -1
        temp = Entry(date, cat, description, value)
        print(temp)
        entries.append(temp)

class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.route('/api/v1/budget', methods = ['GET'])
def tasks():
	if request.method == 'GET':
		return _corsify_actual_response(getAllEntries())

def getAllEntries():
	tasks = session.query(Task).all()
	# Trigger Remove Pause when over
	for t in tasks :
		if len(t.pause) > 0 :
			print('{} is paused'.format(t.name))
			pause = t.pause[0]
			pause_end = pause.starting + timedelta(days=pause.duration)
			print('pause end date is {}'.format(pause_end))
			if pause_end < datetime.utcnow() :
				print('removing pause')
				deletePauses([t.id])
	tasks = session.query(Task).all()
	return jsonify(Tasks=[i.serialize for i in tasks])

def _corsify_actual_response(response):
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response

def _build_cors_preflight_response(allowed_methods):
	response = make_response()
	response.headers.add("Access-Control-Allow-Origin", "*")
	response.headers.add('Access-Control-Allow-Headers', "*")
	response.headers.add('Access-Control-Allow-Methods', allowed_methods)
	return response