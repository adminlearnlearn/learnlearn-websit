import { Edit, Lock, Key, Trash2 } from "lucide-react";
import ActionButton from "./ActionButton";

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

function UserDetail({
  user,
  onEdit,
  onResetAccount,
  onDeactivateUser,
  onGeneratePassword,
}) {
  if (!user) {
    return (
      <div className=" bg-white shadow-md border border-gray-100 p-6 min-h-[620px] flex items-center justify-center text-gray-400 text-center">
        Select a user to view details
      </div>
    );
  }
  const normalizedStatus = String(user.status ?? "")
    .trim()
    .toLowerCase();
  const canResetAccount =
    String(user.status ?? "")
      .trim()
      .toLowerCase() === "inactive";
  const canDeactivateUser = normalizedStatus === "active";
  const displayName = user.name ?? user.username ?? "Unknown User";
  return (
    <div className="bg-white shadow-md border border-gray-100 p-4 grid-cols-[1fr_320px] min-h-[620px]">
      <h2 className="font-bold text-lg mb-6">User Details</h2>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-800 text-white flex items-center justify-center text-5xl mb-5">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <h3 className="text-2xl font-bold mb-6">{user.username}</h3>

        <div className="w-full grid-cols-[95px_1fr] gap-1 space-y-5 mb-8">
          <DetailRow label="Email :" value={user.email} />
          <DetailRow label="School :" value={user.school} />
          <DetailRow label="Join Date :" value={formatDate(user.joinDate)} />
          <DetailRow
            label="Last Login :"
            value={
              <span className="whitespace-nowrap">
                {formatDate(user.lastLoginAt)}
              </span>
            }
          />
        </div>

        <div className="w-full space-y-3">
          <ActionButton
            color="blue"
            icon={<Edit size={14} />}
            text="Edit User"
            onClick={onEdit}
          />
          <ActionButton
            color="indigo"
            icon={<Lock size={14} />}
            text="Reset Account"
            onClick={onResetAccount}
            disabled={!canResetAccount}
          />
          <ActionButton
            color="yellow"
            icon={<Key size={14} />}
            text="Generate Password"
            onClick={onGeneratePassword}
          />
          <ActionButton
            color="red"
            icon={<Trash2 size={14} />}
            text="Deactivate User"
            onClick={() => {
              if (!canDeactivateUser) return;
              onDeactivateUser();
            }}
            disabled={!canDeactivateUser}
          />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[95px_1fr] gap-2 items-start text-sm">
      <span className="font-semibold text-gray-900">{label}</span>
      <span className="text-gray-400 break-words">{value}</span>
    </div>
  );
}

export default UserDetail;
