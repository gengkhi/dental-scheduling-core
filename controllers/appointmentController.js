const Appointment = require("../models/AppointedModel");
const mongoose = require("mongoose");

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { patient, dentist, date, email } = req.body;

    const existingAppointment = await Appointment.findOne({ dentist, date });
    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked. Please choose another.",
      });
    }

    const newAppointment = new Appointment({ patient, dentist, date, email });
    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully.",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all appointments for a user (using patientId as a URL parameter)
const getAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Ensure valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

    const appointments = await Appointment.find({ patient: patientId }).populate("dentist");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get available time slots for a dentist
const getAvailableSlots = async (req, res) => {
  try {
    const { dentistId } = req.params;
    const allSlots = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    ];

    const existingAppointments = await Appointment.find({ dentist: dentistId });

    const bookedSlots = existingAppointments.map(appt => appt.date);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Cancel appointment function
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({
      message: "Appointment canceled successfully.",
    });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { bookAppointment, getAppointments, cancelAppointment, getAvailableSlots };
