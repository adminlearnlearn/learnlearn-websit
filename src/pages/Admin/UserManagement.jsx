import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

import DeactivateUserModal from "../../components/admin/users/modals/DeactivateUserModal";
import ResetAccountModal from "../../components/admin/users/modals/ResetAccountModal";
import UserSummaryCard from "../../components/admin/users/UserSummaryCard";
import UserTable from "../../components/admin/users/UserTable";
import UserDetail from "../../components/admin/users/UserDetail";
import AddUserModal from "../../components/admin/users/modals/AddUserModal";
import EditUserModal from "../../components/admin/users/modals/EditUserModal";
import SuccessModal from "../../components/common/SuccessModal";
import GeneratePasswordModal from "../../components/admin/users/modals/GeneratePasswordModal";

function UserManagement() {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

  const handleDeactivate = async () => {
    if (!selectedUser) return;

    const userId = selectedUser.id;

    try {
      await updateDoc(doc(db, "users", userId), {
        status: "inactive",
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "inactive" } : user,
        ),
      );

      setIsDeactivateModalOpen(false);
      setSuccessMessage("Account deactivated successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Deactivate user error:", error);
      alert("Cannot deactivate user");
    }
  };
  const handleUpdateUser = async (updatedUser) => {
    const updatedData = {
      name: updatedUser.name,
      email: updatedUser.email,
      school: updatedUser.school,
      isLocked: false,
      failedLoginCount: 0,
      status: "active",
    };

    try {
      const userRef = doc(db, "users", updatedUser.id);

      await updateDoc(userRef, updatedData);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedData } : user,
        ),
      );

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Update user error:", error);
      alert("Cannot update user");
    }
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const inactiveUsers = users.filter(
    (user) => user.status === "inactive",
  ).length;

  const filteredUsers = users.filter((user) => {
    const keyword = searchText.toLowerCase();

    const matchSearch =
      user.username?.toLowerCase().includes(keyword) ||
      user.school?.toLowerCase().includes(keyword) ||
      user.status?.toLowerCase().includes(keyword);

    const matchStatus = statusFilter === "all" || user.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleSaveUser = async (userData) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: userData.name,
        email: userData.email,
        school: userData.school,
        role: userData.role,
        status: "active",
        joinDate: userData.joinDate,
        createdAt: serverTimestamp(),
        lastLoginAt: null,
        password: null,
        tempPassword: null,
        mustChangePassword: false,
        failedLoginCount: 0,
        isLocked: false,
      });

      setUsers((prev) => [
        ...prev,
        {
          id: docRef.id,
          name: userData.name,
          email: userData.email,
          school: userData.school,
          role: userData.role,
          status: "active",
          joinDate: userData.joinDate,
          lastLoginAt: null,
          password: null,
          tempPassword: null,
          mustChangePassword: false,
          failedLoginCount: 0,
          isLocked: false,
        },
      ]);

      setIsAddModalOpen(false);
      setSuccessMessage("User added successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Add user error:", error);
      setSuccessMessage("Cannot add user.");
      setShowSuccessModal(true);
    }
  };
  const handleResetAccount = async (userId) => {
    const updatedData = {
      failedLoginCount: 0,
      isLocked: false,
      status: "active",
      tempPassword: null,
      mustChangePassword: true,
    };
    try {
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        failedLoginCount: 0,
        isLocked: false,
        status: "active",
        tempPassword: null,
        mustChangePassword: true,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                failedLoginCount: 0,
                isLocked: false,
                status: "active",
              }
            : user,
        ),
      );

      setSuccessMessage("Account reset successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Cannot reset account");
    }
  };
  const handleDeactivateUser = async (userId) => {
    await handleDeactivateUser(userId);
    if (!selectedUser) return;

    try {
      await handleDeactivateUser(selectedUser.id);

      setSuccessMessage("Account deactivated successfully.");
      setIsDeactivateModalOpen(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Deactivate user error:", error);
      alert("Cannot deactivate user");
    }
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      status: "inactive",
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "inactive" } : user,
      ),
    );
  };
  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "@#$!";

    const allChars = upper + lower + numbers + symbols;

    let password =
      upper[Math.floor(Math.random() * upper.length)] +
      lower[Math.floor(Math.random() * lower.length)] +
      numbers[Math.floor(Math.random() * numbers.length)] +
      symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setGeneratedPassword(password);
  };
  const handleSaveGeneratedPassword = async () => {
    if (!selectedUser || !generatedPassword) return;

    const updatedData = {
      tempPassword: generatedPassword,
      mustChangePassword: true,
      isLocked: false,
      failedLoginCount: 0,
      status: "active",
    };

    try {
      const userRef = doc(db, "users", selectedUser.id);

      await updateDoc(userRef, updatedData);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedData } : user,
        ),
      );

      setShowGenerateModal(false);
      setSuccessMessage("Password generated successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Generate password error:", error);
      alert("Cannot save generated password");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">User Management</h1>
      {/* summery crad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <UserSummaryCard
          iconColor="blue"
          title="Total User"
          value={totalUsers}
          subtitle="All User in Systems"
          onClick={() => setStatusFilter("all")}
        />

        <UserSummaryCard
          iconColor="green"
          title="Active User"
          value={activeUsers}
          subtitle="Active Users"
          onClick={() => setStatusFilter("active")}
        />

        <UserSummaryCard
          iconColor="red"
          title="Inactive User"
          value={inactiveUsers}
          subtitle="Inactive Users"
          onClick={() => setStatusFilter("inactive")}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <UserTable
          users={filteredUsers}
          onAddUser={() => setIsAddModalOpen(true)}
          onSelectUser={(user) => setSelectedUserId(user.id)}
          searchText={searchText}
          setSearchText={setSearchText}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <UserDetail
          user={selectedUser}
          onEdit={() => setIsEditModalOpen(true)}
          onResetAccount={() => setIsResetModalOpen(true)}
          onDeactivateUser={() => setIsDeactivateModalOpen(true)}
          onGeneratePassword={() => {
            generatePassword();
            setShowGenerateModal(true);
          }}
        />
      </div>

      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateUser}
        />
      )}
      {isResetModalOpen && selectedUser && (
        <ResetAccountModal
          user={selectedUser}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={() => {
            handleResetAccount(selectedUser.id);
            setIsResetModalOpen(false);
          }}
        />
      )}
      {isDeactivateModalOpen && selectedUser && (
        <DeactivateUserModal
          user={selectedUser}
          onClose={() => setIsDeactivateModalOpen(false)}
          onConfirm={handleDeactivate}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showGenerateModal && selectedUser && (
        <GeneratePasswordModal
          user={selectedUser}
          password={generatedPassword}
          onGenerate={generatePassword}
          onClose={() => setShowGenerateModal(false)}
          onSendLink={handleSaveGeneratedPassword}
        />
      )}
    </div>
  );
}

export default UserManagement;
