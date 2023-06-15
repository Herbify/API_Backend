const prisma = require("../prisma");
const validator = require("validator");
const bcrypt = require("bcrypt");

class DoctorController {
    static async getDoctorList(req, res) {
        try {
            const data = await prisma.doctor.findMany();

            res.status(200).json({
                message: "Successfully get doctor list",
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:getDoctorList",
                error: error.message,
            });
        }
    }

    static async getDoctorById(req, res) {
        try {
            const {
                id
            } = req.params;

            const data = await prisma.doctor.findFirstOrThrow({
                where: {
                    id: Number(id),
                },
            });

            res.status(200).json({
                message: `Successfully get doctor with id = ${id}`,
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:getDoctorById",
                error: error.message,
            });
        }
    }

    static async createDoctor(req, res) {
        try {
            const {
                name,
                photo = "default-doctor.jpg",
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

            const hashPassword = await bcrypt.hash(password, 10);
            const data = await prisma.doctor.create({
                data: {
                    name,
                    photo,
                    email,
                    password: hashPassword,
                },
            });

            res.status(201).json({
                message: `Successfully create doctor`,
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:createDoctor",
                error: error.message,
            });
        }
    }

    static async updateDoctor(req, res) {
        try {
            const {
                id
            } = req.params;
            const {
                name,
                email,
                photo,
                password
            } = req.body;

            const update = {
                name,
                email,
                photo
            };
            if (password) update.password = await bcrypt.hash(password, 10);
            const data = await prisma.doctor.update({
                where: {
                    id: Number(id),
                },
                data: update,
            })

            res.status(201).json({
                message: `Successfully update doctor with id = ${id}`,
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:updateDoctor",
                error: error.message,
            });
        }
    }

    static async deleteDoctor(req, res) {
        try {
            const {
                id
            } = req.params;

            const doctor = await prisma.doctor.findFirst({
                where: {
                    id: Number(id),
                },
            });
            if (!doctor) {
                return res.status(400).json({
                    message: `Doctor with id = ${id} not found!`
                });
            }

            const data = await prisma.doctor.delete({
                where: {
                    id: Number(doctor.id),
                },
            });

            res.status(200).json({
                message: `Successfully delete doctor with id = ${id}`,
                data,
            });
        } catch (error) {
            res.status(500).json({
                message: "[Error]:updateDoctor",
                error: error.message,
            });
        }
    }
}
module.exports = DoctorController;