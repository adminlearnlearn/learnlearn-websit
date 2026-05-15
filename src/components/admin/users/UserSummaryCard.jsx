import { Users } from "lucide-react";

function UserSummaryCard({ iconColor, title, value, subtitle , onClick  }) {
  const colorMap = {
    blue: "bg-cyan-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-600",
  };

  return (
    <button className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-5 h-24">
      <div
        className={`w-16 h-16 rounded-lg flex items-center justify-center ${colorMap[iconColor]}`}
      >
        <Users size={42} />
      </div>

      <div>
        <p className="text-gray-500 font-semibold">{title}</p>
        <p className="text-4xl font-bold leading-none">{value}</p>
        <p className="text-xs text-gray-300 mt-2">{subtitle}</p>
      </div>
    </button>
  );
}

export default UserSummaryCard;