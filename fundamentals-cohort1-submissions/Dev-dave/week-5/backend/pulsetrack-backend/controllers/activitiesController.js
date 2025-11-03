import Activity from "../models/Activity.js";

export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().populate("user", "name email");
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);
        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};