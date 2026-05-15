"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import UserTable from "../components/UserTable";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import { UserPlus, Users, ShieldCheck, UserMinus, Loader2 } from "lucide-react";
import { apiFetch } from "../../lib/apiFetch";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (newUser: any) => {
    try {
      const response = await apiFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleEditUser = async (updatedUser: any) => {
    try {
      const response = await apiFetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await apiFetch(`/api/users?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Admins', value: users.filter(u => u.role === 'Admin').length, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Active', value: users.filter(u => u.status === 'Active').length, icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Users Management
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
              Manage your library community and permissions.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 group"
          >
            <UserPlus size={20} />
            Add New User
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in" style={{ animationDelay: '0.1s' }}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Member List</h3>
            {isLoading && <Loader2 size={20} className="animate-spin text-slate-400" />}
          </div>
          <UserTable users={users} onDelete={handleDeleteUser} onEdit={(user) => setEditingUser(user)} />
        </div>
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddUser} 
      />

      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onEdit={handleEditUser}
        user={editingUser}
      />
    </DashboardLayout>
  );
}
