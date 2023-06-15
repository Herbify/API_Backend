const {
  PrismaClient
} = require("@prisma/client");
const prisma = new PrismaClient();
const {
  Storage
} = require("@google-cloud/storage");
const Multer = require("multer");
const path = require("path");

const storage = new Storage({
  projectId: "herbify-387103",
  keyFilename: `./cloud-storage-configuration.json`,
});

const bucketName = "herbify";
const bucket = storage.bucket(bucketName);

const photoValidation = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // Batas ukuran file (2MB dalam contoh ini)
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    console.log(`extensi file ${fileExtension}`);
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PNG, JPG, and JPEG files are allowed."
        )
      );
    }
  },
});

class ArticleController {
  static async getAllArticle(req, res) {
    try {
      let data = [];

      const articles = await prisma.articles.findMany();

      for (const article of articles) {
        let like = await prisma.userActivities.count({
          where: {
            AND: [{
                activity: {
                  path: "$.articleId",
                  equals: Number(article.id),
                },
              },
              {
                status: 1,
              },
            ],
          },
        });
        data.push({
          article,
          numLike: like,
        });
      }

      res.status(200).json({
        message: "Successfully get all article",
        data,
      });
    } catch (error) {
      console.error("[Error]:getAllArticle", error);
      res.status(500).json({
        message: "[Error]:getAllArticle",
        error: error.message,
      });
    }
  }

  static async getArticleById(req, res) {
    try {
      const {
        id
      } = req.params;

      const data = await prisma.articles.findFirstOrThrow({
        where: {
          id: Number(id),
        },
      });

      const like = await prisma.userActivities.count({
        where: {
          AND: [{
              activity: {
                path: "$.articleId",
                equals: Number(id),
              },
            },
            {
              status: 1,
            },
          ],
        },
      });

      res.status(200).json({
        message: `Successfully get article by id = ${id}`,
        data,
        like,
      });
    } catch (error) {
      console.error("[Error]:getArticleById", error);
      res.status(500).json({
        message: "[Error]:getArticleById",
        error: error.message,
      });
    }
  }

