const prisma = require("../prisma");
const bcrypt = require("bcrypt");

class UserController {
  static async getAllUser(req, res) {
    try {
      const data = await prisma.user.findMany();

      res.json({
        message: "Successfully get users",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getAllUser",
        error: error.message,
      });
    }
  }
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const data = await prisma.user.findFirst({
        where: {
          id: Number(id),
        },
      });

      res.json({
        message: `Successfully get user by id = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getUserById",
        error: error.message,
      });
    }
  }
  static async getUserByEmail(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({
          message: "Params email is undefined",
        });
      }

      const data = await prisma.user.findFirstOrThrow({
        where: {
          email,
        },
      });

      res.status(200).json({
        message: `Successfully get user with email = ${email}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getUserByEmail",
        error: error.message,
      });
    }
  }
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, photo, email } = req.body;
      let { password } = req.body;

      if (password) {
        password = await bcrypt.hash(password, 10);
      }
      const data = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          photo,
          email,
          password,
        },
      });

      res.status(201).json({
        message: `Successfully update user with id = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:updateUser",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
