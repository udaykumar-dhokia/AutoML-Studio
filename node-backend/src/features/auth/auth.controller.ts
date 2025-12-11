import userDao from "../user/user.dao";
import { httpStatus } from "../../utils/httpStatus";
import jwt from "../../utils/jwt";
import hash from "../../utils/hash";

const authController = {
  register: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    try {
      const user = await userDao.findUserByEmail(email);
      if (user) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "User already exists" });
      }

      const hashedPassword = await hash.createHash(password);

      const newUser = await userDao.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const token = await jwt.createToken(newUser._id.toString());

      res.cookie("token", token);

      return res
        .status(httpStatus.CREATED)
        .json({ message: "User registered successfully" });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "All fields are required" });
    }

    try {
      const user = await userDao.findUserByEmail(email);
      if (
        !user ||
        (await hash.compareHash(password, user.password)) === false
      ) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Incorrect email or password" });
      }

      const token = await jwt.createToken(user._id.toString());

      res.cookie("token", token);

      return res
        .status(httpStatus.OK)
        .json({ message: "User logged in successfully" });
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },
};

export default authController;
