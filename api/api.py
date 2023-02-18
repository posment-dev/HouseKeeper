from flask import Flask, request, jsonify, json, make_response
from sqlalchemy.sql import func
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Task, Pause
from constants import DB_LOCATION
from datetime import datetime, timezone, timedelta


engine = create_engine(DB_LOCATION)
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

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