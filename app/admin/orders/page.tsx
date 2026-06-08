"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Order {
  _id: string;
  email: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filter && { status: filter }),
      });

      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();

      setOrders(data.orders);
      setTotalPages(data.pagination.pages);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-slate-600 mt-1">Manage customer orders</p>
        </div>
      </div>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow">
          <p className="text-slate-600">No orders found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                    <td className="px-6 py-3">{order.email}</td>
                    <td className="px-6 py-3">₹{order.amount}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 inline-block"
                      >
                        <Eye size={16} />
                      </Link>
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
