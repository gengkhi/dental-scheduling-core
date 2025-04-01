const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
 },
  specialty: { 
    type: String, 
    required: true 
},
  availableSlots: [{ 
    type: Date, 
    required: true }]
});

module.exports = mongoose.model("Dentist", DentistSchema);
