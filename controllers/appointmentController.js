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

// Get all appointments for a user
const getAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

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

// const getAvailableSlots = async (req, res) => {
//   try {
//     const { dentistId } = req.params;  // Extract dentistId from params
//     const { date } = req.query;  // Extract date from query parameters

//     if (!dentistId || !date) {
//       return res.status(400).json({ message: "Invalid parameters. Please provide both dentistId and date." });
//     }

//     console.log(`Fetching available slots for dentistId: ${dentistId}, date: ${date}`);

//     const allSlots = [
//       "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
//       "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
//     ];

//     const startOfDay = new Date(date);
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date(date);
//     endOfDay.setHours(23, 59, 59, 999);

//     const existingAppointments = await Appointment.find({
//       dentist: dentistId,
//       date: { $gte: startOfDay, $lte: endOfDay },
//     });

//     const bookedSlots = existingAppointments.map(appt =>
//       appt.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
//     );

//     const availableSlots = allSlots.map(slot => ({
//       time: slot,
//       available: !bookedSlots.includes(slot),
//     }));

//     res.status(200).json(availableSlots);
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     res.status(500).json({ message: error.message || "Server error" });
//   }
// };

const getAvailableSlots = async (req, res) => {
  try {
    const { dentistId } = req.params; 
    const { date } = req.query;  

    if (!dentistId || !date) {
      return res.status(400).json({ message: "Invalid parameters. Please provide both dentistId and date." });
    }

    console.log(`Fetching available slots for dentistId: ${dentistId}, date: ${date}`);

    const allSlots = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    ];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      dentist: dentistId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Extract booked times and normalize them for comparison
    const bookedSlots = existingAppointments.map(appt => {
      return new Date(appt.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }).replace(/^0/, '');  // Remove leading zero for consistency
    });

    console.log("Booked Slots:", bookedSlots);  // Debugging

    // Remove booked slots from available slots
    const availableSlots = allSlots.map(slot => ({
      time: slot,
      available: !bookedSlots.includes(slot.replace(/^0/, '')), // Normalize for comparison
    }));

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: error.message || "Server error" });
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

const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, slot } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    appointment.date = date;
    appointment.slot = slot;
    await appointment.save();

    res.status(200).json({ message: "Appointment rescheduled successfully.", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { bookAppointment, getAppointments, cancelAppointment, getAvailableSlots, updateAppointment };

