from src.models.user_model import User, UserLogin
from src import database
from src.utils.hash import Hash

class AuthService:

    def register(self, user: User):
        
        user.password = Hash.hash_password(user.password)
        
        user_dict = user.dict(exclude={"_id"})

        result = database.db.users.insert_one(user_dict)

        return result.inserted_id
    
    def login(self, user: UserLogin):
        result = database.db.users.find_one({"email": user.email})
        
        if not result:
            return None
        if not Hash.verify_password(user.password, result["password"]):
            return None
        
        return User(**result)

    def get_user_by_email(self, email:str):
        return database.db.users.find_one({"email": email})