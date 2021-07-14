import express from "express";
import mongoose from "mongoose";
import route from "./route/index.js";
import cors from "cors";
import bodyParser from "body-parser";
import jsonwebtoken from "jsonwebtoken";
import User from "./model/User.js";

const app = express();

mongoose.connect("mongodb://localhost:27017/compfest_be", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Database Connected"));

User.create([
  {
    firstName: "Admin",
    lastName: "Compfest",
    age: "18",
    email: "admin@compfest.id",
    username: "Admin",
    password: "secret",
    role: "Administrator",
  },
])
  .then((user) => {
    console.log("Admin created");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      function (err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

app.use(cors());
app.use(express.json());

app.use("/api", route);

app.listen("3000", () => console.log("Server Running at port: 3000"));
