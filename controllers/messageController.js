const { mutation } = require("../constant/static");
const prisma = require("../prisma");

class MessageController {
  static async getAllConversations(req, res) {
    try {
      const { status = 0 } = req.query;

      const message = await prisma.messageGroup.findMany({
        where: {
          status: Number(status),
        },
        include: {
          Message: true,
        },
      });
      const data = await Promise.all(
        message.map(async (m) => {
          const user = await prisma.user.findFirst({
            where: {
              id: Number(m.userId),
            },
            select: {
              id: true,
              name: true,
              photo: true,
              email: true,
              status: true,
            },
          });
          const doctor = await prisma.doctor.findFirst({
            where: {
              id: Number(m.doctorId),
            },
            select: {
              id: true,
              name: true,
              photo: true,
              email: true,
              status: true,
            },
          });
          return {
            id: m.id,
            user,
            doctor,
            finish: m.finish,
            status: m.status,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            messages: m.Message,
          };
        })
      );

      res.status(200).json({
        message: `Successfully get all conversation`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getUserConversation",
        error: error.message,
      });
    }
  }
  static async getConversationById(req, res) {
    try {
      const { id } = req.params;

      const message = await prisma.messageGroup.findMany({
        where: {
          userId: Number(id),
        },
        include: {
          Message: true,
        },
      });

      const data = await Promise.all(
        message.map(async (m) => {
          const user = await prisma.user.findFirst({
            where: {
              id: Number(m.userId),
            },
            select: {
              id: true,
              name: true,
              photo: true,
              email: true,
              status: true,
            },
          });
          const doctor = await prisma.doctor.findFirst({
            where: {
              id: Number(m.doctorId),
            },
            select: {
              id: true,
              name: true,
              photo: true,
              email: true,
              status: true,
            },
          });
          return {
            id: m.id,
            user,
            doctor,
            finish: m.finish,
            status: m.status,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
            messages: m.Message,
          };
        })
      );

      res.status(200).json({
        message: `Successfully get conversations with userId = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getUserConversationById",
        error: error.message,
      });
    }
  }

  static async sendMessage(req, res) {
    try {
      const {
        messageGroupId,
        sender,
        recipient,
        content,
        fromUser = true,
      } = req.body;

      if (!messageGroupId) {
        return res.status(400).json({
          message: "messageGroupId is required",
        });
      }
      if (!sender) {
        return res.status(400).json({
          message: "sender is required",
        });
      }
      if (!recipient) {
        return res.status(400).json({
          message: "recipient is required",
        });
      }
      if (!content) {
        return res.status(400).json({
          message: "content is required",
        });
      }

      if (fromUser) {
        const user = await prisma.user.findFirst({
          where: {
            id: Number(sender),
          },
        });
        if (!user) {
          return res.status(400).json({
            message: `User with id = ${sender} not found`,
          });
        }
      } else {
        const doctor = await prisma.user.findFirst({
          where: {
            id: Number(recipient),
          },
        });
        if (!doctor) {
          return res.status(400).json({
            message: `User with id = ${recipient} not found`,
          });
        }
      }

      const data = await prisma.message.create({
        data: {
          messageGroupId,
          sender: Number(sender),
          recipient: Number(recipient),
          content,
          fromUser,
        },
      });

      res.status(201).json({
        message: `Successfully send a message`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:sendMessage",
        error: error.message,
      });
    }
  }

  static async createMessageRoom(req, res) {
    try {
      const { idUser, idDoctor } = req.body;

      if (!idUser) {
        return res.status(400).json({
          message: "idUser is required",
        });
      }
      if (!idDoctor) {
        return res.status(400).json({
          message: "idDoctor is required",
        });
      }

      const data = await prisma.messageGroup.create({
        data: {
          userId: Number(idUser),
          doctorId: Number(idDoctor),
        },
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        message: "[Error]:createMessageRoom",
        error: error.message,
      });
    }
  }

  static async finishChat(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "Params `id` is required",
        });
      }

      const data = await prisma.messageGroup.update({
        where: {
          id: Number(id),
        },
        data: {
          finish: true,
        },
      });

      res.status(201).json({
        message: `Successfully finishing chat with messageGroupId = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:finishChat",
        error: error.message,
      });
    }
  }

  static async getUserMessageRoom(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "Params `id` is required",
        });
      }

      const room = await prisma.messageGroup.findFirstOrThrow({
        where: {
          userId: Number(id),
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: Number(room.userId),
        },
        select: {
          id: true,
          name: true,
          photo: true,
          email: true,
          status: true,
        },
      });
      const doctor = await prisma.doctor.findFirstOrThrow({
        where: {
          id: Number(room.doctorId),
        },
        select: {
          id: true,
          name: true,
          photo: true,
          email: true,
          status: true,
        },
      });
      const data = Object.assign(room, { user, doctor });

      res.status(200).json({
        message: `Successfully get message room with userId = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getUserMessageRoom",
        error: error.message,
      });
    }
  }

  static async getPayment(req, res) {
    try {
      const data = mutation;
      res.status(200).json({ message: "Successfully get mutation data", data });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getUserMessageRoom",
        error: error.message,
      });
    }
  }
}

module.exports = MessageController;
