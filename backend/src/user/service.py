from src import database
from bson import ObjectId

class UserService:
    
    def get_user_by_id(self, user_id: str):
        user = database.db.users.find_one({"_id": ObjectId(user_id)})
        return user
        