const prisma = require("../prisma");

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
  static async createUser(req, res) {
    try {
      const { name, email, password, status } = req.body;

      res.status(201).json({
        message: "Successfully created new user",
        name,
        email,
        password,
        status,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:createUser",
        error: error.message,
      });
    }
  }
}

// const createUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         message: "Name is required",
//       });
//     }
//     if (!email) {
//       return res.status(400).json({
//         message: "Email is required",
//       });
//     }
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         message: "Email format is invalid",
//       });
//     }
//     if (!password) {
//       return res.status(400).json({
//         message: "Password is required",
//       });
//     }
//     if (!validator.isLength(password, { min: 6 })) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const count = await prisma.user.count({
//       where: {
//         email,
//       },
//     });
//     if (count === 1) {
//       return res.status(404).json({
//         message: "Error, user has been registered!",
//       });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);
//     const data = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashPassword,
//       },
//     });

//     res.status(201).json({
//       message: "User has been created",
//       data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to create users",
//       error: err.message,
//     });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         message: "Email is required",
//       });
//     }
//     if (!validator.isEmail(email)) {
//       return res.status(400).json({
//         message: "Email format is invalid",
//       });
//     }
//     if (!password) {
//       return res.status(400).json({
//         message: "Password is required",
//       });
//     }

//     const data = await prisma.user.findFirst({
//       where: { email },
//     });
//     if (!data) {
//       return res.status(400).json({
//         message: "User has not been registered",
//       });
//     }

//     const verifyPassword = await bcrypt.compare(password, data.password);
//     if (!verifyPassword) {
//       return res.status(400).json({
//         message: "Password is incorrect",
//       });
//     }

//     const accessToken = generateToken({ id: data.id, email: data.email });

//     res.status(200).json({
//       message: "Successfully logged in",
//       accessToken,
//       data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to login",
//       error: err.message,
//     });
//   }
// };

module.exports = UserController;
