import user from "../models/User.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const user = await user.create(req.body);
        res.status(201).json(user); 
    } catch (error) {
        res.status(500).json({ message: error.message });
   }
};