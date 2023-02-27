# Common imports
from flask import Flask, request, jsonify, json, make_response
from sqlalchemy.sql import func
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Task imports
from models import Base, Task, Pause
from constants import DB_LOCATION
from datetime import datetime, timezone, timedelta

# Budget imports
from csv import reader
from enum import Enum, unique
from models import BudgetBase, BudgetEntry, DefaultCategory
from constants import DB_BUDGET_LOCATION
import copy

# File Upload
import os


# Task DB Engine
engine = create_engine(DB_LOCATION)
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

# Budget DB Engine
budgetEngine = create_engine(DB_BUDGET_LOCATION)
BudgetBase.metadata.bind = budgetEngine

DBBudgetSession = sessionmaker(bind=budgetEngine)
budgetSession = DBBudgetSession()

app = Flask(__name__)

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

@app.route('/api/v1/tasks', methods = ['GET', 'POST', 'DELETE', 'OPTIONS'])
def tasks():
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, POST, DELETE, OPTIONS')
	if request.method == 'GET':
		return _corsify_actual_response(getAllTasks())
	if request.method == 'POST':
		if request.data :
			print("Making a new taks")
			req_body = json.loads(request.data)
			print(type(req_body))
			name = req_body['name']
			days_repeat = req_body['days_repeat']
			print(name)
			print(days_repeat)
			return _corsify_actual_response(makeANewTask(name, days_repeat))
		else:
			raise InvalidUsage('No body found', status_code=400)
	if request.method == 'DELETE':
		print(request.data)
		if request.data :
			print("Deleting multiple Tasks")
			ids = json.loads(request.data)
			print("with ids: " + str(ids)[1:-1])
			return _corsify_actual_response(deleteMultipleTasks(ids))
		else:
			raise InvalidUsage('No body found', status_code=400)


@app.route('/api/v1/tasks/<int:id>', methods = ['GET', 'PUT', 'DELETE', 'OPTIONS'])
def task(id):
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, PUT, DELETE, OPTIONS')
	if request.method == 'GET':
		return _corsify_actual_response(getTask(id))
	if request.method == 'PUT':
		print("Updating a task")
		name = request.args.get('name', '')
		days_repeat = request.args.get('days_repeat', '')
		#sec = request.args.get('sec', '')
		print(name)
		print(days_repeat)
		# if sec :
		# 	int_sec = int(sec)
		# 	return _corsify_actual_response(updateResetTask(id, int_sec))
		return _corsify_actual_response(updateTask(id, name, days_repeat))
	if request.method == 'DELETE':
		return _corsify_actual_response(deleteTask(id))


@app.route('/api/v1/tasks/reset/<int:id>', methods = ['PUT', 'OPTIONS'])
def reset_task(id):
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('PUT, OPTIONS')
	if request.method == 'PUT':
		return _corsify_actual_response(resetTask(id))

@app.route('/api/v1/tasks/pauses', methods = ['GET', 'PUT', 'DELETE', 'OPTIONS'])
def pause_task():
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, PUT, DELETE, OPTIONS')
	if request.method == 'GET':
		return _corsify_actual_response(getAllPauses())
	if request.method == 'PUT':
		if request.data :
			print("Pausing task")
			req_body = json.loads(request.data)
			print(req_body)
			return _corsify_actual_response(pauseTasks(req_body))
		else:
			raise InvalidUsage('No body found', status_code=400)
	if request.method == 'DELETE':
		if request.data :
			print("Removing pause")
			req_body = json.loads(request.data)
			print(req_body)
			return _corsify_actual_response(deletePauses(req_body))
		else:
			raise InvalidUsage('No body found', status_code=400)

def getAllTasks():
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

def getTask(id):
	task = session.query(Task).filter_by(id = id).one()
	return jsonify(task=task.serialize) 
	
def makeANewTask(name, days_repeat):
	task = Task(name = name, days_repeat = days_repeat)
	session.add(task)
	session.commit()
	return jsonify(Task=task.serialize)

