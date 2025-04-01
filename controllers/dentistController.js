const Dentist = require("../models/DentistModel");
const STATUS_CODES = require("../utils/statusCode");
const MESSAGES = require("../utils/messages");

const addDentist = async (req, res) => {
  try {
    const { name, specialty, availableSlots } = req.body;

    const newDentist = new Dentist({ name, specialty, availableSlots });
    await newDentist.save();

    res.status(STATUS_CODES.CREATED).json({
      message: MESSAGES.SUCCESS.CREATED,
      dentist: newDentist
    });
  } catch (error) {
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERROR.SERVER_ERROR,
      error: error.message
    });
  }
};

// Get all dentists
const getDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find();
    res.status(STATUS_CODES.SUCCESS).json(dentists);
  } catch (error) {
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: MESSAGES.ERROR.SERVER_ERROR,
      error: error.message
    });
  }
};

module.exports = { addDentist, getDentists };
