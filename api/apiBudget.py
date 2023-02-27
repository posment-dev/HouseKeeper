from api import app

from flask import Flask, request, jsonify, json, make_response
from datetime import datetime, timezone, timedelta
from csv import reader
from enum import Enum, unique
from models import BudgetBase, BudgetEntry, DefaultCategory

budgetEngine = create_engine(DB_BUDGET_LOCATION)
BudgetBase.metadata.bind = budgetEngine

DBBudgetSession = sessionmaker(bind=budgetEngine)
budgetSession = DBBudgetSession()

# class Entry:
#     def __init__(self, date, category, description, value):
#         self.date = date
#         self.category = category
#         self.description = description
#         self.value = value

#     def __str__(self):
#         return f"Date: {self.date}\tValue: {self.value}\tCategory: {self.category}\tDesc: {self.description}"

@unique
class Categories(Enum):
    Groceries = 1
    Vehicles = 2
    pTransport = 3
    CultureEntertainment = 4
    Travel = 5
    EatOut = 6
    Clothes = 7
    Furniture = 8
    Kitchen = 9
    Technology = 10
    Health = 11
    RentExtra = 12
    Insurances = 13
    Taxes = 14
    Incoming = 15

    def __str__(self):
        match self.value:
            case 3:
                return 'Public Transport'
            case 4:
                return 'Culture & Entertainment'
            case 6:
                return 'Eating Out'
            case 12:
                return 'Rent & Extra'
            case _:
                return self.name
            


# Read Category Look Up File
# with open('data/helper/cat_look_up.csv', 'r') as read_obj:
#     # pass the file object to reader() to get the reader object
#     csv_reader = reader(read_obj, delimiter=",")
#     catLookUp = dict(csv_reader)

def getCategoryFromLookUp(description):
    query = budgetSession.query(DefaultCategory).filter_by(description = description)
    if query.count() > 0
        return query.one().category
    return 0

# entries = []
# # open file in read mode
# with open('data/2022_10_account_statements.csv', 'r') as read_obj:
#     # pass the file object to reader() to get the reader object
#     csv_reader = reader(read_obj, delimiter=";")
#     # Iterate over each row in the csv using reader object
#     counter = 0
#     for row in csv_reader:
#         # row variable is a list that represents a row in csv
#         if counter == 0:
#             counter += 1
#             continue
#         if row[10] == 'yes':
#             # Überspringen, wenn es Spaces Buchungen sind
#             continue
#         print(row)
#         value = -1 * float(row[1])
#         date = datetime. strptime(row[0], '%Y-%m-%d').date()
#         description = row[5]
#         subject = row[6]
#         cat = getCategoryFromLookUp(description)
#         if value < 0:
#             cat = Categories.Incoming.value
#             value *= -1
#         temp = Entry(date, cat, description, value)
#         print(temp)
#         entries.append(temp)

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

@app.route('/api/v1/budget/entries', methods = ['GET', 'POST'])
def entries():
	if request.method == 'GET':
		return _corsify_actual_response(getAllEntries())
    if request.method == 'POST':
        if request.data :
            print("Making a new entry")
            req_body = json.loads(request.data)
            print(type(req_body))
            date = req_body['date']
            value = req_body['value']
            category = req_body['category']
            description = req_body['description']
            return _corsify_actual_response(makeANewEntry(date, value, category, description))
        else:
            raise InvalidUsage('No body found', status_code=400)

def getAllEntries():
	entries = budgetSession.query(BudgetEntry).all()
	return jsonify(Entries=[i.serialize for i in Entries])

def makeANewEntry(date, value, category, description)
    entry = BudgetEntry(date = date, value = value, category = category, description = description)
    budgetSession.add(entry)
    budgetSession.commit()
    return jsonify(entry=entry.serialize)

@app.route('/api/v1/budget/files', methods = ['POST', 'DELETE'])
def files():
    if request.method == 'POST':
        return _corsify_actual_response(handleFileUpload())

def handleFileUpload():
    return 0

def _corsify_actual_response(response):
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response

def _build_cors_preflight_response(allowed_methods):
	response = make_response()
	response.headers.add("Access-Control-Allow-Origin", "*")
	response.headers.add('Access-Control-Allow-Headers', "*")
	response.headers.add('Access-Control-Allow-Methods', allowed_methods)
	return response