const express = require("express");
const DoctorController = require("../controllers/doctorController");
const doctorRoute = express.Router();

doctorRoute.get("/", DoctorController.getDoctorList);
doctorRoute.get("/:id", DoctorController.getDoctorById);
doctorRoute.post("/", DoctorController.createDoctor);
doctorRoute.put("/:id", DoctorController.updateDoctor);
doctorRoute.delete("/:id", DoctorController.deleteDoctor);

module.exports = doctorRoute;