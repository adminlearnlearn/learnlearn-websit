import { useState } from "react";

function EditUserModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [school, setSchool] = useState(user.school);

  const handleSubmit = () => {
    if (!name || !email || !school) {
      alert("Please fill all fields");
      return;
    }

    onSave({
      ...user,
      username: name,
       email: email.trim(),
      school,
    });
  };
  const handleClear = () => {
    setName("");
    setEmail("");
    setSchool("");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-bold mb-8">Edit User</h2>

          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <Input
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-400"
            label="Name"
            value={name}
            onChange={setName}
          />
          <Input
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-400"
            label="Email"
            value={email}
            onChange={setEmail}
          />
          <Input
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-400"
            label="School"
            value={school}
            onChange={setSchool}
          />
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
function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
export default EditUserModal;
