import bcrypt from "bcryptjs";

class Hash {
  createHash = (password: string) => {
    return bcrypt.hashSync(password, 10);
  };

  compareHash = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash);
  };
}

export default new Hash();
