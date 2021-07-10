import User from "../model/User.js";

export const checkAdmin = async (req, res, next) => {
  if (req.user) {
    try {
      const user = await User.findById(req.user._id);
      if (user.role === "Administrator") {
        next();
      } else {
        return res.status(401).json({ message: "Unauthorized user" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized user" });
  }
};
