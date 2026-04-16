import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    course: ""
  });

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

  // 🔹 Add student
  const addStudent = async () => {
    await fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

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

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Student Manager</h1>

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

      <br /><br />

      <button onClick={addStudent}>Add Student</button>

      <ul style={{ listStyle: "none" }}>
        {students.map((s) => (
          <li key={s._id} style={{ margin: "10px" }}>
            {s.name} | {s.age} | {s.course}
            <button
              onClick={() => deleteStudent(s._id)}
              style={{ marginLeft: "10px" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;