const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUser = async (req, res) => {
  const data = await prisma.user.findMany();

  res.json({
    message: "Get All User",
    data,
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const data = await prisma.user.findFirst({
    where: {
      id: Number(id),
    },
  });

  res.json({
    message: `Success get user by id = ${id}`,
    data,
  });
};

module.exports = {
  getAllUser,
  getUserById,
};
