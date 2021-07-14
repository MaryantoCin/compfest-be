import express from "express";

import {
  createUser,
  login,
  profile,
  test,
} from "../controller/userController.js";
import {
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getAppointments,
  getAppointmentsById,
  getUserInAppointment,
  registerAppoinment,
  updateAppointment,
} from "../controller/appointmentController.js";

import { checkAdmin } from "../middleware/checkAdmin.js";
import { checkLogin } from "../middleware/checkLogin.js";

const router = express.Router();

router.post("/profile", [checkLogin], profile);
router.post("/auth/register", createUser);
router.post("/auth/login", login);

router.get("/appointment", [checkAdmin], getAppointments);
router.post("/appointment", [checkAdmin], createAppointment);
router.patch("/appointment/:id", [checkAdmin], updateAppointment);
router.delete("/appointment/:id", [checkAdmin], deleteAppointment);
router.get("/appointment/:id", [checkAdmin], getAppointmentsById);

router.post("/appointment/:id/register", [checkLogin], registerAppoinment);
router.post("/appointment/:id/cancel", [checkLogin], cancelAppointment);
router.get("/appointment/:id/registrants", [checkLogin], getUserInAppointment);

export default router;
