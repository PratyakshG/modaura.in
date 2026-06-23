"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

interface Shipment {
  _id: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  createdAt: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filter && { status: filter }),
      });

      const res = await fetch(`/api/admin/shipments?${params}`);
      const data = await res.json();

      setShipments(data.shipments);
      setTotalPages(data.pagination.pages);
    } catch (e) {
      console.log(e);
      toast.error("Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return;

    try {
      const res = await fetch(`/api/admin/shipments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Shipment deleted successfully");
      fetchShipments();
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete shipment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in_transit":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-yellow-100 text-yellow-700";
      case "out_for_delivery":
        return "bg-cyan-100 text-cyan-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>
          <p className="text-slate-600 mt-1">Track and manage shipments</p>
        </div>
        <Link
          href="/admin/shipments/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Shipment
        </Link>
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
          <option value="">All Shipments</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="in_transit">In Transit</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-500">Loading shipments...</p>
        </div>
      ) : shipments.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow">
          <p className="text-slate-600">No shipments found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Carrier
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr
                    key={shipment._id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-3 font-mono text-sm">
                      {shipment.trackingNumber}
                    </td>
                    <td className="px-6 py-3">{shipment.carrier}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}
                      >
                        {shipment.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <Link
                        href={`/admin/shipments/${shipment._id}`}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(shipment._id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        <Trash size={16} />
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
