import Comment from "../models/comment.js";
import Project from "../models/project.js";

// Add a comment to a project
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { projectId } = req.params;
    const author = req.user.id;
    const comment = await Comment.create({ text, author, project: projectId });

    // Push the comment into the related project
    await Project.findByIdAndUpdate(projectId, {
      $push: { comments: comment._id },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Get all comments for a project
export const getCommentsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const comments = await Comment.find({ project: projectId })
      .populate("author", "name email");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};