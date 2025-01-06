const express = require("express");
const { resolve } = require("path");

const app = express();
const port = process.env.PORT || 8000;

const connectDB = require("./database");
const User = require("./schema.js");

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});

app.post("/api/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Validation error: All fields are required" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Validation error: Email already exists" });
    }

    console.log("error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Example app listening at http://localhost:${port}`);
});
