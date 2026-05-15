import { useState } from "react";

function AddUserModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState("Teacher");
  const [joinDate, setJoinDate] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !school || !joinDate) {
      alert("Please fill all fields");
      return;
    }

    onSave({
      name,
      email: email.trim(),
      school,
      role,
      joinDate,
    });
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setSchool("");
    setRole("Teacher");
    setJoinDate("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[520px] rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Add New User</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={setName}
            placeholder="e.g. John Jaidee"
          />
          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="User@School.ac.th"
          />
          <Input
            label="School"
            value={school}
            onChange={setSchool}
            placeholder="e.g. School"
          />

          <div>
            <label className="block mb-2 font-medium">Join Date</label>
            <input
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            className="h-11 rounded-xl border border-gray-300 px-5 text-gray-600 hover:bg-gray-100"
            onClick={handleClear}
          >
            Clear All
          </button>

          <button
            onClick={handleSubmit}
            className="h-11 rounded-xl bg-blue-600 px-8 font-medium text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-gray-300 px-4 outline-none"
      />
    </div>
  );
}

export default AddUserModal;
