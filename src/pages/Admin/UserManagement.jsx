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

import DeactivateUserModal from "../../components/admin/users/DeactivateUserModal";
import ResetAccountModal from "../../components/admin/users/ResetAccountModal";
import UserSummaryCard from "../../components/admin/users/UserSummaryCard";
import UserTable from "../../components/admin/users/UserTable";
import UserDetail from "../../components/admin/users/UserDetail";
import AddUserModal from "../../components/admin/users/AddUserModal";
import EditUserModal from "../../components/admin/users/EditUserModal";
import SuccessModal from "../../components/admin/users/SuccessModal";
import GeneratePasswordModal from "../../components/admin/users/GeneratePasswordModal";

function UserManagement() {
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleDeactivate = async () => {
    await handleDeactivateUser(selectedUser.id);

    setSuccessMessage("Account deactivated successfully.");
    setIsDeactivateModalOpen(false);
    setShowSuccessModal(true);
  };
  const handleUpdateUser = async (updatedUser) => {
    try {
      const userRef = doc(db, "users", updatedUser.id);

      await updateDoc(userRef, {
        name: updatedUser.name,
        email: updatedUser.email,
        school: updatedUser.school,
        isLocked: false,
        failedLoginCount: 0,
        status: "active",
      });

      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );

      setSelectedUser(updatedUser);

      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
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

  const filteredUsers =
    statusFilter === "all"
      ? users
      : users.filter((user) => user.status === statusFilter);

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
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      status: "inactive",
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: "inactive" } : user,
      ),
    );

    setSelectedUser((prev) => (prev ? { ...prev, status: "inactive" } : prev));
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
    const userRef = doc(db, "users", selectedUser.id);

    await updateDoc(userRef, {
      name: selectedUser.name,
      tempPassword: generatedPassword,
      mustChangePassword: true,
      isLocked: false,
      failedLoginCount: 0,
      status: "active",
    });

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              tempPassword: generatedPassword,
              mustChangePassword: true,
              isLocked: false,
              failedLoginCount: 0,
              status: "active",
            }
          : user,
      ),
    );

    setSelectedUser((prev) => ({
      ...prev,
      tempPassword: generatedPassword,
      mustChangePassword: true,
      isLocked: false,
      failedLoginCount: 0,
      status: "active",
    }));

    setShowGenerateModal(false);
    setSuccessMessage("Password generated successfully.");
    setShowSuccessModal(true);
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
          onSelectUser={setSelectedUser}
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
