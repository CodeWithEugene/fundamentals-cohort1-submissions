import User from "../models/user.js";
import Project from "../models/project.js";

// ✅ Get logged-in user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const projects = await Project.find({ author: req.user.id });

    res.status(200).json({ user, projects });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
