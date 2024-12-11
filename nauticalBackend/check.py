from pymongo import MongoClient

client = MongoClient("mongodb+srv://sanjayanandharajan04:4YAEhm7Jq4xdqEnr@cluster0.1p4dv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Nautical_Now']
collection = db['users_nautical_now']
print(collection.find_one())
