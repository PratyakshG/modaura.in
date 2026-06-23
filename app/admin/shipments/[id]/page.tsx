"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { shipmentTypes } from "@/types/index";

const statuses = [
  "pending",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function ShipmentDetailsPage() {
  const params = useParams();
  // const router = useRouter();
  const shipmentId = params.id as string;
  const [shipment, setShipment] = useState<shipmentTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetchShipment();
  }, [shipmentId]);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/shipments/${shipmentId}`);
      const data = await res.json();
      setShipment(data.shipment);
      setFormData(data.shipment);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch shipment");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/shipments/${shipmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: formData?.status,
          actualDeliveryDate: formData?.actualDeliveryDate || undefined,
          notes: formData?.notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Shipment updated successfully");
      fetchShipment();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update shipment");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!shipment) {
    return <div className="text-center py-12">Shipment not found</div>;
  }

  return (
    <div>
      <Link
        href="/admin/shipments"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Shipments
      </Link>

      <h1 className="text-3xl font-bold mb-2">
        Shipment #{shipment.trackingNumber}
      </h1>
      <p className="text-slate-600 mb-8">
        Created {new Date(shipment.createdAt).toLocaleString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData?.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map((s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Actual Delivery Date
              </label>
              <input
                type="datetime-local"
                name="actualDeliveryDate"
                value={formData?.actualDeliveryDate?.substring(0, 16) || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData?.notes || ""}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Shipment"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Shipment Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Tracking Number</p>
                <p className="font-mono">{shipment.trackingNumber}</p>
              </div>
              <div>
                <p className="text-slate-600">Carrier</p>
                <p className="font-semibold">{shipment.carrier}</p>
              </div>
              <div>
                <p className="text-slate-600">Est. Delivery</p>
                <p>
                  {shipment.estimatedDeliveryDate
                    ? new Date(
                        shipment.estimatedDeliveryDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Delivery Address</h2>
            <div className="text-sm space-y-1">
              <p>{shipment.address?.street}</p>
              <p>
                {shipment.address?.city}, {shipment.address?.state}
              </p>
              <p>{shipment.address?.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
