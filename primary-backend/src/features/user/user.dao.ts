import User from "./user.model";
import { TUser } from "./user.type";

class UserDAO {
  async createUser(userData: TUser) {
    return await User.create(userData);
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }

  async findUserById(id: string) {
    return await User.findById(id);
  }
}

export default new UserDAO();
