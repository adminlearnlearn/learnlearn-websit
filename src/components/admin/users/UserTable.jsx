import { Search, Plus } from "lucide-react";

function UserTable({ users, onAddUser, onSelectUser }) {
  const formatDate = (value) => {
    if (!value) return "-";

    if (value.seconds) {
      return new Date(value.seconds * 1000).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    return value;
  };
  return (
    <div className="bg-white shadow-md border border-gray-100 p-4 min-h-[620px]">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
        <div className="relative w-full md:w-[360px]">
          <input
            type="text"
            placeholder="Search By Username School Status"
            className="w-full h-10 border border-gray-300 rounded-lg pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search
            size={18}
            className="absolute right-3 top-2.5 text-gray-700"
          />
        </div>

        <button className="h-10 w-full md:w-auto px-6 ...">All Status</button>
        {/*Add User */}
        <button
          onClick={onAddUser}
          className="h-10 px-6 rounded-lg bg-blue-600 text-white shadow-md text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="min-w-[700px] w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">School</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last login</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user , index ) => (
              <tr
                key={`${user.id}-${index}`}
                onClick={() => {
                  // console.log("selected user:", user);
                  onSelectUser(user);
                }}
                className="border bg-gray-50 cursor-pointer hover:bg-blue-50"
              >
                <td className="py-3 px-4 flex items-center gap-6">
                  <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold">{user.name}</span>
                </td>

                <td className="py-3 px-4 font-semibold">{user.school}</td>

                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                      user.status === "active"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-red-300 bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.status === "active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs">
                  {formatDate(user.lastLoginAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;
