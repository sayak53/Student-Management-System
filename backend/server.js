const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB connection (USE ENV VARIABLE)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Port fix for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));