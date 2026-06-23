"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CartItems, orderTypes, productTypes } from "@/types/index";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<orderTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      setOrder(data.order);
      setNewStatus(
        (data.order as Record<string, unknown>).paymentStatus as string,
      );
    } catch (e) {
      toast.error(`Failed to fetch order. Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    if (newStatus === order?.paymentStatus) return;

    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Order status updated");
      fetchOrder();
    } catch (e) {
      toast.error(`Failed to update order status. Error: ${e}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>;
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <h1 className="text-3xl font-bold mb-2">Order #{order._id.toString()}</h1>
      <p className="text-slate-600 mb-8">
        {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map(
                (item: productTypes & CartItems, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-start border-b pb-4"
                  >
                    <div>
                      <p className="font-semibold">{item.name || "Product"}</p>
                      <p className="text-sm text-slate-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price?.sellingPrice || "N/A"}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="text-slate-700 space-y-1">
              <p>
                <strong>Name:</strong> {order.address?.name}
              </p>
              <p>
                <strong>Phone:</strong> {order.address?.phone_number}
              </p>
              <p>
                <strong>Address:</strong> {order.address?.street},{" "}
                {order.address?.locality}
              </p>
              <p>
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Amount:</span>
                <strong>₹{order.amount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <strong>{order.paymentMode}</strong>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm mb-2">
                  <strong>Status:</strong>
                </p>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || newStatus === order.paymentStatus}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
