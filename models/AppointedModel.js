const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  dentist: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Dentist", 
    required: true 
  },
  date: { 
    type: Date,
    required: true 
    },
  status: { 
    type: String,
    enum: ["Scheduled", "Completed", "Canceled"],
    default: "Scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
