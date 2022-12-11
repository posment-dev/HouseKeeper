import time

from flask import Flask, request, jsonify, make_response
from sqlalchemy.sql import func
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Task


engine = create_engine('sqlite:///tasks.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

app = Flask(__name__)

@app.route('/api/v1/tasks', methods = ['GET', 'POST'])
def tasks():
	if request.method == 'GET':
		return _corsify_actual_response(getAllTasks())
	if request.method == 'POST':
		print("Making a new taks")
		name = request.args.get('name', '')
		days_repeat = request.args.get('days_repeat', '')
		print(name)
		print(days_repeat)
		return _corsify_actual_response(makeANewTask(name, days_repeat))


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
		print(name)
		print(days_repeat)
		return _corsify_actual_response(updateTask(id, name, days_repeat))
	if request.method == 'DELETE':
		return _corsify_actual_response(deleteTask(id))


@app.route('/api/v1/tasks/reset/<int:id>', methods = ['PUT', 'OPTIONS'])
def reset_taks(id):
	if request.method == 'OPTIONS':
		return _build_cors_preflight_response('PUT, OPTIONS')
	if request.method == 'PUT':
		return _corsify_actual_response(resetTask(id))


def getAllTasks():
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

def _corsify_actual_response(response):
	response.headers.add("Access-Control-Allow-Origin", "*")
	return response

def _build_cors_preflight_response(allowed_methods):
	response = make_response()
	response.headers.add("Access-Control-Allow-Origin", "*")
	response.headers.add('Access-Control-Allow-Headers', "*")
	response.headers.add('Access-Control-Allow-Methods', allowed_methods)
	return response
