from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from constants import DB_LOCATION, DB_BUDGET_LOCATION

Base = declarative_base()

class Task(Base):
    __tablename__ = 'task'


    id = Column(Integer, primary_key = True)
    name = Column(String(80), nullable = False)
    days_repeat = Column(Integer, nullable = False)
    last_reset = Column(DateTime, default=func.now())
    pause = relationship('Pause', backref='task', lazy = True)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'name': self.name,
            'days_repeat': self.days_repeat,
            'last_reset': self.last_reset,
            'pause': [i.serialize for i in self.pause]
        }
 

class Pause(Base):
    __tablename__ = 'pause'

    id = Column(Integer, primary_key = True)
    taskId = Column(Integer, ForeignKey('task.id'))
    starting = Column(DateTime, default = func.now())
    duration = Column(Integer, nullable = False)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'taskId': self.taskId,
            'starting': self.starting,
            'duration': self.duration
        }

engine = create_engine(DB_LOCATION)
Base.metadata.create_all(engine)

BudgetBase = declarative_base()

class BudgetEntry(BudgetBase):
    __tablename__ = 'budget_entries'


    id = Column(Integer, primary_key = True)
    value = Column(BigInteger, nullable = False)
    category = Column(Integer, nullable = False)
    date = Column(String(10), default=func.now())
    description = Column(String(80), nullable = False)
    fileID = Column(String(30), nullable = True)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'id': self.id,
            'value': self.value,
            'category': self.category,
            'date': self.date,
            'description': self.description,
            'fileID': self.fileID
        }

class DefaultCategory(BudgetBase):
    __tablename__ = 'default_category'


    description = Column(String(80), primary_key = True)
    category = Column(Integer, nullable = False)

    @property
    def serialize(self):
        """Return object data in easily serializeable format"""
        return {
            'description': self.description,
            'category': self.category
        }

budgetEngine = create_engine(DB_BUDGET_LOCATION)
BudgetBase.metadata.create_all(budgetEngine)