def updateTask(id, name, days_repeat):
	task = session.query(Task).filter_by(id = id).one()
	if name:
		task.name = name
	if days_repeat:
		task.days_repeat = days_repeat
	session.add(task)
	session.commit()
	return jsonify("Updated a Task with id %s" % id)

def resetTask(id):
	task = session.query(Task).filter_by(id = id).one()
	task.last_reset = func.now()
	session.add(task)
	session.commit()
	return jsonify("Reset a Task with id %s" % id)

def deleteTask(id):
	task = session.query(Task).filter_by(id = id).one()
	session.delete(task)
	session.commit()
	return jsonify("Removed Task with id %s" % id)

def deleteMultipleTasks(ids):
	for id in ids:
		task = session.query(Task).filter_by(id = id).one()
		qpause = session.query(Pause).filter_by(taskId = task.id)
		if qpause.count() > 0:
			pause = qpause.one()
			session.delete(pause)
		session.delete(task)
	session.commit()
	return jsonify("Removed Tasks with ids %s" % ids)

def getAllPauses():
	pauses = session.query(Pause).all()
	return jsonify(Pauses=[i.serialize for i in pauses])

def pauseTasks(id_val_dict):
	for tid in id_val_dict:
		query = session.query(Pause).filter_by(taskId = tid)
		if query.count() > 0:
			pause = query.one()
			pause.starting = func.now()
			pause.duration = id_val_dict[tid]
		else:
			pause = Pause(taskId = tid, starting = func.now(), duration = id_val_dict[tid])
		session.add(pause)
	session.commit()
	return jsonify("Tasks with ids %s paused for %s days" % (id_val_dict.keys(), id_val_dict.values()))

def updateResetTask(id, seconds_to_add):
	task = session.query(Task).filter_by(id = id).one()
	task.last_reset += timedelta(seconds=seconds_to_add)
	session.add(task)
	# task.update(last_reset=new_last_reset)
	session.commit()
	return jsonify("Change last Reset on Task with id %s" % id)

def deletePauses(ids):
	for tid in ids:
		query = session.query(Pause).filter_by(taskId = tid)
		if query.count() > 0:
			pause = query.one()
			# calculate and set new last reset date
			full_sec = timedelta(days=pause.duration).total_seconds()
			start_now_sec = (datetime.utcnow() - pause.starting).seconds
			#print('{} - {} - {} - {}'.format(pause.starting, datetime.utcnow(), start_now_sec, datetime.utcnow() - pause.starting))
			seconds_add_last_reset = max(full_sec, start_now_sec)
			updateResetTask(pause.taskId, seconds_add_last_reset)
			session.delete(pause)
		session.commit()
	return jsonify("Removed Pauses for Tasks with ids %s" % ids)

def _corsify_actual_response(response):
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response

def _build_cors_preflight_response(allowed_methods):
	response = make_response()
	response.headers.add("Access-Control-Allow-Origin", "*")
	response.headers.add('Access-Control-Allow-Headers', "*")
	response.headers.add('Access-Control-Allow-Methods', allowed_methods)
	return response


# BUDGET API

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
	Irrelevant = 16
	Presents = 17
	Education = 18
	Uncategorized = 99

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

def getCategoryFromLookUp(description):
	query = budgetSession.query(DefaultCategory).filter_by(description = description)
	if query.count() > 0:
		return Categories(query.one().category)
	return Categories.Uncategorized

@app.route('/api/v1/budget/entries', methods = ['GET', 'POST', 'DELETE', 'OPTIONS'])
def entries():
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, POST, DELETE, OPTIONS')
	if request.method == 'GET':
		dateFrom = request.args.get('from', '')
		dateTo = request.args.get('to', '')
		if dateTo:
			print(dateFrom + ' - ' + dateTo)
			return _corsify_actual_response(getEntriesByDateRange(dateFrom, dateTo))
		return _corsify_actual_response(getAllEntries())
	if request.method == 'POST':
		if request.data:
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
	if request.method == 'DELETE':
		return _corsify_actual_response(deleteAllEntries())


