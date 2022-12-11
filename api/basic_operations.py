import datetime
import os

from dotenv import load_dotenv
from pymongo import MongoClient

# Load config from a .env file:
load_dotenv()
MONGODB_URI = os.environ['MONGODB_URI']

# Connect to your MongoDB cluster:
client = MongoClient(MONGODB_URI)

# List all the databases in the cluster:
#for db_info in client.list_collection_names():
#   print(db_info)

db = client['TryMongoDB']
collections = db.list_collection_names()
for collection in collections:
   print(collection)

rounds = db['rounds']
print(rounds.find_one({'score': 70}))

test = db['test_collection']

# Insert a document for the movie 'Parasite':
insert_result = test.insert_one({
      "title": "Parasite",
      "year": 2020,
      "plot": "A poor family, the Kims, con their way into becoming the servants of a rich family, the Parks. "
      "But their easy life gets complicated when their deception is threatened with exposure.",
      "released": datetime.datetime(2020, 2, 7, 0, 0, 0),
   })

# Save the inserted_id of the document you just created:
test_id = insert_result.inserted_id
print("_id of inserted document: {test_id}".format(test_id=test_id))