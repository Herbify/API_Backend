const prisma = require("../prisma");

class HerbalController {
  static async getHerbalList(req, res) {
    try {
      const data = await prisma.herbal.findMany();

      res.status(200).json({
        message: "Successfully get all herbal data",
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
      const { id } = req.params;

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

      const data = Object.assign(herbalData, { benefit: benefitData });

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
        image = "herbal-default.jpg",
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
      const { id } = req.params;

      res.status(201).json({
        message: `Successfully update herbal data with id = ${id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: "[Error]:updateHerbalById",
        error: error.message,
      });
    }
  }
}

module.exports = HerbalController;
