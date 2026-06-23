"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ShipmentFormData {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  notes: string;
}

const carriers = [
  "FedEx",
  "UPS",
  "DHL",
  "India Post",
  "Flipkart Logistics",
  "Delhivery",
];
const statuses = [
  "pending",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export default function NewShipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShipmentFormData>({
    orderId: "",
    trackingNumber: "",
    carrier: "India Post",
    status: "pending",
    estimatedDeliveryDate: "",
    actualDeliveryDate: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    notes: "",
  });

  type AddressKey = keyof ShipmentFormData["address"];
  type ShipmentFormDataKey = keyof ShipmentFormData;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressKey = name.replace("address.", "") as AddressKey;
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressKey]: value,
        },
      }));
    } else {
      const key = name as ShipmentFormDataKey;
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.orderId || !formData.trackingNumber || !formData.carrier) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create shipment");

      toast.success("Shipment created successfully");
      router.push("/admin/shipments");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create Shipment</h1>
      <p className="text-slate-600 mb-8">Create a new shipment record</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-8 max-w-2xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Order ID *
              </label>
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="Enter Order ID"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Tracking Number *
              </label>
              <input
                type="text"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleInputChange}
                placeholder="Enter Tracking Number"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Carrier *
              </label>
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {carriers.map((c) => (
                  <option
                    key={c}
                    value={c}
                  >
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Est. Delivery Date
              </label>
              <input
                type="datetime-local"
                name="estimatedDeliveryDate"
                value={formData.estimatedDeliveryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Actual Delivery Date
              </label>
              <input
                type="datetime-local"
                name="actualDeliveryDate"
                value={formData.actualDeliveryDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Address
            </label>
            <div className="space-y-3">
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                placeholder="Street"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Add any notes about this shipment..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Shipment"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
