const Appointment = require("../models/AppointedModel");
const statusCodes = require("../utils/statusCode");
const messages = require("../utils/messages");

// Book an appointment
const bookAppointment = async (req, res) => {
    try {
      const { patient, dentist, date } = req.body;
  
      // Check if the dentist is available at the selected time
      const existingAppointment = await Appointment.findOne({ dentist, date });
      if (existingAppointment) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          message: "This time slot is already booked. Please choose another."
        });
      }
  
      const newAppointment = new Appointment({ patient, dentist, date });
      await newAppointment.save();
  
      res.status(STATUS_CODES.CREATED).json({
        message: MESSAGES.SUCCESS.CREATED,
        appointment: newAppointment
      });
    } catch (error) {
      res.status(STATUS_CODES.SERVER_ERROR).json({
        message: MESSAGES.ERROR.SERVER_ERROR,
        error: error.message
      });
    }
  };
  
  // Get all appointments for a user
  const getAppointments = async (req, res) => {
    try {
      const { patientId } = req.params;
      const appointments = await Appointment.find({ patient: patientId }).populate("dentist");
  
      res.status(STATUS_CODES.SUCCESS).json(appointments);
    } catch (error) {
      res.status(STATUS_CODES.SERVER_ERROR).json({
        message: MESSAGES.ERROR.SERVER_ERROR,
        error: error.message
      });
    }
  };
  
 // Cancel appointment function
const cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
  
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found." });
      }
  
      // Delete or mark the appointment as canceled
      await Appointment.findByIdAndDelete(appointmentId);
      res.status(200).json({ message: "Appointment canceled successfully." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  
  module.exports = { bookAppointment, getAppointments, cancelAppointment };