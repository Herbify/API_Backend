const validator = require("validator");
const bcrypt = require("bcrypt");
const {
  generateToken,
  verifyToken
} = require("../services/auth");
const prisma = require("../prisma");
const sendEmailOTP = require("../services/mailer");

class AuthController {
  static async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[0];

      if (token === null) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      const decoded = await verifyToken(token);
      req.user = decoded;

      next();
    } catch (error) {
      res.status(403).json({
        message: "Invalid token"
      });
    }
  }
  static async userRegistration(req, res) {
    try {
      const {
        name,
        email,
        password
      } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }
      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Email format is invalid",
        });
      }
      if (!password) {
        return res.status(400).json({
          message: "Password is required",
        });
      }
      if (!validator.isLength(password, {
          min: 6
        })) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      const count = await prisma.user.count({
        where: {
          email,
        },
      });
      if (count === 1) {
        return res.status(404).json({
          message: "Error, user has been registered!",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const data = await prisma.user.create({
        data: {
          name,
          photo: "default.jpg",
          email,
          password: hashPassword,
        },
      });
      await sendEmailOTP(data.email);

      res.status(201).json({
        message: "User has been created",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:userRegistration",
        error: error.message,
      });
    }
  }
  static async userLogin(req, res) {
    try {
      const {
        email,
        password
      } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          message: "Email format is invalid",
        });
      }
      if (!password) {
        return res.status(400).json({
          message: "Password is required",
        });
      }

      const data = await prisma.user.findFirst({
        where: {
          email
        },
      });
      if (!data) {
        return res.status(400).json({
          message: "User has not been registered",
        });
      }

      const verifyPassword = await bcrypt.compare(password, data.password);
      if (!verifyPassword) {
        return res.status(400).json({
          message: "Password is incorrect",
        });
      }

      const accessToken = await generateToken({
        id: data.id,
        email: data.email,
      });
      console.log({
        accessToken
      });

      res.status(200).json({
        message: "Successfully logged in",
        accessToken,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:userLogin",
        error: error.message,
      });
    }
  }
  static async requestOTP(req, res) {
    try {
      const {
        id
      } = req.params;

      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: Number(id),
        },
      });
      const data = await sendEmailOTP(user.email);

      res.status(201).json({
        message: `Successfully generate and send email for OTP with userId = ${id}`,
        email: user.email,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:requestOTP",
        error: error.message,
      });
    }
  }
  static async getOTP(req, res) {
    try {
      const {
        id
      } = req.params;

      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: Number(id),
        },
      });

      const data = await prisma.otp.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.json({
        message: `Successfully get OTP with userId = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getOTP",
        error: error.message,
      });
    }
  }
  static async verifyOTP(req, res) {
    try {
      const {
        email,
        code
      } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          message: "You must fill in email and code",
        });
      }

      const user = await prisma.user.findFirstOrThrow({
        where: {
          email,
        },
      });

      const otp = await prisma.otp.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (code != otp.code) {
        return res.status(400).json({
          message: "OTP Invalid",
        });
      }

      const data = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: Number(1),
        },
      });

      res.status(200).json({
        message: "Successfully verified an account",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:verifyOTP",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;