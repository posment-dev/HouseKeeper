from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from constants import DB_LOCATION

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