@app.route('/api/v1/budget/entries/<int:id>', methods = ['GET', 'PUT', 'OPTIONS'])
def entry(id):
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, PUT, OPTIONS')
	if request.method == 'GET':
		return _corsify_actual_response(getEntry(id))
	if request.method == 'PUT':
		category = request.args.get('category', Categories.Uncategorized.value)
		return _corsify_actual_response(setCategory(id, category))

def getAllEntries():
	entries = budgetSession.query(BudgetEntry).all()
	readable_cat = stringifyCategoriesInEntries(entries)
	return jsonify(Entries=[i.serialize for i in readable_cat])

def getEntry(id):
	entry = budgetSession.query(BudgetEntry).filter_by(id = id).one()
	readable_cat = stringifyCategoriesInEntries(entry)
	return jsonify(readable_cat.serialize)

def deleteAllEntries():
	entries = budgetSession.query(BudgetEntry).delete()
	budgetSession.commit()
	return jsonify("All entries deleted!")

def setCategory(id, category):
	entry = budgetSession.query(BudgetEntry).filter_by(id = id).one()
	entry.category = category
	budgetSession.add(entry)
	budgetSession.commit()
	return jsonify("Set new Category of Entry with id %s" % id)

def getEntriesByDateRange(dateFrom, dateTo):
	entries = budgetSession.query(BudgetEntry).filter(BudgetEntry.date.between(dateFrom, dateTo)).all()
	readable_cat = stringifyCategoriesInEntries(entries)
	return jsonify(Entries=[i.serialize for i in readable_cat])

def makeANewEntry(date, value, category, description):
	rappen = int(value * 100)
	entry = BudgetEntry(date = date, value = rappen, category = category, description = description)
	budgetSession.add(entry)
	budgetSession.commit()
	return jsonify(entry=entry.serialize)

@app.route('/api/v1/budget/categories', methods = ['GET', 'POST'])
def categories():
	if request.method == 'GET':
		return _corsify_actual_response(getCategoryEnum())

def getCategoryEnum():
	catDict = {str(i): i.value for i in Categories}
	return jsonify(catDict)

@app.route('/api/v1/budget/categories/default', methods = ['GET', 'POST', 'DELETE', 'OPTIONS'])
def defaults():
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, POST, DELETE, OPTIONS')
	if request.method == 'GET':
		return _corsify_actual_response(getCategoryDefaults())
	if request.method == 'POST':
		desc = request.args.get('desc', '')
		categoryId = request.args.get('category', Categories.Uncategorized.value)
		entryId = int(request.args.get('entryId', '0'))
		if entryId != 0:
			return _corsify_actual_response(setCategoryDefaultByEntry(entryId))
		return _corsify_actual_response(setCategoryDefault(desc, categoryId))
	if request.method == 'DELETE':
		desc = request.args.get('desc', '')
		return _corsify_actual_response(deleteCategoryDefault(desc))

def getCategoryDefaults():
	defaults = budgetSession.query(DefaultCategory).all()
	return jsonify(Defaults=[i.serialize for i in defaults])

def _setCatForAllUncatEntriesSameDesc(desc, catId):
	entries = budgetSession.query(BudgetEntry).filter(BudgetEntry.description == desc, BudgetEntry.category == Categories.Uncategorized.value).all()
	for e in entries:
		e.category = catId
		budgetSession.add(e)
	budgetSession.commit()

def setCategoryDefaultByEntry(entryId):
	entry = budgetSession.query(BudgetEntry).filter_by(id = entryId).one()
	query = budgetSession.query(DefaultCategory).filter_by(description = entry.description)
	if query.count() > 0:
		default = query.one()
		default.category = entry.category
		budgetSession.add(default)
	else:
		default = DefaultCategory(category = entry.category, description = entry.description)
		budgetSession.add(default)
	budgetSession.commit()
	_setCatForAllUncatEntriesSameDesc(entry.description, entry.category)
	return jsonify("New Default set.")

