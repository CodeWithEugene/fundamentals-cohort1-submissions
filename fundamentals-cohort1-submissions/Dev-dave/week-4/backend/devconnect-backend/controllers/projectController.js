import Project from "../models/project.js";

// Create new project
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const author = req.user.id; // from auth middleware

    const project = await Project.create({ title, description, author });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("author", "name email")
      .populate("comments");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// Get a single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("author", "name email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "name email" },
      });

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
};


// ✅ Get all projects by a specific user
export const getProjectsByUser = async (req, res) => {
  try {
    const projects = await Project.find({ author: req.params.userId })
      .populate("author", "name email");

    if (!projects) return res.status(404).json({ message: "No projects found" });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user projects", error });
  }
};


// ✅ Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure only the project owner can delete
    if (project.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
