import User from "../model/User.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      if (err) throw err;
      if (!user || user.password !== req.body.password) {
        return res.status(401).json({
          message: "Authentication failed. Invalid user or password.",
        });
      }
      return res.json({
        token: jwt.sign(
          {
            email: user.email,
            username: user.username,
            _id: user._id,
            role: user.role,
          },
          "RESTFULAPIs"
        ),
      });
    }
  );
};

export const profile = async (req, res, next) => {
  if (req.user) {
    res.send(req.user);
    next();
  } else {
    return res.status(401).json({ message: "Invalid token" });
  }
};
