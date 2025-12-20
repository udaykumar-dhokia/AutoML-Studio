import jwt from "jsonwebtoken";

class JWT {
  createToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  };

  verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  };
}

export default new JWT();
