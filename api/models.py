from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy import create_engine

Base = declarative_base()

class Task(Base):
    __tablename__ = 'task'


    id = Column(Integer, primary_key = True)
    name = Column(String(80), nullable = False)
    days_repeat = Column(Integer, nullable = False)
    last_reset = Column(DateTime, default=func.now())

    @property
    def serialize(self):
       """Return object data in easily serializeable format"""
       return {
       	    'id': self.id,
            'name': self.name,
            'days_repeat': self.days_repeat,
            'last_reset': self.last_reset
       }
 


engine = create_engine('sqlite:///db/tasks.db')
Base.metadata.create_all(engine)