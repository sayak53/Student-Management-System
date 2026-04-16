import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    course: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  // 🔹 Fetch students
  const fetchStudents = async () => {
    const res = await fetch("http://localhost:5000/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add / Update
  const saveStudent = async () => {
    if (editingId) {
      await fetch(`http://localhost:5000/api/students/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }

    setForm({ name: "", age: "", course: "" });
    fetchStudents();
  };

  // 🔹 Delete
  const deleteStudent = async (id) => {
    await fetch(`http://localhost:5000/api/students/${id}`, {
      method: "DELETE"
    });
    fetchStudents();
  };

  // 🔹 Edit
  const editStudent = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      course: student.course
    });
    setEditingId(student._id);
  };

  // 🔥 Dynamic Courses
  const courses = [...new Set(students.map((s) => s.course))];

  // 🔥 Combined Logic
  const processedStudents = students
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) =>
      filterCourse ? s.course === filterCourse : true
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.age - b.age;
      if (sortOrder === "desc") return b.age - a.age;
      return 0;
    });

  return (
    <div className="dashboard">

      {/* 🧭 Navbar */}
      <div className="navbar">
        <h2>🎓 Student Dashboard</h2>
      </div>

      {/* 📊 Stats */}
      <div className="stats">
        <div className="stat-card">
          <h3>{students.length}</h3>
          <p>Total Students</p>
        </div>

        {courses.map((course, index) => (
          <div key={index} className="stat-card">
            <h3>
              {students.filter((s) => s.course === course).length}
            </h3>
            <p>{course} Students</p>
          </div>
        ))}
      </div>

      {/* 🔍 Controls */}
      <div className="controls">
        <input
          placeholder="🔍 Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort by Age</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

        <select onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="">All Courses</option>

          {courses.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 📦 Layout */}
      <div className="main">

        {/* 🧾 Form */}
        <div className="form-section">
          <h3>Add Student</h3>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />
          <input
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
          />

          <button onClick={saveStudent}>
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* 📋 List */}
        <div className="list-section">
          {processedStudents.map((s) => (
            <div key={s._id} className="student-card">
              <div className="student-info">
                <strong>{s.name}</strong>
                <p>{s.age} yrs • {s.course}</p>
              </div>

              <div className="actions">
                <button onClick={() => editStudent(s)}>✏️</button>
                <button onClick={() => deleteStudent(s._id)}>❌</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;