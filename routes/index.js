const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { bookAppointment, getAppointments, cancelAppointment,getAvailableSlots } = require("../controllers/appointmentController"); 
const { protect } = require("../middlewares/authMiddleware");
const { addDentist, getDentists } = require("../controllers/dentistController");

const router = express.Router();

// Authentication Routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
// User Profile Routes
router.get("/user/profile", protect, getUserProfile);
router.put("/user/profile", protect, updateUserProfile);
//apppointments
router.post("/appointments", protect, bookAppointment);
router.get("/appointments", protect, getAppointments); 
router.put("/appointments/cancel/:appointmentId", cancelAppointment);
router.get("/appointments/slots/:dentistId", getAvailableSlots);


router.post("/dentists", addDentist); 
router.get("/dentists", getDentists); 

module.exports = router;
