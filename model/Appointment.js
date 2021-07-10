import mongoose from "mongoose";
import User from "./User.js";

const Appointment = mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slot: {
    type: Number,
    required: true,
  },
  registrants: [
    {
      type: "ObjectId",
      ref: User,
    },
  ],
});

export default mongoose.model("Appointments", Appointment);