def setCategoryDefault(description, categoryId):
	query = budgetSession.query(DefaultCategory).filter_by(description = description)
	if query.count() > 0:
		default = query.one()
		default.category = categoryId
		budgetSession.add(default)
	else:
		default = DefaultCategory(category = categoryId, description = description)
		budgetSession.add(default)
	budgetSession.commit()
	_setCatForAllUncatEntriesSameDesc(description, categoryId)
	return jsonify("New Default set.")

def deleteCategoryDefault(description):
	query = budgetSession.query(DefaultCategory).filter_by(description = description)
	if query.count() > 0:
		default = query.one()
		budgetSession.delete(default)
		budgetSession.commit()
	return jsonify("Default for desc=%s removed." % description)

@app.route('/api/v1/budget/categories/totals', methods = ['GET', 'OPTIONS'])
def categoryTotals():
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('GET, OPTIONS')
	if request.method == 'GET':
		dateFrom = request.args.get('from', '')
		dateTo = request.args.get('to', '')
		if dateTo:
			print(dateFrom + ' - ' + dateTo)
			return _corsify_actual_response(getCategoriesTotalsByDateRange(dateFrom, dateTo))
		else:
			return _corsify_actual_response(getCategoriesTotals())


def getCategoriesTotalsByDateRange(dateFrom, dateTo):
	entries = budgetSession.query(BudgetEntry).filter(BudgetEntry.date.between(dateFrom, dateTo)).all()
	catTotals = {str(i) : 0 for i in Categories}
	for entry in entries:
		catName = str(Categories(entry.category))
		catTotals[catName] += entry.value;
	return jsonify(catTotals)

def getCategoriesTotals():
	entries = budgetSession.query(BudgetEntry).all()
	catTotals = {str(i) : 0 for i in Categories}
	for entry in entries:
		catName = str(Categories(entry.category))
		catTotals[catName] += entry.value;
	return jsonify(catTotals)

@app.route('/api/v1/budget/files', methods = ['GET', 'POST'])
def files():
	if request.method == 'GET':
		return 0
	if request.method == 'POST':
		filename = request.args.get('filename', 0)
		return _corsify_actual_response(processFile(filename))

UPLOAD_FOLDER = 'budget_data_files/'

@app.route('/api/v1/budget/fileupload', methods=['POST', 'OPTIONS'])
def fileUpload():
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('POST, OPTIONS')
	if request.method == 'POST':
		print(request.files)
		file = request.files['file'] 
		filename = file.filename
		target = os.path.join(UPLOAD_FOLDER)
		destination="/".join([target, filename])
		file.save(destination)
		return _corsify_actual_response(processFile(filename))


def processFile(filename):
	# open file in read mode
	filepath = 'budget_data_files/' + filename;
	with open(filepath, 'r') as read_obj:
		# pass the file object to reader() to get the reader object
		csv_reader = reader(read_obj, delimiter=";")
		# Iterate over each row in the csv using reader object
		counter = 0
		for row in csv_reader:
			# jump header row
			if counter == 0:
				counter += 1
				continue
			# Überspringen, wenn es Spaces Buchungen sind
			if row[10] == 'yes':
				continue
			# row variable is a list that represents a row in csv
			print(row)
			valueInRappen = -100 * float(row[1])
			description = row[5]
			if valueInRappen < 0:
				cat = Categories.Incoming
				valueInRappen = -1 * valueInRappen
			else:
				cat = getCategoryFromLookUp(description)
			date = datetime. strptime(row[0], '%Y-%m-%d').date()
			subject = row[6]
			# save in DB
			entry = BudgetEntry(date = date, value = valueInRappen, category = cat.value, description = description, fileID = filepath)
			budgetSession.add(entry)
	budgetSession.commit()
	return jsonify("File processed with filepath %s" % filepath)

def stringifyCategoriesInEntries(entries):
	copy_entries = copy.deepcopy(entries)
	for entry in copy_entries:
		entry.category = str(Categories(entry.category))
	return copy_entries


