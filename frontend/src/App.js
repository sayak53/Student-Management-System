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

  // 🔹 Add or Update student
  const saveStudent = async () => {
    if (editingId) {
      await fetch(`http://localhost:5000/api/students/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      setEditingId(null);
    } else {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    }

    setForm({ name: "", age: "", course: "" });
    fetchStudents();
  };

  // 🔹 Delete student
  const deleteStudent = async (id) => {
    await fetch(`http://localhost:5000/api/students/${id}`, {
      method: "DELETE"
    });
    fetchStudents();
  };

  // 🔹 Edit student
  const editStudent = (student) => {
    setForm({
      name: student.name,
      age: student.age,
      course: student.course
    });
    setEditingId(student._id);
  };

  return (
    <div className="container">
      <h1 className="title">🎓 Student Manager</h1>

      <div className="card">
        <input
          className="input"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="input"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <input
          className="input"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
        />

        <button className="button" onClick={saveStudent}>
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </div>

      <div className="list">
        {students.map((s) => (
          <div key={s._id} className="student-card">
            <div>
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
  );
}

export default App;