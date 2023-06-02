const prisma = require("../prisma");
const Multer = require("multer");
const path = require("path");
const {
  Storage
} = require('@google-cloud/storage');

const storage = new Storage({
  keyFilename: './cloud-storage-configuration.json',
});

class HerbalController {
  static async getHerbalList(req, res) {
    try {
      const {
        limit = 10, page = 1
      } = req.query;

      const offset = (page - 1) * limit;
      const data = await prisma.herbal.findMany({
        take: Number(limit),
        skip: Number(offset),
      });

      res.status(200).json({
        message: "Successfully get all herbal data",
        limit: Number(limit),
        page: Number(page),
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getHerbalList",
        error: error.message,
      });
    }
  }
  static async getHerbalById(req, res) {
    try {
      const {
        id
      } = req.params;

      const herbalData = await prisma.herbal.findFirstOrThrow({
        select: {
          id: true,
          name: true,
          scientificName: true,
          image: true,
          description: true,
          benefit: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: Number(id),
        },
      });

      const benefit = herbalData.benefit;
      const dataArray = benefit.split(",").map((item) => item.trim());
      const jsonObject = {};

      for (let i = 0; i < dataArray.length; i++) {
        jsonObject[`${i + 1}`] = dataArray[i];
      }
      const jsonData = JSON.stringify(jsonObject, null, 2);
      const benefitData = JSON.parse(jsonData);

      const data = Object.assign(herbalData, {
        benefit: benefitData
      });

      res.status(200).json({
        message: `Successfully get herbal with id = ${id}`,
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:getHerbalList",
        error: error.message,
      });
    }
  }
  static async addHerbal(req, res) {
    try {
      const {
        name,
        scientificName,
        description,
        benefit,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Herbal name is required",
        });
      }
      if (!scientificName) {
        return res.status(400).json({
          message: "Scientific herbal name is required",
        });
      }
      if (!description) {
        return res.status(400).json({
          message: "Description herbal is required",
        });
      }

      let image = 'https://storage.googleapis.com/herbify/herbal/default-herbal.jpeg';
      if (req.file) {
        const bucketName = 'herbify';
        const fileName = `herbal/${Date.now()}`;
        const storageBucket = storage.bucket(bucketName);
        const file = storageBucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });
        image = `https://storage.googleapis.com/herbify/${fileName}`;
      }

      const data = await prisma.herbal.create({
        data: {
          name,
          scientificName,
          image,
          description,
          benefit,
        },
      });

      res.status(201).json({
        message: "Successfully create new herbal",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:addHerbal",
        error: error.message,
      });
    }
  }
  static async updateHerbalById(req, res) {
    try {
      const {
        id
      } = req.params;
      const {
        name,
        scientificName,
        description,
        benefit
      } = req.body;

      if (!req.file) {
        const data = await prisma.herbal.update({
          where: {
            id: Number(id),
          },
          data: {
            name,
            scientificName,
            description,
            benefit,
          },
        });
        return res.status(201).json({
          message: `Successfully update herbal without image and id = ${id}`,
          data,
        });
      } else {
        const bucketName = 'herbify';
        const fileName = `herbal/${Date.now()}`;
        const storageBucket = storage.bucket(bucketName);
        const file = storageBucket.file(fileName);

        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        const data = await prisma.herbal.update({
          where: {
            id: Number(id),
          },
          data: {
            name,
            scientificName,
            image: `https://storage.googleapis.com/herbify/${fileName}`,
            description,
            benefit,
          },
        });
        return res.status(201).json({
          message: `Successfully update herbal with image and id = ${id}`,
          data,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "[Error]:updateHerbalById",
        error: error.message,
      });
    }
  }
}

module.exports = HerbalController;