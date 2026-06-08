"use client";

import { useEffect, useState, useCallback } from "react";
import { ToggleRight } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();

      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (e) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdating(userId);
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success(`User ${!currentStatus ? "promoted to" : "removed from"} admin`);
      fetchUsers();
    } catch (e) {
      toast.error("Failed to update user");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-slate-600 mt-1">Manage user accounts and permissions</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow">
          <p className="text-slate-600">No users found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-3">{user.name}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                        disabled={updating === user._id}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                        title={user.isAdmin ? "Remove admin" : "Make admin"}
                      >
                        <ToggleRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-slate-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page === totalPages}
              className="px-3 py-2 bg-slate-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
