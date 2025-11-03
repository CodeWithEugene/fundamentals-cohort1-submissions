import Task from "../models/Task.js";

// ✅ Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title)
      return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
    });

    // Return task in format frontend expects
    res.status(201).json({ tasks: [task], totalPages: 1 });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get tasks with search, filter, and pagination
export const getTasks = async (req, res) => {
  try {
    const { search = "", filter = "all", page = 1, limit = 5 } = req.query;

    // Base filter: Admin sees all, user sees own tasks
    let taskFilter = req.user.role === "admin" ? {} : { user: req.user.id };

    // Search by title
    if (search) taskFilter.title = { $regex: search, $options: "i" };

    // Sorting
    let sortOption = { createdAt: -1 }; // default: most recent
    if (filter === "oldest") sortOption = { createdAt: 1 };

    // Count total tasks for pagination
    const totalTasks = await Task.countDocuments(taskFilter);

    // Fetch tasks with pagination and sorting
    const tasks = await Task.find(taskFilter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalPages = Math.ceil(totalTasks / limit);

    res.json({ tasks, totalPages });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete task (Admin only)
export const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
