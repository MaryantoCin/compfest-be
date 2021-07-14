import Appointment from "../model/Appointment.js";

export const createAppointment = async (req, res) => {
  const appointment = new Appointment(req.body);
  console.log(appointment);
  try {
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentsById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.json(appointment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Data not found" });
  try {
    const updatedAppointment = await Appointment.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Data not found" });
  try {
    const deletedAppointment = await Appointment.deleteOne({
      _id: req.params.id,
    });
    res.status(200).json(deletedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerAppoinment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  let currentslot = appointment.slot;
  if (!appointment) return res.status(404).json({ message: "Data not found" });
  try {
    if (
      !appointment.registrants.some((registrant) =>
        registrant.equals(req.user._id)
      )
    ) {
      if (appointment.registrants.length < appointment.slot) {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
          req.params.id,
          { $push: { registrants: req.user._id } },
          { upsert: true, new: true }
        );
        const updatedAppointment2 = await Appointment.findByIdAndUpdate(
          req.params.id,
          { $set: { slot: currentslot - 1 } },
          { upsert: true, new: true }
        );
        res.status(200).json(updatedAppointment2);
      } else {
        res.status(401).json({ message: "Slot full" });
      }
    } else {
      res.status(401).json({ message: "Already registered" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  let currentslot = appointment.slot;
  if (!appointment) return res.status(404).json({ message: "Data not found" });
  try {
    if (
      appointment.registrants.some((registrant) =>
        registrant.equals(req.user._id)
      )
    ) {
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { $pull: { registrants: req.user._id } },
        { upsert: true, new: true }
      );
      const updatedAppointment2 = await Appointment.findByIdAndUpdate(
        req.params.id,
        { $set: { slot: currentslot + 1 } },
        { upsert: true, new: true }
      );
      res.status(200).json(updatedAppointment2);
    } else {
      res.status(401).json({ message: "User has not registered" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserInAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Data not found" });
  try {
    if (appointment.registrants) {
      const updatedAppointment = await Appointment.findById(
        req.params.id
      ).populate("registrants");
      res.status(200).json(updatedAppointment);
    } else {
      res.status(401).json({ message: "No registrants" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
