import { httpStatus } from "../../utils/httpStatus";
import userDao from "./user.dao";

const userController = {
  getUser: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    try {
      const user = await userDao.findUserById(userId);
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ message: "User not found" });
      }
      return res.status(httpStatus.OK).json({ user });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  },
};
export default userController;
