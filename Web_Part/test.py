from pymongo import MongoClient

def get_all_collections(uri):
    client = MongoClient(uri)
    db = client.get_default_database()  # Get the default database (often 'admin')
    collections = db.list_collection_names()  # Get a list of all collection names
    return collections

if __name__ == "__main__":
    # Replace 'mongodb://username:password@localhost:27017/' with your MongoDB connection URI
    uri = 'mongodb://localhost:27017/'
    
    all_collections = get_all_collections(uri)
    print("Collections in the database:")
    for collection in all_collections:
        print(collection)
