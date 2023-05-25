const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllArticle = async (req, res) => {
  try {
    let data = [];

    const articles = await prisma.articles.findMany();

    for (const article of articles) {
      let like = await prisma.userActivities.count({
        where: {
          AND: [
            {
              activity: {
                path: '$.articleId',
                equals: Number(article.id),
              }
            },
            {
              status: 1,
            },
          ]
        }
      });
      data.push({
        article,
        numLike: like
      })
    }

    res.status(200).json({
      message: "Get All Articles",
      data,
    });
    console.error("Get All Articles");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unsuccessful get all article' });
  }

};

const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await prisma.articles.findFirst({
      where: {
        id: Number(id),
      },
    });

    const numLike = await prisma.userActivities.count({
      where: {
        AND: [
          {
            activity: {
              path: '$.articleId',
              equals: Number(id),
            }
          },
          {
            status: 1,
          },
        ]
      }
    });

    res.status(200).json({
      message: `Success get article by id = ${id}`,
      data, numLike
    });
    console.error('Success get article by id');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unsuccessful get article by id' });
  }

};

const createArticle = async (req, res) => {
  try {
    const { idUser, title, content, photo, tag } = req.body;

    if (!idUser) {
      return res.status(400).json({
        message: "idUser is required"
      })
    }
    if (!title) {
      return res.status(400).json({
        message: "title is required"
      })
    }
    if (!content) {
      return res.status(400).json({
        message: "content is required"
      })
    }

    // Menyimpan article baru ke database menggunakan Prisma
    const data = await prisma.articles.create({
      data: {
        idUser,
        title,
        content,
        photo,
        tag,
      },
    });

    res.status(201).json({
      message: `Success create article`,
      data,
    });
    console.error("success create article");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Create article was failure' });
  }
};
const editArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { idUser, title, content, photo, tag } = req.body;

    // Mengupdate article dengan Prisma berdasarkan ID
    const data = await prisma.articles.update({
      where: {
        id: Number(id),
      },
      data: {
        idUser,
        title,
        content,
        photo,
        tag,
        updatedAt: new Date(),
      },
    });

    res.status(201).json({
      message: `Success edit article = ${id}`,
      data,
    });
    console.error("Success edit article");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Edit article was failure' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete article dengan Prisma berdasarkan ID
    const data = await prisma.articles.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: `Success delete article by id = ${id}`,
      data,
    });
    console.error("Success delete article");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Delete article was failure' });
  }
};

const getAllArticleByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    let data = [];
    const articles = await prisma.articles.findMany({
      where: {
        idUser: Number(id),
      },
    });

    for (const article of articles) {
      let like = await prisma.userActivities.count({
        where: {
          AND: [
            {
              activity: {
                path: '$.articleId',
                equals: Number(article.id),
              }
            },
            {
              status: 1,
            },
          ]
        }
      });
      data.push({
        article,
        numLike: like
      })
    }

    res.status(200).json({
      message: `Get All Articles by Userid = ${id}`,
      data,
    });
    console.error("Get All Articles by UserId");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Get All article by UserId was failure' });
  }
}

const likeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId param is required"
      })
    }

    const userActivity = await prisma.userActivities.findFirst({
      where: {
        AND: [
          {
            userId: Number(userId),
          },
          {
            activity: {
              path: '$.articleId',
              equals: Number(id),
            }
          }
        ]
      }
    })

    if (!userActivity) {
      const data = await prisma.userActivities.create({
        data: {
          userId: Number(userId),
          type: "like",
          activity: {
            articleId: Number(id)
          },
          status: 1
        }
      });

      res.json({
        message: `Success like article by userId = ${userId}`,
        data,
      });
    } else {
      const idActivity = userActivity.id
      if (userActivity.status == 0) {
        const data = await prisma.userActivities.update({
          where: {
            id: Number(idActivity)
          },
          data: {
            status: 1,
            updatedAt: new Date(),
          }
        });

        res.json({
          message: `Success like article by userId = ${userId}`,
          data,
        });
      } else {
        const data = await prisma.userActivities.update({
          where: {
            id: Number(idActivity)
          },
          data: {
            status: 0,
            updatedAt: new Date(),
          }
        });

        res.json({
          message: `Success dislike article by userId = ${userId}`,
          data,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'like/dislike article was failure' });
  }
}

module.exports = {
  getAllArticle,
  getArticleById,
  createArticle,
  editArticle,
  deleteArticle,
  getAllArticleByUserId,
  likeArticle,
};
