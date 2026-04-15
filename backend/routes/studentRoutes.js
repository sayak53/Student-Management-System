const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ➕ CREATE student
router.post("/", async (req, res) => {
  const newStudent = new Student(req.body);
  const saved = await newStudent.save();
  res.json(saved);
});

// 📖 GET all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// ❌ DELETE student
router.delete("/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✏️ UPDATE student
router.put("/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = router;