import Appointment from "../models/Appointment.js";

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("user", "name email")
            .populate("doctor", "name specialty");
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};