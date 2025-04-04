const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getUserId
} = require("../controllers/userController");
const { bookAppointment, getAppointments, cancelAppointment,getAvailableSlots,updateAppointment } = require("../controllers/appointmentController"); 
const { protect } = require("../middlewares/authMiddleware");
const { addDentist, getDentists } = require("../controllers/dentistController");

const router = express.Router();

// Authentication Routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/getUserId", getUserId);

// User Profile Routes
router.get("/user/get/profile", protect, getUserProfile);
router.put("/user/profile", protect, updateUserProfile);
router.put("/password", protect, changeUserPassword);

//apppointments
router.post("/appointments", protect, bookAppointment);
router.get("/appointments/:patientId", getAppointments); 
router.delete("/cancel/:appointmentId", cancelAppointment);
router.get("/appointments/slots/:dentistId", getAvailableSlots);
router.put("/appointments/:appointmentId", updateAppointment);


router.post("/dentists", addDentist); 
router.get("/dentists", getDentists); 

module.exports = router;