  static async createArticle(req, res) {
    try {
      await new Promise((resolve, reject) => {
        photoValidation.single("photo")(req, res, (err) => {
          if (err) {
            return res
              .status(400)
              .json({
                message: err.message,
                from: "PhotoValidation"
              });
          } else {
            resolve();
          }
        });
      });

      const {
        idUser,
        title,
        content,
        tag
      } = req.body;
      let publicUrl;

      if (!idUser) {
        return res.status(400).json({
          message: "idUser is required",
        });
      }
      if (!title) {
        return res.status(400).json({
          message: "title is required",
        });
      }
      if (!content) {
        return res.status(400).json({
          message: "content is required",
        });
      }

      if (req.file) {
        const folderName = "photoArticle"; // Nama folder di dalam bucket
        const fileName = `${folderName}/${Date.now()}-${req.file.originalname}`;

        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        const uploadToStorage = new Promise((resolve, reject) => {
          blobStream.on("finish", async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          });
          blobStream.on("error", (error) => {
            console.error(error);
            return res
              .status(500)
              .json({
                message: "An error occurred while uploading the file."
              });
            reject(error);
          });
        });

        blobStream.end(req.file.buffer);
        // Tunggu hingga publicUrl tersedia
        publicUrl = await uploadToStorage;
      }
      const data = await prisma.articles.create({
        data: {
          idUser: Number(idUser),
          title,
          content,
          photo: publicUrl,
          tag: JSON.parse(tag),
        },
      });

      res.status(201).json({
        message: `Successfully create article`,
        data,
      });
    } catch (error) {
      console.error("[Error]:createArticle", error);
      res.status(500).json({
        message: "[Error]:createArticle",
        error: error.message,
      });
    }
  }

  static async editArticle(req, res) {
    try {
      await new Promise((resolve, reject) => {
        photoValidation.single("photo")(req, res, (err) => {
          if (err) {
            return res
              .status(400)
              .json({
                message: err.message,
                from: "PhotoValidation"
              });
          } else {
            resolve();
          }
        });
      });

      const {
        id
      } = req.params;

      const {
        idUser,
        title,
        content,
        tag
      } = req.body;
      let publicUrl;

      if (req.file) {
        const folderName = "photoArticle"; // Nama folder di dalam bucket
        const fileName = `${folderName}/${Date.now()}-${req.file.originalname}`;

        //menghapus file sebelumnya
        let file = await prisma.articles.findUnique({
          where: {
            id: Number(id),
          },
        });

        file = file.photo.slice(52);
        const googleFile = await storage
          .bucket(bucketName)
          .file(`${folderName}/${file}`)
          .exists();

        console.log(googleFile);
        if (googleFile[0]) {
          await storage
            .bucket(bucketName)
            .file(`${folderName}/${file}`)
            .delete();
        }

        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
        const uploadToStorage = new Promise((resolve, reject) => {
          blobStream.on("finish", async () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          });
          blobStream.on("error", (error) => {
            console.error(error);
            reject(error);
            return res
              .status(500)
              .json({
                message: "An error occurred while uploading the file."
              });
          });
        });

        blobStream.end(req.file.buffer);
        // Tunggu hingga publicUrl tersedia
        publicUrl = await uploadToStorage;
      }

      const getArticle = await prisma.articles.findFirst({
        where: {
          id: Number(id)
        }
      });
      const tagValue = tag ? JSON.parse(tag) : getArticle.tag;
      //Mengupdate article dengan Prisma berdasarkan ID
      const data = await prisma.articles.update({
        where: {
          id: Number(id),
        },
        data: {
          idUser: Number(idUser),
          title,
          content,
          photo: publicUrl,
          tag: tagValue,
        },
      });

      res.status(201).json({
        message: `Successfully edit article with id = ${id}`,
        data,
      });
    } catch (error) {
      console.error("[Error]:editArticle", error);
      res.status(500).json({
        message: "[Error]:editArticle",
        error: error.message,
      });
    }
  }

  static async deleteArticle(req, res) {
    try {
      const {
        id
      } = req.params;

      // Delete article dengan Prisma berdasarkan ID
      const data = await prisma.articles.delete({
        where: {
          id: Number(id),
        },
      });

      if (data.photo) {
        const folderName = "photoArticle"; // Nama folder di dalam bucket
        const file = data.photo.slice(52);
        storage.bucket(bucketName).file(`${folderName}/${file}`).delete();
      }

      res.json({
        message: `Successfully delete article with id = ${id}`,
        data,
      });
      console.error("Success delete article");
    } catch (error) {
      console.error("[Error]:deleteArticle", error);
      res.status(500).json({
        message: "[Error]:deleteArticle",
        error: error.message,
      });
    }
  }

  static async getAllArticleByUserId(req, res) {
    try {
      const {
        id
      } = req.params;

      let data = [];
      const articles = await prisma.articles.findMany({
        where: {
          idUser: Number(id),
        },
      });

      for (const article of articles) {
        let like = await prisma.userActivities.count({
          where: {
            AND: [{
                activity: {
                  path: "$.articleId",
                  equals: Number(article.id),
                },
              },
              {
                status: 1,
              },
            ],
          },
        });
        data.push({
          article,
          numLike: like,
        });
      }

      res.status(200).json({
        message: `Successfully get all articles with userId = ${id}`,
        data,
      });
    } catch (error) {
      console.error("[Error]:getAllArticleByUserId", error);
      res.status(500).json({
        message: "[Error]:getAllArticleByUserId",
        error: error.message,
      });
    }
  }

  static async likeArticle(req, res) {
    try {
      const {
        id
      } = req.params;
      const {
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          message: "userId param is required",
        });
      }

      const userActivity = await prisma.userActivities.findFirst({
        where: {
          AND: [{
              userId: Number(userId),
            },
            {
              activity: {
                path: "$.articleId",
                equals: Number(id),
              },
            },
          ],
        },
      });

      if (!userActivity) {
        const data = await prisma.userActivities.create({
          data: {
            userId: Number(userId),
            type: "like",
            activity: {
              articleId: Number(id),
            },
            status: 1,
          },
        });

        res.json({
          message: `Successfully like article with userId = ${userId}`,
          data,
        });
      } else {
        const idActivity = userActivity.id;
        if (userActivity.status == 0) {
          const data = await prisma.userActivities.update({
            where: {
              id: Number(idActivity),
            },
            data: {
              status: 1,
            },
          });

          res.json({
            message: `Successfully like article with userId = ${userId}`,
            data,
          });
        } else {
          const data = await prisma.userActivities.update({
            where: {
              id: Number(idActivity),
            },
            data: {
              status: 0,
            },
          });

          res.json({
            message: `Success dislike article with userId = ${userId}`,
            data,
          });
        }
      }
    } catch (error) {
      console.error("[Error]:likeArticle", error);
      res.status(500).json({
        message: "[Error]:likeArticle",
        error: error.message,
      });
    }
  }
}

module.exports = ArticleController;